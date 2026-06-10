import httpx
import os

async def download_video_from_url(video_url: str, local_destination: str) -> bool:
    """
    Streams a video clip from a public or signed Azure Blob URL 
    and saves it as a physical file in the local server disk storage.
    """
    try:
        # Enforce that parent directories exist before writing
        os.makedirs(os.path.dirname(local_destination), exist_ok=True)
        
        # Use an async streaming client to protect server memory limits
        async with httpx.AsyncClient(timeout=60.0) as client:
            async with client.stream("GET", video_url) as response:
                if response.status_code != 200:
                    print(f"[DOWNLOAD ERROR] Failed to fetch URL. Status code: {response.status_code}")
                    return False
                
                # Pipe chunks sequentially straight onto the disk storage array
                with open(local_destination, "wb") as file:
                    async for chunk in response.iter_bytes(chunk_size=8192):
                        file.write(chunk)
                        
        print(f"[DOWNLOAD SUCCESS] Video successfully saved locally to: {local_destination}")
        return True
        
    except Exception as e:
        print(f"[DOWNLOAD EXCEPTION] Network transfer failed: {str(e)}")
        return False
