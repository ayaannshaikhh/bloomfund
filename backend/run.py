import uvicorn
from app.config import config

if __name__ == "__main__":
    # Validate configuration before starting
    try:
        config.validate()
    except ValueError as e:
        print(f"❌ Configuration error: {e}")
        print("Please check your .env file and ensure all required variables are set.")
        exit(1)
    
    print(f"🚀 Starting {config.API_TITLE} v{config.API_VERSION}")
    print(f"📍 Server running on http://{config.HOST}:{config.PORT}")
    print(f"📚 API docs available at http://{config.HOST}:{config.PORT}/docs")
    print(f"🔍 Alternative docs at http://{config.HOST}:{config.PORT}/redoc")
    
    uvicorn.run(
        "app.main:app",
        host=config.HOST,
        port=config.PORT,
        reload=config.DEBUG,
        log_level="info" if not config.DEBUG else "debug"
    )

