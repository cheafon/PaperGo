import os
from pathlib import Path
from typing import Optional, List, Dict, Any, Callable

from dotenv import load_dotenv
from llama_index.core.llms.function_calling import FunctionCallingLLM
from llama_index.llms.deepseek import DeepSeek
from llama_index.protocols.ag_ui.router import get_ag_ui_workflow_router
from workflows import Workflow

from .MyWorkflow import MyWorkflow
from .ace import prompts

env_path = Path(__file__).parent.parent / ".env"
load_dotenv(dotenv_path=env_path)
llm = DeepSeek(
    model="deepseek-chat",
    api_key=os.environ.get("DEEPSEEK_API_KEY")
)

def add(a:int,b:int)->int:
    """ 两数相加 """
    return a+b


def get_my_factory(
        llm: Optional[FunctionCallingLLM] = None,
        frontend_tools: Optional[List[str]] = None,
        backend_tools: Optional[List[str]] = None,
        initial_state: Optional[Dict[str, Any]] = None,
        system_prompt: Optional[str] = None,
        timeout: Optional[float] = 120,
) -> Callable[[], Workflow]:
    async def workflow_factory():
        return MyWorkflow(
            llm=llm,
            frontend_tools=frontend_tools,
            backend_tools=backend_tools,
            initial_state=initial_state,
            system_prompt=system_prompt,
            timeout=timeout,
        )
    return workflow_factory


agentic_generative_ui_router=get_ag_ui_workflow_router(
    workflow_factory=get_my_factory(
        llm=llm,
        backend_tools=[add],
        system_prompt=prompts.GENERATOR_PROMPT
    ),

)
#
# from llama_index.utils.workflow import draw_all_possible_flows
# # 生成者的prompt
# workflow = AGUIChatWorkflow()
# draw_all_possible_flows(workflow, filename="visual_html/some_filename.html")
