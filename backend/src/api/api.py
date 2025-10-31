from __future__ import annotations

import io
import json
from typing import Any, Dict, List

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from src.config.config import load_config
from src.models.gemini import configure_gemini, get_gemini_response
from src.utils import prompts
from src.utils.pdf_utils import extract_text_from_pdf


class ATSResponse(BaseModel):
    jd_match: str
    missing_keywords: List[str] = Field(default_factory=list)
    profile_summary: str

    model_config = {
        "json_schema_extra": {
            "example": {
                "jd_match": "85%",
                "missing_keywords": ["Python", "Docker", "AWS"],
                "profile_summary": "Strong candidate with relevant experience.",
            }
        }
    }


class ChatMessage(BaseModel):
    role: str
    content: str


class ResumeAndJobRequest(BaseModel):
    resume_text: str
    job_description: str


class ResumeRewriteRequest(ResumeAndJobRequest):
    tone: str = "Professional"
    focus_role: str


class CoverLetterRequest(ResumeAndJobRequest):
    applicant_context: Dict[str, str] = Field(default_factory=dict)


class ResumeOnlyRequest(BaseModel):
    resume_text: str


class CareerCoachRequest(BaseModel):
    message_history: List[ChatMessage]


class JobMarketRequest(BaseModel):
    target_role: str
    location: str


class JobAlertsRequest(BaseModel):
    resume_text: str
    target_role: str
    location: str


class RecruiterBulkRequest(BaseModel):
    resumes: List[str]
    job_description: str


class OrchestrationRequest(BaseModel):
    objective: str
    context: str


class OCRDiagnosticsRequest(BaseModel):
    ocr_text: str


class SalaryBenchmarkRequest(BaseModel):
    role: str
    location: str
    experience_years: float


class CareerProgressRequest(BaseModel):
    resume_text: str
    certifications: List[str] = Field(default_factory=list)
    skills_acquired: List[str] = Field(default_factory=list)
    job_applications: List[Dict[str, str]] = Field(default_factory=list)


def _coalesce(payload: Dict[str, Any], keys: List[str], default: Any = None) -> Any:
    for key in keys:
        if key in payload:
            return payload[key]
    return default


def _invoke_model(prompt: str) -> Any:
    raw_response = get_gemini_response(prompt)
    try:
        return json.loads(raw_response)
    except json.JSONDecodeError as exc:
        raise HTTPException(status_code=500, detail="Failed to parse model response") from exc


