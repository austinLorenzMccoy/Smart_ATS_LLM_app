"use client"

import { useMemo } from "react"

interface KeywordCloudProps {
  data?: { keyword: string; frequency: number }[]
}

export function KeywordCloud({ data }: KeywordCloudProps) {
  const words = useMemo(() => {
    if (!data) return []
    const max = Math.max(...data.map((item) => item.frequency), 1)
    return data.map((item) => ({
      ...item,
      size: 12 + (item.frequency / max) * 24,
    }))
  }, [data])

  if (!words.length) return null

  return (
    <div className="flex flex-wrap gap-3">
      {words.map((word) => (
        <span
          key={word.keyword}
          className="inline-flex items-center justify-center rounded-full bg-primary/10 px-3 py-1 text-primary"
          style={{ fontSize: `${word.size}px` }}
        >
          {word.keyword}
        </span>
      ))}
    </div>
  )
}
