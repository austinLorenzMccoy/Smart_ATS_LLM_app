"use client"

import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
} from "recharts"

interface RoleFitRadarProps {
  data?: { dimension: string; score: number }[]
}

export function RoleFitRadar({ data }: RoleFitRadarProps) {
  if (!data || data.length === 0) return null

  const parsedData = data.map((item) => ({ ...item, score: Number(item.score) }))

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={parsedData} outerRadius="75%">
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
          <Tooltip formatter={(value: number) => `${value.toFixed(0)}%`} />
          <Radar
            name="Role Fit"
            dataKey="score"
            stroke="#6366f1"
            fill="#6366f1"
            fillOpacity={0.4}
            dot={{ r: 3 }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