# Initialize FastAPI app
app = FastAPI(
    title="AI Career Copilot API",
    description="AI-driven resume intelligence, career guidance, and recruiter tooling",
    version="2.0.0",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load configuration
config = load_config()
configure_gemini(config["api_key"])


@app.get("/")
async def root() -> Dict[str, str]:
    return {"message": "Welcome to AI Career Copilot API"}


@app.post("/analyze", response_model=ATSResponse)
async def analyze_resume(
    job_description: str = Form(...),
    resume: UploadFile = File(...),
) -> ATSResponse:
    try:
        contents = await resume.read()
        pdf_file = io.BytesIO(contents)
        resume_text = extract_text_from_pdf(pdf_file)
        prompt = prompts.get_ats_evaluation_prompt(resume_text, job_description)
        response_json = _invoke_model(prompt)
        return ATSResponse(
            jd_match=_coalesce(response_json, ["jd_match", "JD Match"], "0%"),
            missing_keywords=_coalesce(response_json, ["missing_keywords", "MissingKeywords"], []),
            profile_summary=_coalesce(response_json, ["profile_summary", "Profile Summary"], ""),
        )
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@app.post("/resume/rewrite")
async def rewrite_resume(payload: ResumeRewriteRequest) -> Dict[str, Any]:
    prompt = prompts.get_resume_rewrite_prompt(
        payload.resume_text,
        payload.job_description,
        tone=payload.tone,
        focus_role=payload.focus_role,
    )
    result = _invoke_model(prompt)
    return {
        "rewritten_resume": _coalesce(result, ["rewritten_resume", "RewrittenResume"], ""),
        "key_adjustments": _coalesce(result, ["key_adjustments", "KeyAdjustments"], []),
        "keyword_alignment_score": _coalesce(result, ["keyword_alignment_score", "KeywordAlignmentScore"], "0%"),
    }


@app.post("/resume/skill-gap")
async def skill_gap_analysis(payload: ResumeAndJobRequest) -> Dict[str, Any]:
    prompt = prompts.get_skill_gap_prompt(payload.resume_text, payload.job_description)
    return _invoke_model(prompt)


@app.post("/resume/achievements")
async def quantify_achievements(payload: ResumeOnlyRequest) -> Dict[str, Any]:
    prompt = prompts.get_achievement_quantifier_prompt(payload.resume_text)
    return _invoke_model(prompt)


@app.post("/resume/role-fit")
async def role_fit(payload: ResumeAndJobRequest) -> Dict[str, Any]:
    prompt = prompts.get_role_fit_prompt(payload.resume_text, payload.job_description)
    return _invoke_model(prompt)


@app.post("/resume/cover-letter")
async def cover_letter(payload: CoverLetterRequest) -> Dict[str, Any]:
    prompt = prompts.get_cover_letter_prompt(
        payload.resume_text,
        payload.job_description,
        applicant_context=payload.applicant_context,
    )
    return _invoke_model(prompt)


@app.post("/career/coach")
async def career_coach(payload: CareerCoachRequest) -> Dict[str, Any]:
    prompt = prompts.get_career_coach_prompt(payload.message_history)
    return _invoke_model(prompt)


@app.post("/career/path")
async def career_path(payload: ResumeOnlyRequest) -> Dict[str, Any]:
    prompt = prompts.get_career_path_prompt(payload.resume_text)
    return _invoke_model(prompt)


@app.post("/career/job-market")
async def job_market(payload: JobMarketRequest) -> Dict[str, Any]:
    prompt = prompts.get_job_market_prompt(payload.target_role, payload.location)
    return _invoke_model(prompt)


@app.post("/jobs/parse")
async def job_description_parser(payload: ResumeAndJobRequest) -> Dict[str, Any]:
    prompt = prompts.get_job_parser_prompt(payload.job_description)
    return _invoke_model(prompt)


@app.post("/jobs/ats-check")
async def ats_check(payload: ResumeAndJobRequest) -> Dict[str, Any]:
    prompt = prompts.get_ats_check_prompt(payload.resume_text, payload.job_description)
    return _invoke_model(prompt)


@app.post("/jobs/one-click-optimize")
async def one_click_optimize(payload: ResumeAndJobRequest) -> Dict[str, Any]:
    prompt = prompts.get_one_click_optimization_prompt(payload.resume_text, payload.job_description)
    return _invoke_model(prompt)


@app.post("/jobs/alerts")
async def job_alerts(payload: JobAlertsRequest) -> Dict[str, Any]:
    prompt = prompts.get_job_alerts_prompt(payload.resume_text, payload.target_role, payload.location)
    return _invoke_model(prompt)


@app.post("/visualizations/summary")
async def visualization_summary(payload: ResumeAndJobRequest) -> Dict[str, Any]:
    prompt = prompts.get_visualization_prompt(payload.resume_text, payload.job_description)
    return _invoke_model(prompt)


@app.post("/recruiter/bulk-score")
async def recruiter_bulk_score(payload: RecruiterBulkRequest) -> Dict[str, Any]:
    prompt = prompts.get_recruiter_api_prompt(payload.resumes, payload.job_description)
    return _invoke_model(prompt)


@app.post("/analytics/orchestration")
async def orchestration_plan(payload: OrchestrationRequest) -> Dict[str, Any]:
    prompt = prompts.get_orchestration_prompt(payload.objective, payload.context)
    return _invoke_model(prompt)


@app.post("/analytics/embeddings")
async def embeddings_analysis(payload: ResumeAndJobRequest) -> Dict[str, Any]:
    prompt = prompts.get_embeddings_prompt(payload.resume_text, payload.job_description)
    return _invoke_model(prompt)


@app.post("/analytics/knowledge-graph")
async def knowledge_graph(payload: ResumeOnlyRequest) -> Dict[str, Any]:
    prompt = prompts.get_knowledge_graph_prompt(payload.resume_text)
    return _invoke_model(prompt)


@app.post("/analytics/ocr-diagnostics")
async def ocr_diagnostics(payload: OCRDiagnosticsRequest) -> Dict[str, Any]:
    prompt = prompts.get_ocr_prompt(payload.ocr_text)
    return _invoke_model(prompt)


@app.post("/portfolio/generate")
async def portfolio_generate(payload: ResumeOnlyRequest) -> Dict[str, Any]:
    prompt = prompts.get_portfolio_prompt(payload.resume_text)
    return _invoke_model(prompt)


@app.post("/interview/readiness")
async def interview_readiness(payload: ResumeAndJobRequest) -> Dict[str, Any]:
    prompt = prompts.get_interview_readiness_prompt(payload.job_description, payload.resume_text)
    return _invoke_model(prompt)


@app.post("/salary/benchmark")
async def salary_benchmark(payload: SalaryBenchmarkRequest) -> Dict[str, Any]:
    prompt = prompts.get_salary_benchmark_prompt(
        payload.role, payload.location, payload.experience_years
    )
    return _invoke_model(prompt)


@app.post("/career/progress-tracker")
async def career_progress_tracker(payload: CareerProgressRequest) -> Dict[str, Any]:
    prompt = prompts.get_career_progress_tracker_prompt(
        payload.resume_text,
        payload.certifications,
        payload.skills_acquired,
        payload.job_applications,
    )
    return _invoke_model(prompt)
