FROM python:3.8-slim-bullseye AS builder
FROM python:3.8-slim-bullseye

# Set working directory
WORKDIR /app

# Copy application code
COPY app.py .

# Create a non-root user
RUN useradd -m appuser
USER appuser

# Set environment variables
ENV PYTHONUNBUFFERED=1

# Expose the port the app will run on
EXPOSE 10000

# Command to run the application
CMD ["python", "app.py"]
