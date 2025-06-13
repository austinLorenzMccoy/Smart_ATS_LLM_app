def get_ats_evaluation_prompt(resume_text, job_description):
    """Generate the ATS evaluation prompt
    
    Args:
        resume_text: The text extracted from the resume
        job_description: The job description text
        
    Returns:
        str: The formatted prompt for the model
    """
    return f"""
    Hey Act Like a skilled or very experience ATS(Application Tracking System)
    with a deep understanding of tech field,software engineering,data science ,data analyst
    and big data engineer. Your task is to evaluate the resume based on the given job description.
    You must consider the job market is very competitive and you should provide 
    best assistance for improving thr resumes. Assign the percentage Matching based 
    on Jd and the missing keywords with high accuracy
    resume:{resume_text}
    description:{job_description}

    I want the response in one single string having the structure
    {{"JD Match":"%","MissingKeywords:[]","Profile Summary":""}}
    """
