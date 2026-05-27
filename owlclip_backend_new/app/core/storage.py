# app/core/storage.py

"""
Azure Blob Storage Service for OwlClip
"""

import logging
from pathlib import Path
from typing import Optional
from azure.storage.blob import BlobServiceClient
from app.core.config import settings

logger = logging.getLogger(__name__)

class StorageService:
    def __init__(self):
        self.connection_string = f"DefaultEndpointsProtocol=https;AccountName={settings.AZURE_STORAGE_ACCOUNT_NAME};AccountKey={settings.AZURE_STORAGE_ACCOUNT_KEY};EndpointSuffix=core.windows.net"
        try:
            self.blob_service_client = BlobServiceClient.from_connection_string(self.connection_string)
        except Exception as e:
            logger.error(f"Failed to initialize Azure Blob Service Client: {e}")
            self.blob_service_client = None

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
            container_client = self.blob_service_client.get_container_client(container_name)
            
            # Create container if it doesn't exist
            try:
                container_client.get_container_properties()
            except Exception:
                logger.info(f"Creating container: {container_name}")
                container_client.create_container()

            blob_client = container_client.get_blob_client(blob_name)
            
            logger.info(f"Uploading {file_path} to {container_name}/{blob_name}")
            
            with open(file_path, "rb") as data:
                blob_client.upload_blob(data, overwrite=True)
            
            # Construct the URL (In production, use SAS tokens or public read)
            url = f"https://{settings.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net/{container_name}/{blob_name}"
            return url
            
        except Exception as e:
            logger.error(f"Failed to upload blob: {e}")
            return None

storage_service = StorageService()
