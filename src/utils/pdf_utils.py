import PyPDF2 as pdf

def extract_text_from_pdf(uploaded_file):
    """Extract text from a PDF file
    
    Args:
        uploaded_file: The uploaded PDF file
        
    Returns:
        str: Extracted text from the PDF
    """
    reader = pdf.PdfReader(uploaded_file)
    text = ""
    for page in range(len(reader.pages)):
        page = reader.pages[page]
        text += str(page.extract_text())
    return text
