# Playbook的Store包装
from abc import ABC, abstractmethod
from typing import Optional, List

from agent.agent.ace.playbook import Playbook


# TODO 在这里实现一个抽象类，他的实现
class PlaybookStore(ABC):
    # 载入方法
    @abstractmethod
    def load(self) -> Optional[List[Playbook]]:
        pass
