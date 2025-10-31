"use client"

import { useCallback } from "react"
import { useDropzone } from "react-dropzone"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, FileText } from "lucide-react"

import { StepContainer } from "./StepContainer"

interface Step1UploadProps {
  resumeFile: File | null
  resumeText: string
  onResumeFileChange: (file: File | null) => void
  onResumeTextChange: (text: string) => void
  onNext: () => void
  maxFileSize?: number
}

export function Step1Upload({
  resumeFile,
  resumeText,
  onResumeFileChange,
  onResumeTextChange,
  onNext,
  maxFileSize = 5 * 1024 * 1024,
}: Step1UploadProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles?.length) {
        onResumeFileChange(acceptedFiles[0])
      }
    },
    [onResumeFileChange]
  )

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    multiple: false,
    accept: { "application/pdf": [".pdf"] },
    maxSize: maxFileSize,
  })

  const fileError = fileRejections[0]?.errors[0]

  return (
    <StepContainer>
      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Upload a PDF resume (max {Math.round(maxFileSize / (1024 * 1024))}MB) or paste your resume text below. Combining both
            unlocks the richest analysis, including ATS scoring and rewriting.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-dashed border-2 border-border hover:border-primary/60 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Upload className="h-5 w-5" />
                Upload PDF Resume
              </CardTitle>
              <CardDescription>Drag & drop or select a PDF file.</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                {...getRootProps({
                  className: "cursor-pointer rounded-md border border-border/60 bg-muted/40 p-8 text-center transition-colors",
                })}
              >
                <input {...getInputProps()} />
                <Upload className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
                <p className="text-sm font-medium">
                  {isDragActive ? "Drop the file here" : "Click to upload or drag and drop"}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">PDF files only • Max size {Math.round(maxFileSize / (1024 * 1024))}MB</p>
                {resumeFile && (
                  <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    <FileText className="h-4 w-4" />
                    {resumeFile.name}
                  </div>
                )}
                {fileError && (
                  <p className="mt-3 text-xs text-destructive">{fileError.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5" />
                Paste Resume Text
              </CardTitle>
              <CardDescription>Optional but recommended for rewriting and cover letter generation.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Label htmlFor="resume-text" className="text-sm font-medium">
                Resume Text
              </Label>
              <Textarea
                id="resume-text"
                placeholder="Paste the full text of your resume here..."
                value={resumeText}
                onChange={(event) => onResumeTextChange(event.target.value)}
                className="h-48 font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                ✅ Tip: Paste a plain text export to ensure accurate parsing.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            <p>Supports one PDF upload per analysis. Additional formats (.docx, .txt) coming soon.</p>
          </div>
          <Button
            size="lg"
            onClick={onNext}
            disabled={!resumeFile && !resumeText}
          >
            Continue to Job Description
          </Button>
        </div>
      </div>
    </StepContainer>
  )
}
