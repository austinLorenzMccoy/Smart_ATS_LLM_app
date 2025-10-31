"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface SavedSearch {
  id: string
  title: string
  query: string
  cadence: string
}

interface SavedSearchesProps {
  searches?: SavedSearch[]
}

export function SavedSearches({ searches }: SavedSearchesProps) {
  if (!searches?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Saved Searches</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Save job searches to get notified about high-match roles.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Saved Searches</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {searches.map((search) => (
          <div key={search.id} className="flex items-center justify-between gap-4 border-b border-border pb-3 last:border-none last:pb-0">
            <div className="space-y-1">
              <p className="font-medium text-foreground">{search.title}</p>
              <p className="text-xs text-muted-foreground">{search.query}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{search.cadence}</Badge>
              <Button size="sm" variant="ghost">
                View
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
