from enum import Enum

class JobLevel(str, Enum):
    L1 = "L1"   # Entry / Associate
    L2 = "L2"   # Intermediate
    L3 = "L3"   # Senior
    L4 = "L4"   # Lead / Specialist
    L5 = "L5"   # Manager / Principal
    L6 = "L6"   # Director
    L7 = "L7"   # VP / Executive


class EmploymentType(str, Enum):
    FULL_TIME = "FULL_TIME"
    PART_TIME = "PART_TIME"
    CONTRACTOR = "CONTRACTOR"

class EmployeeStatus(str, Enum):
    ACTIVE = "ACTIVE"
    INACTIVE = "INACTIVE"
