# app/core/storage.py

"""
Azure Blob Storage Service for OwlClip
"""

import logging
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Optional

from azure.storage.blob import (
    BlobServiceClient,
    generate_blob_sas,
    BlobSasPermissions,
)
from app.core.config import settings

logger = logging.getLogger(__name__)


class StorageService:
    def __init__(self):
        self.connection_string = (
            f"DefaultEndpointsProtocol=https;"
            f"AccountName={settings.AZURE_STORAGE_ACCOUNT_NAME};"
            f"AccountKey={settings.AZURE_STORAGE_ACCOUNT_KEY};"
            f"EndpointSuffix=core.windows.net"
        )
        try:
            self.blob_service_client = BlobServiceClient.from_connection_string(
                self.connection_string
            )
        except Exception as e:
            logger.error(f"Failed to initialize Azure Blob Service Client: {e}")
            self.blob_service_client = None

    # ── Downloads ─────────────────────────────────────────────────────────────

    def generate_download_url(self, blob_name: str, container: str | None = None) -> str:
        """
        return a SAS-signed HTTPS URL that grants temporary *read* access to a blob.

        expires in 1 hour — enough for ffmpeg to seek through multi-gig videos.
        fallback: if no account key is configured, return the plain
        public URL (works only when the container has public-read ACL).
        """
        container = container or settings.AZURE_STORAGE_CONTAINER_CLIPS

        if not settings.AZURE_STORAGE_ACCOUNT_KEY:
            return (
                f"https://{settings.AZURE_STORAGE_ACCOUNT_NAME}"
                f".blob.core.windows.net/{container}/{blob_name}"
            )

        sas_token = generate_blob_sas(
            account_name=settings.AZURE_STORAGE_ACCOUNT_NAME,
            container_name=container,
            blob_name=blob_name,
            account_key=settings.AZURE_STORAGE_ACCOUNT_KEY,
            permission=BlobSasPermissions(read=True),
            expiry=datetime.now(timezone.utc) + timedelta(hours=1),
        )
        return (
            f"https://{settings.AZURE_STORAGE_ACCOUNT_NAME}"
            f".blob.core.windows.net/{container}/{blob_name}?{sas_token}"
        )

    async def upload_clip(self, file_path: str, job_id: str) -> Optional[str]:
        """Upload a video clip to Azure Blob Storage and return the URL"""
        if not self.blob_service_client:
            logger.error("Blob Service Client not initialized")
            return None

        path = Path(file_path)
        if not path.exists():
            logger.error(f"File not found: {file_path}")
            return None

        container_name = settings.AZURE_STORAGE_CONTAINER_CLIPS
        blob_name = f"{job_id}/{path.name}"

        try:
            container_client = self.blob_service_client.get_container_client(
                container_name
            )

            # Create container if it doesn't exist
            try:
                container_client.get_container_properties()
            except Exception:
                logger.info(f"Creating container: {container_name}")
                container_client.create_container()

            blob_client = container_client.get_blob_client(blob_name)

            logger.info(
                f"Uploading {file_path} to {container_name}/{blob_name}"
            )

            with open(file_path, "rb") as data:
                blob_client.upload_blob(data, overwrite=True)

            # Construct the plain URL (frontend will need to use this or a SAS url)
            url = (
                f"https://{settings.AZURE_STORAGE_ACCOUNT_NAME}"
                f".blob.core.windows.net/{container_name}/{blob_name}"
            )
            return url

        except Exception as e:
            logger.error(f"Failed to upload blob: {e}")
            return None


storage_service = StorageService()
