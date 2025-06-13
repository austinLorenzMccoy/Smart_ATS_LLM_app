import google.generativeai as genai

def configure_gemini(api_key):
    """Configure the Gemini API with the provided API key
    
    Args:
        api_key: The API key for Gemini
    """
    genai.configure(api_key=api_key)

def get_gemini_response(input_prompt):
    """Get response from Gemini model
    
    Args:
        input_prompt: The prompt to send to the model
        
    Returns:
        str: The response text from the model
    """
    model = genai.GenerativeModel('gemini-1.5-flash')
    response = model.generate_content(input_prompt)
    return response.text
