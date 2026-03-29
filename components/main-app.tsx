"use client"
import { LiveDashboard } from "./live-dashboard"
import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import Dashboard from "@/components/pages/dashboard";
import { FarmInsights } from "@/components/pages/farm-insights"
import { DeviceSettings } from "@/components/pages/device-settings"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Chatbot } from "@/components/chatbot" // Added Chatbot import

export function MainApp({ onLogout }: { onLogout: () => void }) {
  const [activePage, setActivePage] = useState("dashboard")
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme === "dark") {
      setIsDark(true)
      document.documentElement.classList.add("dark")
    }
  }, [])

  const toggleTheme = () => {
    const newIsDark = !isDark
    setIsDark(newIsDark)
    if (newIsDark) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <Dashboard />
      case "insights":
        return <FarmInsights />
      case "settings":
        return <DeviceSettings />
      default:
        return <Dashboard />
    }
  }

  if (!mounted) return null

  return (
    <div className={`flex h-screen bg-background ${isDark ? "dark" : ""}`}>
      <Navigation activePage={activePage} setActivePage={setActivePage} onLogout={onLogout} />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Theme Toggle */}
        <div className="flex justify-end p-4 border-b border-border">
          <Button onClick={toggleTheme} variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
            {isDark ? (
              <>
                <Sun className="w-4 h-4" />
                Light
              </>
            ) : (
              <>
                <Moon className="w-4 h-4" />
                Dark
              </>
            )}
          </Button>
        </div>
        <div className="flex-1 overflow-auto">{renderPage()}</div>
      </div>

      <Chatbot />
    </div>
  )
}
