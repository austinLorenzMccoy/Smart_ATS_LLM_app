"use client"

import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
} from "recharts"

interface SkillHeatmapProps {
  data?: { skill: string; proficiency: string; demand: string }[]
}

const COLORS = {
  proficiency: "#3b82f6",
  demand: "#10b981",
}

export function SkillHeatmap({ data }: SkillHeatmapProps) {
  if (!data || data.length === 0) return null

  const parsedData = data.map((item) => ({
    skill: item.skill,
    proficiency: Number.parseFloat(item.proficiency.replace(/[^0-9.]/g, "")),
    demand: Number.parseFloat(item.demand.replace(/[^0-9.]/g, "")),
  }))

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={parsedData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="skill" tick={{ fontSize: 12 }} interval={0} angle={-15} textAnchor="end" height={60} />
          <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
          <Tooltip formatter={(value: number) => `${value.toFixed(0)}%`} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="proficiency" name="Your proficiency" fill={COLORS.proficiency} radius={[4, 4, 0, 0]} />
          <Bar dataKey="demand" name="Market demand" fill={COLORS.demand} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
