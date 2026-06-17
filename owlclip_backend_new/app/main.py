from fastapi import FastAPI, Request,status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse  
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from app.middleware.ratelimiter import limiter
from contextlib import asynccontextmanager
from app.routers.v1 import v1_router
from app.core.database import engine, Base, AsyncSessionLocal
from app.middleware.auth import AuthMiddleware
from app.services.worker import worker_loop
from app.services.queue_service import QueueService
from app.core.config import settings
from app.utils.AppError import AppException
import logging
import asyncio
import sys
import warnings


import os
import sys
import io

# Set up environment BEFORE torch loads
os.environ['TORCH_ALLOW_TLS_TLS'] = '1'
os.environ['PYTORCH_ENABLE_MPS_FALLBACK'] = '1'
os.environ['OMP_NUM_THREADS'] = '4'

# Suppress NNPACK C-level warnings by filtering stderr
class NNPACKFilter(io.TextIOWrapper):
    def __init__(self, wrapped):
        self.wrapped = wrapped
    def write(self, msg):
        if "NNPACK" not in msg and "Could not initialize" not in msg:
            self.wrapped.write(msg)
        return len(msg)
    def __getattr__(self, name):
        return getattr(self.wrapped, name)

# Apply filter before torch imports
sys.stderr = NNPACKFilter(sys.stderr)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler('owlclip.log')
    ]
)


warnings.filterwarnings("ignore", category=UserWarning, module="torch")
warnings.filterwarnings("ignore", category=DeprecationWarning)

# Suppress Azure SDK verbose logging
logging.getLogger('azure.core.pipeline.policies.http_logging_policy').setLevel(logging.WARNING)
logging.getLogger('azure.core.pipeline').setLevel(logging.WARNING)
logging.getLogger('azure').setLevel(logging.WARNING)
logging.getLogger('urllib3').setLevel(logging.WARNING)

logger = logging.getLogger(__name__)

worker_task = None # Store worker task for cleanup


@asynccontextmanager
async def lifespan(app: FastAPI):
    global worker_task
    """
   Key idea:

 - Everything before yield = startup
 - Everything after yield = shutdown 
 
    """
    # === STARTUP ===
    logger.info("Starting up OwlClip API...")
    
    # Create database tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info("Database tables ready")
    
    try:
        
        conn_str = f"DefaultEndpointsProtocol=https;AccountName={settings.AZURE_STORAGE_ACCOUNT_NAME};AccountKey={settings.AZURE_STORAGE_ACCOUNT_KEY};EndpointSuffix=core.windows.net"
        queue_service = QueueService(conn_str=conn_str,queue_name = "upload-jobs" )
        async def run_worker():
                await worker_loop(queue_service)
        worker_task = asyncio.create_task(run_worker())
        logger.info("Worker Started successfully")
    except Exception as e:
        logger.error(f"Failed to start worker:{e}")
    
    yield
    
    logger.info("Shutting down OwlClip API")
    
    if worker_task:
        worker_task.cancel()
        try:
            await worker_task
        except asyncio.CancelledError:
            pass
    await engine.dispose()
    logger.info("Database connections closed")



app = FastAPI(
    title="OwlClip API",
    description="AI-powered video clipping and transcription service",
    version="1.0.0",
    lifespan=lifespan
)

# State registration required by Slowapi internally
app.state.limiter = limiter

# Tell FastAPI to return a 429 error automatically when limits are hit
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

          

app.add_middleware(AuthMiddleware)
                                         
app.add_middleware(
    CORSMiddleware, 
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True, 
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"]
)    


app.include_router(v1_router)

logger.info("OwlClip API initialized")

@app.exception_handler(AppException)
async def app_exception_handler(request: Request, exc: AppException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": {
                "code": exc.code,
                "message": exc.message,
                "issues": exc.issues
            }
        }
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    formatted_issues = []
    for error in exc.errors():
        # Grabs the field name cleanly (e.g., 'body' -> 'email' -> outputs 'email')
        field_name = error["loc"][-1] if error["loc"] else "unknown"
        formatted_issues.append({
            "field": str(field_name),
            "message": error["msg"].capitalize()
        })
        
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={
            "success": False,
            "error": {
                "code": "VALIDATION_FAILED",
                "message": "Invalid input formatting provided.",
                "issues": formatted_issues
            }
        }
    )
