# Chat router - POST /chat
# Will be fully implemented in Phase 3 prompt

from fastapi import APIRouter
router = APIRouter()

@router.post("/chat")
def chat():
    return {"message": "chat router placeholder"}
