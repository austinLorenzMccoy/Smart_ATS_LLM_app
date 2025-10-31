"""Prompt builders for AI Career Copilot features."""

from __future__ import annotations

from typing import Sequence


def _build_system_preamble() -> str:
    """Common preamble to encourage factual, structured responses from the LLM."""

    return (
        "You are AI Career Copilot, a meticulous assistant for resume and career analytics. "
        "Always respond in valid JSON, use professional tone, and ground recommendations in the provided "
        "context. Avoid fabricating facts beyond the supplied information."
    )


def get_ats_evaluation_prompt(resume_text: str, job_description: str) -> str:
    """Legacy ATS evaluation prompt used by the /analyze endpoint."""

    preamble = _build_system_preamble()
    return (
        f"{preamble}\n\n"
        "Task: Evaluate resume alignment with the job description. Return JSON with keys\n"
        "`jd_match` (percentage string), `missing_keywords` (array of strings), and `profile_summary`\n"
        "(concise paragraph).\n"
        f"Resume:\n{resume_text}\n\nJob Description:\n{job_description}"
    )


def get_resume_rewrite_prompt(
    resume_text: str,
    job_description: str,
    *,
    tone: str,
    focus_role: str,
) -> str:
    """Prompt for rewriting resumes toward a specific role and tone."""

    preamble = _build_system_preamble()
    return (
        f"{preamble}\n\n"
        "Task: Rewrite the resume to match the job description. Emphasize quantifiable achievements, ATS "
        "compliance, and cohesive narrative. Return JSON with keys `rewritten_resume` (markdown string),\n"
        "`key_adjustments` (array of strings), and `keyword_alignment_score` (percentage string).\n"
        f"DesiredTone: {tone}\nTargetRole: {focus_role}\n"
        f"OriginalResume:\n{resume_text}\n\nJobDescription:\n{job_description}"
    )


def get_skill_gap_prompt(resume_text: str, job_description: str) -> str:
    """Prompt that surfaces skill gaps and learning resources."""

    preamble = _build_system_preamble()
    return (
        f"{preamble}\n\n"
        "Task: Identify critical hard and soft skills missing from the resume when compared with the job description.\n"
        "Include JSON keys `missing_hard_skills`, `missing_soft_skills`, and `course_recommendations` (each item "
        "having `name`, `provider`, `url`).\n"
        f"Resume:\n{resume_text}\n\nJob Description:\n{job_description}"
    )


def get_achievement_quantifier_prompt(resume_text: str) -> str:
    """Prompt that quantifies qualitative resume bullets."""

    preamble = _build_system_preamble()
    return (
        f"{preamble}\n\n"
        "Task: Rewrite resume bullets with measurable impact. Provide JSON with `quantified_bullets` (array of "
        "strings) and `methodology_notes` (array explaining assumptions).\n"
        f"Resume:\n{resume_text}"
    )


def get_role_fit_prompt(resume_text: str, job_description: str) -> str:
    """Prompt that computes a multi-factor role fit assessment."""

    preamble = _build_system_preamble()
    return (
        f"{preamble}\n\n"
        "Task: Compute role fit. Return JSON with `overall_fit`, `skill_alignment`, `experience_alignment`, "
        "`growth_potential` (percentage strings), and `insights` (array of strings).\n"
        f"Resume:\n{resume_text}\n\nJob Description:\n{job_description}"
    )


def get_cover_letter_prompt(
    resume_text: str,
    job_description: str,
    applicant_context: dict[str, str],
) -> str:
    """Prompt that drafts tailored cover letters."""

    preamble = _build_system_preamble()
    context_lines = "\n".join(f"{key}: {value}" for key, value in applicant_context.items())
    return (
        f"{preamble}\n\n"
        "Task: Draft a compelling one-page cover letter tailored to the job description and resume."
        " Provide JSON with `cover_letter` (markdown string) and `talking_points` (array of bullets).\n"
        f"ApplicantContext:\n{context_lines}\n\nResume:\n{resume_text}\n\nJob Description:\n{job_description}"
    )


def get_career_coach_prompt(message_history: Sequence[dict[str, str]]) -> str:
    """Prompt for the conversational AI career coach."""

    preamble = _build_system_preamble()
    history_block = "\n\n".join(
        f"Role: {item.get('role')}\nContent: {item.get('content')}" for item in message_history
    )
    return (
        f"{preamble}\n\n"
        "Task: Continue the coaching conversation with clear, actionable guidance. Return JSON with `reply` "
        "(string) and `suggested_next_questions` (array of strings).\n"
        f"ConversationHistory:\n{history_block}"
    )


def get_career_path_prompt(resume_text: str) -> str:
    """Prompt for recommending career paths and salary bands."""

    preamble = _build_system_preamble()
    return (
        f"{preamble}\n\n"
        "Task: Suggest next-step career moves, salary bands, and rationale. Include JSON keys "
        "`recommended_roles` (array of objects with `title`, `salary_range`, `confidence`), `upskilling_paths` (array),"
        " and `long_term_projection`.\n"
        f"Resume:\n{resume_text}"
    )


