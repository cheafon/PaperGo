from fastapi import FastAPI
from .agent import agentic_generative_ui_router

app = FastAPI()
# app.include_router(workflow_router)

app.include_router(agentic_generative_ui_router)
