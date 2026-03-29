"use client"

import { AlertCircle } from "lucide-react"

interface AlertBoxProps {
  message: string
}

export function AlertBox({ message }: AlertBoxProps) {
  return (
    <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 flex items-center gap-3">
      <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
      <p className="text-destructive font-medium">{message}</p>
    </div>
  )
}
