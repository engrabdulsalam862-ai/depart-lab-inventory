#!/usr/bin/env python3
"""
Quick test script to debug signup issues
"""
from passlib.context import CryptContext

# Test the pwd_context configuration
pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
    bcrypt__rounds=10
)

test_password = "TestPass@123"

print("Testing password hashing...")
print(f"Test password: {test_password}")

try:
    hashed = pwd_context.hash(test_password)
    print(f"✅ Hashed successfully: {hashed[:50]}...")
    
    # Test verification
    is_valid = pwd_context.verify(test_password, hashed)
    print(f"✅ Verification: {is_valid}")
    
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()

# Test database connection
print("\n" + "="*50)
print("Testing database connection...")
try:
    from database import engine, SessionLocal
    from models import Base
    
    # Create tables
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created")
    
    # Test session
    db = SessionLocal()
    result = db.execute("SELECT 1")
    print(f"✅ Database connection successful: {result.fetchone()}")
    db.close()
    
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()
