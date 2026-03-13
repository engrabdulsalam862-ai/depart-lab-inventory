# backend/main.py

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from typing import List
from sqlalchemy.orm import Session
from datetime import timedelta

# Import local modules
import models
import schemas
import crud
import auth
from database import engine, get_db
from dependencies import get_current_user

# Create tables (this will also be called on import)
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Department Lab Inventory API",
    description="API for lab equipment, issue records, and maintenance (CEP Project)",
    version="1.0.0",
)

# Allow React frontend to access API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# ------------- Public Endpoints (No authentication required) -------------

@app.post("/signup", response_model=schemas.UserResponse, status_code=201)
def signup(user_in: schemas.UserCreate, db: Session = Depends(get_db)):
    user, error = crud.create_user(db, user_in)
    if error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=error
        )
    return user


@app.post("/login", response_model=schemas.Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user, error = crud.authenticate_user(db, form_data.username, form_data.password)
    if error:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=error,
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }


@app.post("/forgot-password")
def forgot_password(request: schemas.ForgotPasswordRequest, db: Session = Depends(get_db)):
    user, error = crud.generate_recovery_code(db, request.email)
    if error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=error
        )
    
    # In production, send this via email
    # For development, we return it
    return {
        "message": "Recovery code generated successfully",
        "email": user.email,
        "recovery_code": user.recovery_code  # Remove in production
    }


@app.post("/verify-recovery-code")
def verify_recovery_code(verification: schemas.VerifyRecoveryCode, db: Session = Depends(get_db)):
    user, error = crud.verify_recovery_code(db, verification.email, verification.recovery_code)
    if error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=error
        )
    
    return {"message": "Recovery code verified successfully"}


@app.post("/reset-password")
def reset_password(reset_data: schemas.ResetPassword, db: Session = Depends(get_db)):
    user, error = crud.reset_password(
        db, reset_data.email, reset_data.recovery_code, reset_data.new_password
    )
    if error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=error
        )
    
    return {"message": "Password reset successful"}


# ------------- Protected Endpoints (Authentication required) -------------
# All these endpoints require valid JWT token

@app.get("/me", response_model=schemas.UserResponse)
def get_current_user_info(current_user: models.User = Depends(get_current_user)):
    return current_user


@app.get("/equipments", response_model=List[schemas.Equipment])
def read_equipments(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Only accessible by logged-in users"""
    return crud.get_all_equipment(db)


@app.get("/equipments/{equipment_id}", response_model=schemas.Equipment)
def read_equipment(
    equipment_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    db_item = crud.get_equipment(db, equipment_id)
    if not db_item:
        raise HTTPException(status_code=404, detail="Equipment not found")
    return db_item


@app.post("/equipments", response_model=schemas.Equipment, status_code=201)
def create_equipment(
    equipment_in: schemas.EquipmentCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return crud.create_equipment(db, equipment_in)


@app.put("/equipments/{equipment_id}", response_model=schemas.Equipment)
def update_equipment(
    equipment_id: int,
    equipment_in: schemas.EquipmentUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    db_item = crud.update_equipment(db, equipment_id, equipment_in)
    if not db_item:
        raise HTTPException(status_code=404, detail="Equipment not found")
    return db_item


@app.delete("/equipments/{equipment_id}")
def delete_equipment(
    equipment_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    ok = crud.delete_equipment(db, equipment_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Equipment not found")
    return {"detail": "Equipment deleted successfully"}


@app.get("/issues", response_model=List[schemas.IssueRecord])
def read_issues(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return crud.get_issue_records(db)


@app.post("/issues", response_model=schemas.IssueRecord, status_code=201)
def create_issue(
    issue_in: schemas.IssueRecordCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return crud.create_issue_record(db, issue_in)


@app.put("/issues/{issue_id}", response_model=schemas.IssueRecord)
def update_issue(
    issue_id: int,
    issue_in: schemas.IssueRecordCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    db_item = crud.update_issue_record(db, issue_id, issue_in)
    if not db_item:
        raise HTTPException(status_code=404, detail="Issue record not found")
    return db_item


@app.delete("/issues/{issue_id}")
def delete_issue(
    issue_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    ok = crud.delete_issue_record(db, issue_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Issue record not found")
    return {"detail": "Issue record deleted successfully"}


@app.get("/maintenance", response_model=List[schemas.Maintenance])
def read_maintenance(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return crud.get_maintenance_records(db)


@app.post("/maintenance", response_model=schemas.Maintenance, status_code=201)
def create_maintenance(
    m_in: schemas.MaintenanceCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return crud.create_maintenance(db, m_in)


@app.put("/maintenance/{m_id}", response_model=schemas.Maintenance)
def update_maintenance(
    m_id: int,
    m_in: schemas.MaintenanceCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    db_item = crud.update_maintenance(db, m_id, m_in)
    if not db_item:
        raise HTTPException(status_code=404, detail="Maintenance record not found")
    return db_item


@app.delete("/maintenance/{m_id}")
def delete_maintenance(
    m_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    ok = crud.delete_maintenance(db, m_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Maintenance record not found")
    return {"detail": "Maintenance record deleted successfully"}


# Health check endpoint
@app.get("/")
def read_root():
    return {"message": "Department Lab Inventory API is running"}


# Check database connection
@app.get("/health")
def health_check(db: Session = Depends(get_db)):
    try:
        # Try to execute a simple query
        db.execute("SELECT 1")
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        return {"status": "unhealthy", "database": "disconnected", "error": str(e)}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)