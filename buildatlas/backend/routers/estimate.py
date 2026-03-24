# Estimate router - POST /estimate
# Will be fully implemented in Phase 3 prompt

from fastapi import APIRouter
router = APIRouter()

@router.post("/estimate")
def estimate():
    return {"message": "estimate router placeholder"}
