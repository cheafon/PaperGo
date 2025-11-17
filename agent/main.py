import uvicorn
def main():
    uvicorn.run(
        "agent.server:app",  # Import path to FastAPI app
        host="127.0.0.1",
        port=9000,
        reload=True,  # Auto-reload on code changes
        log_level="info",  # Change to "debug" for more verbose logging
        # reload_dirs=["./agent"],  # Uncomment to limit reload to specific dirs
    )
if __name__ == '__main__':
    main()