from fastapi import APIRouter, HTTPException
from app.models.workflow import Workflow, WorkflowCreate, WorkflowExecute
from app.services.workflow_generator import workflow_generator
from app.services.workflow_executor import workflow_executor

router = APIRouter()

@router.post("/generate", response_model=Workflow)
def generate_workflow(request: WorkflowCreate):
    """
    Génère un workflow basé sur une requête en langage naturel.
    """
    try:
        workflow = workflow_generator.generate(request.sport, request.query)
        return workflow
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/execute")
async def execute_workflow(request: WorkflowExecute):
    """
    Exécute un workflow donné.
    """
    try:
        result = await workflow_executor.execute(request.workflow)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
