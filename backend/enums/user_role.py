from enum import Enum

class UserRole(Enum):
    OWNER = 'owner'
    ADMIN = 'admin'
    READER = 'reader'
    COLLABORATOR = 'collaborator'