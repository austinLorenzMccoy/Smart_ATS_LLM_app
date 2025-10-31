"use client"

import { useEffect, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Send } from "lucide-react"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

type ChatMessage = {
  role: "user" | "assistant"
  content: string
  timestamp: string
}

const SUGGESTED_PROMPTS = [
  "What roles should I explore with my current skills?",
  "How can I transition into AI product management?",
  "Give me a 30-60-90 day plan for a new role.",
  "How do I address a gap in my resume?",
]

export default function CareerCoachPage() {
  const { toast } = useToast()
  const [conversation, setConversation] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [resumeContext, setResumeContext] = useState("")
  const bottomRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [conversation])

  const sendMessage = async (message: string) => {
    if (!message.trim()) return

    const userMessage: ChatMessage = {
      role: "user",
      content: message,
      timestamp: new Date().toISOString(),
    }

    setConversation((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      const response = await fetch(`${API_BASE_URL}/career/coach`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          conversation_history: conversation,
          resume_context: resumeContext,
        }),
      })

      if (!response.ok) {
        throw new Error(await response.text())
      }

      const data = await response.json()

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: data?.response ?? "I'm here to help with your career journey.",
        timestamp: new Date().toISOString(),
      }

      setConversation((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error(error)
      toast({
        title: "Coach unavailable",
        description: "Please try again in a few minutes.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Career Coach</CardTitle>
          <CardDescription>
            Ask real-time questions about career planning, interviewing, and skill development. Include resume context for more
            personalized guidance.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="resume-context" className="text-sm font-medium">Optional resume context</Label>
            <Textarea
              id="resume-context"
              placeholder="Paste relevant resume sections or summaries here..."
              value={resumeContext}
              onChange={(event) => setResumeContext(event.target.value)}
              className="min-h-[120px]"
            />
            <p className="text-xs text-muted-foreground mt-1">The coach will use this to tailor responses.</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold">Suggested prompts</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_PROMPTS.map((prompt) => (
                <Button key={prompt} variant="secondary" size="sm" onClick={() => sendMessage(prompt)}>
                  {prompt}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="h-[520px] flex flex-col">
        <CardHeader className="border-b border-border">
          <CardTitle>Conversation</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 p-0">
          <ScrollArea className="h-full px-6 py-4">
            <div className="space-y-4">
              {conversation.map((message, index) => (
                <div key={`${message.timestamp}-${index}`} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={message.role === "assistant" ? "secondary" : "outline"}>
                      {message.role === "assistant" ? "Coach" : "You"}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                    {message.content}
                  </p>
                </div>
              ))}
              {!conversation.length && (
                <p className="text-sm text-muted-foreground">
                  Ask your first question to begin the conversation.
                </p>
              )}
              <div ref={bottomRef} />
            </div>
          </ScrollArea>
        </CardContent>
        <div className="border-t border-border p-4 space-y-3">
          <div>
            <Label htmlFor="message" className="text-sm font-medium">Message</Label>
            <Input
              id="message"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Type your question..."
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault()
                  sendMessage(input)
                }
              }}
            />
          </div>
          <div className="flex justify-end">
            <Button onClick={() => sendMessage(input)} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              <span className="ml-2">Send</span>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