def get_job_market_prompt(target_role: str, location: str) -> str:
    """Prompt for job market insights."""

    preamble = _build_system_preamble()
    return (
        f"{preamble}\n\n"
        "Task: Summarize hiring demand, trending skills, and top industries for the role and location."
        " Output JSON with `demand_level`, `top_skills`, `emerging_roles`, and `market_commentary`.\n"
        f"Role: {target_role}\nLocation: {location}"
    )


def get_job_parser_prompt(job_description: str) -> str:
    """Prompt for extracting structured job description data."""

    preamble = _build_system_preamble()
    return (
        f"{preamble}\n\n"
        "Task: Parse the job description into JSON with `title`, `company`, `employment_type`, `responsibilities` (array), "
        "`required_skills`, `preferred_skills`, and `keywords`.\n"
        f"JobDescription:\n{job_description}"
    )


def get_ats_check_prompt(resume_text: str, job_description: str) -> str:
    """Prompt that simulates ATS compatibility checks."""

    preamble = _build_system_preamble()
    return (
        f"{preamble}\n\n"
        "Task: Simulate ATS screening across Workday, Lever, and Greenhouse. Provide JSON with `scores` (object keyed by "
        "platform with percentage strings), `formatting_issues` (array), and `recommendations` (array).\n"
        f"Resume:\n{resume_text}\n\nJob Description:\n{job_description}"
    )


def get_one_click_optimization_prompt(resume_text: str, job_description: str) -> str:
    """Prompt that summarizes one-click optimization guidance."""

    preamble = _build_system_preamble()
    return (
        f"{preamble}\n\n"
        "Task: Produce optimization highlights, keyword matches, and tailored elevator pitch. Return JSON with "
        "`optimized_summary`, `priority_edits`, and `keyword_matches`.\n"
        f"Resume:\n{resume_text}\n\nJob Description:\n{job_description}"
    )


def get_job_alerts_prompt(resume_text: str, target_role: str, location: str) -> str:
    """Prompt for generating AI job alert recommendations."""

    preamble = _build_system_preamble()
    return (
        f"{preamble}\n\n"
        "Task: Suggest three hypothetical job postings with ≥90% fit. Provide JSON array `job_alerts` containing objects "
        "with `company`, `title`, `match_score`, `reasoning`, and `apply_link_placeholder`.\n"
        f"Resume:\n{resume_text}\nTargetRole: {target_role}\nLocation: {location}"
    )


def get_visualization_prompt(resume_text: str, job_description: str) -> str:
    """Prompt for generating data used in visualization widgets."""

    preamble = _build_system_preamble()
    return (
        f"{preamble}\n\n"
        "Task: Create data for skill heatmap, keyword cloud, and progress tracker. Return JSON with `skill_heatmap` "
        "(array of {skill, proficiency, demand}), `keyword_cloud` (array of {keyword, frequency}), and "
        "`progress_tracker` (array of milestones).\n"
        f"Resume:\n{resume_text}\nJob Description:\n{job_description}"
    )


def get_recruiter_api_prompt(resume_batch: Sequence[str], job_description: str) -> str:
    """Prompt for recruiter bulk screening workflow."""

    preamble = _build_system_preamble()
    resumes_block = "\n\n".join(f"Resume_{idx + 1}:\n{resume}" for idx, resume in enumerate(resume_batch))
    return (
        f"{preamble}\n\n"
        "Task: Score multiple resumes against the job description and produce a ranking matrix. Return JSON with\n"
        "`candidate_rankings` (array of objects containing `candidate_id`, `overall_score`, `strengths`, `risks`) "
        "and `skill_matrix` (array keyed by skill with coverage percentage).\n"
        f"JobDescription:\n{job_description}\n\nResumes:\n{resumes_block}"
    )


def get_orchestration_prompt(objective: str, context: str) -> str:
    """Prompt for LLM chain orchestration planning."""

    preamble = _build_system_preamble()
    return (
        f"{preamble}\n\n"
        "Task: Produce a step-by-step reasoning plan that references external tools when needed. Provide JSON with\n"
        "`steps` (array of strings) and `tool_calls` (array of objects containing `tool` and `purpose`).\n"
        f"Objective:\n{objective}\nContext:\n{context}"
    )


def get_embeddings_prompt(resume_text: str, job_description: str) -> str:
    """Prompt describing embeddings-driven semantic similarity results."""

    preamble = _build_system_preamble()
    return (
        f"{preamble}\n\n"
        "Task: Explain semantic similarity insights between resume and job description. Return JSON with `semantic_similarity_score`,\n"
        "`top_matching_segments`, and `gap_segments`.\n"
        f"Resume:\n{resume_text}\nJob Description:\n{job_description}"
    )


def get_knowledge_graph_prompt(resume_text: str) -> str:
    """Prompt to infer a skill knowledge graph blueprint."""

    preamble = _build_system_preamble()
    return (
        f"{preamble}\n\n"
        "Task: Build a lightweight knowledge graph of skills and related roles. Return JSON with `nodes` (array) and\n"
        "`edges` (array with `source`, `target`, `strength`).\n"
        f"Resume:\n{resume_text}"
    )


