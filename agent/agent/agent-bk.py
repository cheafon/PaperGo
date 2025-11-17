import os
from pathlib import Path

from dotenv import load_dotenv
from llama_index.llms.deepseek import DeepSeek
from llama_index.protocols.ag_ui.router import get_ag_ui_workflow_router
from pydantic import BaseModel

from mcp_tools.mcp import backend_tools

env_path = Path(__file__).parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

"""
tool的参数是前端接收用的，docstring是说明功能的，return值是指导下一步行动的
"""


class Step(BaseModel):
    index: int
    description: str
    status: str
    result: str


class Task(BaseModel):
    steps: list[Step]


# 步骤分解
def plan_task(task: Task) -> str:
    """
    系统执行任务分解后，调用此函数将分解后的任务列表返回给前端
    :param task: 拆解后的任务
    """
    return "前端渲染任务拆解完毕，等待逐个任务执行"


# 步骤更新
def update_task(step: Step) -> str:
    """
    系统在执行每个分解的子任务后，调用此函数更新前端的子任务的状态
    :param step: 单个子任务
    """
    return f"执行子任务{step.description}完毕，执行下一个子任务"


# 初始预知：
# 能力：文件读写，文献搜索，
agentic_generative_ui_router = get_ag_ui_workflow_router(
    # llm=OpenAI(model="gpt-4.1"),
    llm=DeepSeek(
        model="deepseek-chat",
        api_key=os.environ.get("DEEPSEEK_API_KEY")
    ),
    frontend_tools=[plan_task, update_task],
    backend_tools=backend_tools,
    initial_state={},
    system_prompt=(
        """
            你是一个帮助科研人员进行科研工作的辅助助手，你有长期记忆的能力。
            当用户有任何需求的时候，请你按照以下的任务流程和注意事项来开始你的工作。
            任务流程：
            1.每一次进行工作之前都要读取[memory.md]进行任务回顾，用来回忆你之前做过的工作，以及推断下步工作的依据。如果记忆里面的数据足以解决任务，可以直接返回结果。
            2.经过思考过后，推断出下一步要做的事情。并在[memory.md]中更新一条即将要执行的任务（调用前端工具，调用mcp,输出及只要系统产出事件的任何情况），并记录状态为"待执行"。
            3.记录”待执行“成功后，开始执行，执行完毕后，将对应的任务状态更改为"已执行"。
            注意事项：
            - 读取memory.md的过程，向用户解释为“正在调用个人记忆库”。
            - 如果用户有的任务需要进行任务拆解，请进行合理的任务分解，并调用相关的前端工具，使前后端任务的状态要同步。
            - 如果用户的输入过于空泛，请直接向用户抛出疑问，等待用户输入。
            - 记录任务日志要总结全面，比如什么时候什么角色执行了什么操作产生了什么结果
        """
    )
)
