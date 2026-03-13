# backend/schemas.py

from pydantic import BaseModel, validator
from typing import Optional
import re


# ------------- Authentication Schemas -------------

class UserBase(BaseModel):
    username: str
    email: str
    full_name: Optional[str] = None
    
    @validator('email')
    def validate_email(cls, v):
        if '@' not in v or '.' not in v:
            raise ValueError('Invalid email address')
        return v


class UserCreate(UserBase):
    password: str
    confirm_password: str
    
    @validator('password')
    def validate_password(cls, v):
        # Password must contain: 1 uppercase, 1 special character, 1 number
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', v):
            raise ValueError('Password must contain at least one special character')
        if not re.search(r'\d', v):
            raise ValueError('Password must contain at least one number')
        return v
    
    @validator('confirm_password')
    def passwords_match(cls, v, values):
        if 'password' in values and v != values['password']:
            raise ValueError('Passwords do not match')
        return v


class UserLogin(BaseModel):
    username: str
    password: str


class ForgotPasswordRequest(BaseModel):
    email: str
    
    @validator('email')
    def validate_email(cls, v):
        if '@' not in v or '.' not in v:
            raise ValueError('Invalid email address')
        return v


class VerifyRecoveryCode(BaseModel):
    email: str
    recovery_code: str
    
    @validator('email')
    def validate_email(cls, v):
        if '@' not in v or '.' not in v:
            raise ValueError('Invalid email address')
        return v


class ResetPassword(BaseModel):
    email: str
    recovery_code: str
    new_password: str
    confirm_new_password: str
    
    @validator('new_password')
    def validate_new_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', v):
            raise ValueError('Password must contain at least one special character')
        if not re.search(r'\d', v):
            raise ValueError('Password must contain at least one number')
        return v
    
    @validator('confirm_new_password')
    def new_passwords_match(cls, v, values):
        if 'new_password' in values and v != values['new_password']:
            raise ValueError('Passwords do not match')
        return v


class UserResponse(UserBase):
    id: int
    recovery_code: Optional[str] = None
    is_active: int
    
    class Config:
        from_attributes = True  # Changed from orm_mode = True


class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse


# ------------- Equipment Schemas -------------

class EquipmentBase(BaseModel):
    name: str
    code: str
    category: Optional[str] = None
    lab: Optional[str] = None
    total_qty: int
    available_qty: int
    status: str


class EquipmentCreate(EquipmentBase):
    pass


class EquipmentUpdate(BaseModel):
    # sab optional, jo bhejo ge wohi update hoga
    name: Optional[str] = None
    code: Optional[str] = None
    category: Optional[str] = None
    lab: Optional[str] = None
    total_qty: Optional[int] = None
    available_qty: Optional[int] = None
    status: Optional[str] = None


class Equipment(EquipmentBase):
    id: int

    class Config:
        from_attributes = True  # Changed from orm_mode = True


# ------------- Issue Record Schemas -------------

class IssueRecordBase(BaseModel):
    issued_to: str
    issued_lab: str
    quantity: int
    issue_date: str
    return_date: Optional[str] = None
    status: str = "issued"


class IssueRecordCreate(IssueRecordBase):
    equipment_id: int


class IssueRecord(IssueRecordBase):
    id: int
    equipment_id: int

    class Config:
        from_attributes = True  # Changed from orm_mode = True


# ------------- Maintenance Schemas -------------

class MaintenanceBase(BaseModel):
    fault_description: str
    fault_date: str
    sent_for_repair_date: Optional[str] = None
    return_from_repair_date: Optional[str] = None
    status: str = "pending"
    remarks: Optional[str] = None


class MaintenanceCreate(MaintenanceBase):
    equipment_id: int


class Maintenance(MaintenanceBase):
    id: int
    equipment_id: int

    class Config:
        from_attributes = True  # Changed from orm_mode = True