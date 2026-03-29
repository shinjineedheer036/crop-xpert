"use client"

import { LogOut, BarChart3, Cog, Leaf } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NavigationProps {
  activePage: string
  setActivePage: (page: string) => void
  onLogout: () => void
}

export function Navigation({ activePage, setActivePage, onLogout }: NavigationProps) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "insights", label: "Farm Insights", icon: Leaf },
    { id: "settings", label: "Device Settings", icon: Cog },
  ]

  return (
    <nav className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <Leaf className="w-8 h-8 text-sidebar-accent" />
          <span className="text-xl font-bold text-sidebar-foreground">CropXpert</span>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activePage === item.id
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/20"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          )
        })}
      </div>

      {/* Logout Button */}
      <div className="p-4 border-t border-sidebar-border">
        <Button
          onClick={onLogout}
          variant="outline"
          className="w-full flex items-center gap-2 text-sidebar-foreground hover:bg-sidebar-accent/20 bg-transparent"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>

      {/* Footer */}
      <div className="p-4 text-center text-xs text-sidebar-foreground/60 border-t border-sidebar-border">
        <p>Smart Farming</p>
        <p>Sustainable Future</p>
      </div>
    </nav>
  )
}
