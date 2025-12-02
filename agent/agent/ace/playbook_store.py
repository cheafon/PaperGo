# Playbook的Store包装
import json
import os
from abc import ABC, abstractmethod
from pathlib import Path
from typing import Optional, List

from agent.agent.ace.playbook import Playbook


class PlaybookStore(ABC):
    """Abstract base class for Playbook storage implementations."""

    @abstractmethod
    def load(self) -> Optional[List[Playbook]]:
        """Load all playbooks from the store.

        Returns:
            List of Playbook objects, or None if no playbooks exist.
        """
        pass

    @abstractmethod
    def save(self, playbook: Playbook, playbook_id: str) -> bool:
        """Save a playbook to the store.

        Args:
            playbook: The Playbook object to save.
            playbook_id: Unique identifier for the playbook.

        Returns:
            True if save was successful, False otherwise.
        """
        pass

    @abstractmethod
    def get(self, playbook_id: str) -> Optional[Playbook]:
        """Retrieve a specific playbook by ID.

        Args:
            playbook_id: The unique identifier of the playbook.

        Returns:
            The Playbook object if found, None otherwise.
        """
        pass

    @abstractmethod
    def delete(self, playbook_id: str) -> bool:
        """Delete a playbook from the store.

        Args:
            playbook_id: The unique identifier of the playbook.

        Returns:
            True if deletion was successful, False otherwise.
        """
        pass

    @abstractmethod
    def list_ids(self) -> List[str]:
        """List all playbook IDs in the store.

        Returns:
            List of playbook IDs.
        """
        pass


class JsonPlaybookStore(PlaybookStore):
    """File-based Playbook storage using JSON files."""

    def __init__(self, storage_dir: str = "./playbooks"):
        """Initialize the JSON-based playbook store.

        Args:
            storage_dir: Directory path where playbook JSON files will be stored.
        """
        self.storage_dir = Path(storage_dir)
        self.storage_dir.mkdir(parents=True, exist_ok=True)

    def _get_filepath(self, playbook_id: str) -> Path:
        """Get the file path for a playbook ID."""
        return self.storage_dir / f"{playbook_id}.json"

    def load(self) -> Optional[List[Playbook]]:
        """Load all playbooks from JSON files."""
        playbooks = []
        for filepath in self.storage_dir.glob("*.json"):
            try:
                with open(filepath, "r", encoding="utf-8") as f:
                    data = f.read()
                    playbook = Playbook.loads(data)
                    playbooks.append(playbook)
            except (json.JSONDecodeError, ValueError, IOError) as e:
                print(f"Warning: Failed to load playbook from {filepath}: {e}")
                continue

        return playbooks if playbooks else None

    def save(self, playbook: Playbook, playbook_id: str) -> bool:
        """Save a playbook to a JSON file."""
        try:
            filepath = self._get_filepath(playbook_id)
            data = playbook.dumps()
            with open(filepath, "w", encoding="utf-8") as f:
                f.write(data)
            return True
        except (IOError, ValueError) as e:
            print(f"Error: Failed to save playbook {playbook_id}: {e}")
            return False

    def get(self, playbook_id: str) -> Optional[Playbook]:
        """Retrieve a specific playbook by ID."""
        filepath = self._get_filepath(playbook_id)
        if not filepath.exists():
            return None

        try:
            with open(filepath, "r", encoding="utf-8") as f:
                data = f.read()
                return Playbook.loads(data)
        except (json.JSONDecodeError, ValueError, IOError) as e:
            print(f"Error: Failed to load playbook {playbook_id}: {e}")
            return None

    def delete(self, playbook_id: str) -> bool:
        """Delete a playbook JSON file."""
        filepath = self._get_filepath(playbook_id)
        if not filepath.exists():
            return False

        try:
            filepath.unlink()
            return True
        except IOError as e:
            print(f"Error: Failed to delete playbook {playbook_id}: {e}")
            return False

    def list_ids(self) -> List[str]:
        """List all playbook IDs by scanning JSON files."""
        ids = []
        for filepath in self.storage_dir.glob("*.json"):
            # Remove the .json extension to get the ID
            ids.append(filepath.stem)
        return sorted(ids)