def get_ocr_prompt(resume_text: str) -> str:
    """Prompt for OCR parsing diagnostics."""

    preamble = _build_system_preamble()
    return (
        f"{preamble}\n\n"
        "Task: Describe OCR extraction confidence and detected sections from the provided raw OCR text. Provide JSON"
        " with `confidence`, `sections` (array of {title, content}), and `cleanup_recommendations`.\n"
        f"OCRText:\n{resume_text}"
    )


def get_portfolio_prompt(resume_text: str) -> str:
    """Prompt for generating a career portfolio blueprint."""

    preamble = _build_system_preamble()
    return (
        f"{preamble}\n\n"
        "Task: Outline a personal career portfolio structure based on resume achievements. Return JSON with "
        "`site_structure`, `highlight_projects`, and `call_to_actions`.\n"
        f"Resume:\n{resume_text}"
    )


def get_interview_readiness_prompt(job_description: str, resume_text: str) -> str:
    """Prompt for generating interview preparation artifacts."""

    preamble = _build_system_preamble()
    return (
        f"{preamble}\n\n"
        "Task: Generate likely interview questions and readiness plan. Return JSON with `behavioral_questions`, "
        "`technical_questions`, and `prep_tips`.\n"
        f"Resume:\n{resume_text}\nJob Description:\n{job_description}"
    )


def get_salary_benchmark_prompt(role: str, location: str, experience_years: float) -> str:
    """Prompt that produces salary benchmarking insights."""

    preamble = _build_system_preamble()
    return (
        f"{preamble}\n\n"
        "Task: Provide salary benchmarking insights. Return JSON with `median_salary`, `percentile_25`, "
        "`percentile_75`, and `data_sources`.\n"
        f"Role: {role}\nLocation: {location}\nExperienceYears: {experience_years}"
    )


def get_linkedin_sync_prompt(profile_text: str) -> str:
    """Prompt for converting LinkedIn profiles into optimized resumes."""

    preamble = _build_system_preamble()
    return (
        f"{preamble}\n\n"
        "Task: Transform the LinkedIn profile into a resume-ready structure with ATS-friendly formatting."
        " Return JSON with `resume_summary`, `experience_sections` (array of {title, bullets}),"
        " `skills_matrix` (array of {skill, proficiency}), and `optimization_tips`.\n"
        f"LinkedInProfile:\n{profile_text}"
    )


def get_chrome_extension_prompt(job_description: str, resume_text: str) -> str:
    """Prompt powering the Chrome extension keyword highlighter."""

    preamble = _build_system_preamble()
    return (
        f"{preamble}\n\n"
        "Task: Compare the job description with the resume and highlight missing or low-frequency keywords."
        " Return JSON with `missing_keywords`, `highlight_sections` (array of {section, keywords}),"
        " and `action_items`.\n"
        f"JobDescription:\n{job_description}\n\nResume:\n{resume_text}"
    )


def get_multi_resume_manager_prompt(resume_variants: Sequence[str], job_description: str) -> str:
    """Prompt for evaluating and comparing multiple resume versions."""

    preamble = _build_system_preamble()
    variants_block = "\n\n".join(
        f"Variant_{idx + 1}:\n{resume}" for idx, resume in enumerate(resume_variants)
    )
    return (
        f"{preamble}\n\n"
        "Task: Compare the provided resume variants against the job description."
        " Return JSON with `best_variant_id`, `variant_scores` (array of {variant_id, score}),"
        " and `improvement_notes` (array of strings).\n"
        f"JobDescription:\n{job_description}\n\nResumes:\n{variants_block}"
    )


def get_career_progress_tracker_prompt(
    resume_text: str,
    certifications: Sequence[str],
    skills_acquired: Sequence[str],
    job_applications: Sequence[dict[str, str]],
) -> str:
    """Prompt for tracking career progress and milestones."""

    preamble = _build_system_preamble()
    certs_block = "\n".join(f"- {cert}" for cert in certifications) if certifications else "None"
    skills_block = "\n".join(f"- {skill}" for skill in skills_acquired) if skills_acquired else "None"
    apps_block = "\n".join(
        f"- {app.get('company', 'Unknown')}: {app.get('role', 'Unknown')} ({app.get('status', 'pending')})"
        for app in job_applications
    ) if job_applications else "None"
    
    return (
        f"{preamble}\n\n"
        "Task: Analyze career progress and provide actionable insights. Return JSON with `progress_score` "
        "(percentage string), `milestones_achieved` (array of strings), `next_milestones` (array of strings), "
        "`skill_development_plan` (array of {skill, priority, timeline}), and `career_trajectory_summary` (string).\n"
        f"Resume:\n{resume_text}\n\n"
        f"Certifications:\n{certs_block}\n\n"
        f"Skills Acquired:\n{skills_block}\n\n"
        f"Job Applications:\n{apps_block}"
    )
