"use client"

<<<<<<< HEAD
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { RefreshCw, Plus, Thermometer, Droplets, Sprout, Wind } from "lucide-react"
=======
import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Thermometer, Droplets, Leaf, Wind, Plus, RefreshCw, X } from "lucide-react"
>>>>>>> 8c2689b6c35d2c57687bea2943756f980c7c4044

interface Device {
  id: string
  name: string
<<<<<<< HEAD
  type: "temperature" | "humidity" | "soil" | "air"
  status: "online" | "offline"
  lastUpdated: string
  location?: string
  enabled: boolean
}

const deviceIcons = {
  temperature: Thermometer,
  humidity: Droplets,
  soil: Sprout,
  air: Wind,
}

const deviceTypeLabels = {
  temperature: "Temperature Sensor",
  humidity: "Humidity Sensor",
  soil: "Soil Moisture Sensor",
  air: "Air Quality Monitor",
=======
  type: "temperature" | "humidity" | "soil" | "air-quality"
  status: "online" | "offline"
  lastUpdated: string
  location: string
  enabled: boolean
}

const deviceTypeIcons: Record<Device["type"], React.ReactNode> = {
  temperature: <Thermometer className="w-5 h-5" />,
  humidity: <Droplets className="w-5 h-5" />,
  soil: <Leaf className="w-5 h-5" />,
  "air-quality": <Wind className="w-5 h-5" />,
}

const deviceTypeLabels: Record<Device["type"], string> = {
  temperature: "Temperature Sensor",
  humidity: "Humidity Sensor",
  soil: "Soil Moisture Sensor",
  "air-quality": "Air Quality Monitor",
>>>>>>> 8c2689b6c35d2c57687bea2943756f980c7c4044
}

export function DeviceSettings() {
  const [devices, setDevices] = useState<Device[]>([
    {
      id: "1",
      name: "Main Weather Station",
      type: "temperature",
      status: "online",
      lastUpdated: "2 mins ago",
<<<<<<< HEAD
      location: "Field A",
=======
      location: "North Field",
>>>>>>> 8c2689b6c35d2c57687bea2943756f980c7c4044
      enabled: true,
    },
    {
      id: "2",
      name: "Soil Moisture Sensor",
      type: "soil",
      status: "online",
      lastUpdated: "5 mins ago",
<<<<<<< HEAD
      location: "Field B",
=======
      location: "South Field",
>>>>>>> 8c2689b6c35d2c57687bea2943756f980c7c4044
      enabled: true,
    },
    {
      id: "3",
<<<<<<< HEAD
      name: "Air Quality Monitor",
      type: "air",
      status: "offline",
      lastUpdated: "1 hour ago",
      location: "Greenhouse",
      enabled: false,
    },
    {
      id: "4",
      name: "Humidity Sensor",
      type: "humidity",
      status: "online",
      lastUpdated: "3 mins ago",
      location: "Field C",
      enabled: true,
    },
  ])

  const [isAddDeviceOpen, setIsAddDeviceOpen] = useState(false)
  const [newDevice, setNewDevice] = useState({
    name: "",
    type: "temperature" as Device["type"],
    id: "",
  })
  const [refreshingDevice, setRefreshingDevice] = useState<string | null>(null)

  const handleToggleDevice = (deviceId: string) => {
    setDevices((prev) =>
      prev.map((device) =>
        device.id === deviceId ? { ...device, enabled: !device.enabled } : device
      )
    )
  }

  const handleRefreshDevice = async (deviceId: string) => {
    setRefreshingDevice(deviceId)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setDevices((prev) =>
      prev.map((device) =>
        device.id === deviceId
          ? {
              ...device,
              lastUpdated: "Just now",
              status: "online",
            }
          : device
      )
    )
    setRefreshingDevice(null)
  }

  const handleAddDevice = () => {
    if (!newDevice.name || !newDevice.id) return

    const device: Device = {
      id: newDevice.id,
      name: newDevice.name,
      type: newDevice.type,
      status: "online",
      lastUpdated: "Just now",
      enabled: true,
    }

    setDevices((prev) => [...prev, device])
    setNewDevice({ name: "", type: "temperature", id: "" })
    setIsAddDeviceOpen(false)
  }

  const getDeviceIcon = (type: Device["type"]) => {
    const Icon = deviceIcons[type]
    return <Icon className="w-6 h-6" />
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-[#F5F5DC] to-[#FAF9F6]">
      {/* Header */}
      <div className="p-6 md:p-8 border-b border-[#3BB273]/20 bg-white/80 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              Device Settings
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              Manage your connected IoT devices and sensors
            </p>
          </div>
          <Button
            onClick={() => setIsAddDeviceOpen(true)}
            className="bg-[#3BB273] hover:bg-[#3BB273]/90 text-white shadow-md hover:shadow-lg transition-all duration-200 rounded-lg px-6 py-2 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Device</span>
=======
      name: "Humidity Monitor",
      type: "humidity",
      status: "online",
      lastUpdated: "1 min ago",
      location: "Greenhouse",
      enabled: true,
    },
    {
      id: "4",
      name: "Air Quality Monitor",
      type: "air-quality",
      status: "offline",
      lastUpdated: "15 mins ago",
      location: "East Wing",
      enabled: false,
    },
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newDevice, setNewDevice] = useState({ name: "", type: "temperature", id: "" })

  const handleToggleDevice = (id: string) => {
    setDevices(devices.map((d) => (d.id === id ? { ...d, enabled: !d.enabled } : d)))
  }

  const handleRefreshDevice = (id: string) => {
    const now = new Date()
    const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    setDevices(devices.map((d) => (d.id === id ? { ...d, lastUpdated: `Just now (${timeStr})` } : d)))
  }

  const handleAddDevice = () => {
    if (newDevice.name && newDevice.id) {
      const device: Device = {
        id: Date.now().toString(),
        name: newDevice.name,
        type: (newDevice.type as Device["type"]) || "temperature",
        status: "online",
        lastUpdated: "Just added",
        location: "",
        enabled: true,
      }
      setDevices([...devices, device])
      setNewDevice({ name: "", type: "temperature", id: "" })
      setIsModalOpen(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-8 border-b border-[#e8e8e8] bg-gradient-to-r from-[#3BB273]/10 to-[#f5f0e8]/50">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Device Settings</h1>
            <p className="text-foreground/70">Manage your connected IoT devices and sensors</p>
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#3BB273] hover:bg-[#2d9059] text-white flex items-center gap-2 rounded-lg"
          >
            <Plus className="w-5 h-5" />
            Add New Device
>>>>>>> 8c2689b6c35d2c57687bea2943756f980c7c4044
          </Button>
        </div>
      </div>

      {/* Content */}
<<<<<<< HEAD
      <div className="flex-1 overflow-auto p-4 md:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {devices.map((device) => {
            const isRefreshing = refreshingDevice === device.id

            return (
              <Card
                key={device.id}
                className="p-5 md:p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] group"
              >
                {/* Device Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#3BB273]/10 text-[#3BB273]">
                      {getDeviceIcon(device.type)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 text-base md:text-lg">
                        {device.name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {deviceTypeLabels[device.type]}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Device Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Status:</span>
                    <span
                      className={`font-semibold ${
                        device.status === "online"
                          ? "text-[#3BB273]"
                          : "text-gray-400"
                      }`}
                    >
                      {device.status === "online" ? "● Online" : "○ Offline"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Last Updated:</span>
                    <span className="text-gray-800 font-medium">
                      {device.lastUpdated}
                    </span>
                  </div>
                  {device.location && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Location:</span>
                      <span className="text-gray-800 font-medium">
                        {device.location}
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Enable:</span>
                    <Switch
                      checked={device.enabled}
                      onCheckedChange={() => handleToggleDevice(device.id)}
                    />
                  </div>
                  <button
                    onClick={() => handleRefreshDevice(device.id)}
                    disabled={isRefreshing}
                    className="p-2 rounded-lg bg-[#3BB273]/10 text-[#3BB273] hover:bg-[#3BB273]/20 transition-colors disabled:opacity-50"
                    title="Refresh device data"
                  >
                    <RefreshCw
                      className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
                    />
                  </button>
                </div>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 md:p-6 border-t border-[#3BB273]/20 bg-white/80 backdrop-blur-sm">
        <p className="text-sm text-gray-600 text-center">
          Ensure all devices are online for real-time data updates.
        </p>
      </div>

      {/* Add Device Modal */}
      <Dialog open={isAddDeviceOpen} onOpenChange={setIsAddDeviceOpen}>
        <DialogContent className="bg-white rounded-xl border border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-800">
              Add New Device
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Enter the details of your new IoT device or sensor.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Device Name
              </label>
              <Input
                placeholder="e.g., Soil Moisture Sensor"
                value={newDevice.name}
                onChange={(e) =>
                  setNewDevice({ ...newDevice, name: e.target.value })
                }
                className="border-gray-300 focus:border-[#3BB273] focus:ring-[#3BB273]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Device Type
              </label>
              <select
                value={newDevice.type}
                onChange={(e) =>
                  setNewDevice({
                    ...newDevice,
                    type: e.target.value as Device["type"],
                  })
                }
                className="w-full h-9 rounded-md border border-gray-300 bg-transparent px-3 py-1 text-sm focus:border-[#3BB273] focus:ring-2 focus:ring-[#3BB273]/20 outline-none"
              >
                <option value="temperature">Temperature Sensor</option>
                <option value="humidity">Humidity Sensor</option>
                <option value="soil">Soil Moisture Sensor</option>
                <option value="air">Air Quality Monitor</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Device ID
              </label>
              <Input
                placeholder="e.g., DEV-001"
                value={newDevice.id}
                onChange={(e) =>
                  setNewDevice({ ...newDevice, id: e.target.value })
                }
                className="border-gray-300 focus:border-[#3BB273] focus:ring-[#3BB273]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddDeviceOpen(false)}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddDevice}
              disabled={!newDevice.name || !newDevice.id}
              className="bg-[#3BB273] hover:bg-[#3BB273]/90 text-white"
            >
              Add Device
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
=======
      <div className="flex-1 overflow-auto p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {devices.map((device, index) => (
            <Card
              key={device.id}
              className="p-6 border border-[#e8e8e8] bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Device Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[#3BB273]/10 rounded-lg text-[#3BB273]">{deviceTypeIcons[device.type]}</div>
                  <div>
                    <h3 className="font-semibold text-foreground text-base">{device.name}</h3>
                    <p className="text-xs text-foreground/60">{deviceTypeLabels[device.type]}</p>
                  </div>
                </div>
              </div>

              {/* Device Info */}
              <div className="space-y-2.5 mb-5 pb-5 border-b border-[#e8e8e8]">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground/70">Status:</span>
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
                      device.status === "online" ? "bg-[#3BB273]/20 text-[#2d9059]" : "bg-red-100 text-red-700"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        device.status === "online" ? "bg-[#3BB273]" : "bg-red-500"
                      }`}
                    ></span>
                    {device.status === "online" ? "Online" : "Offline"}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-foreground/70">Last Updated:</span>
                  <span className="text-foreground font-medium">{device.lastUpdated}</span>
                </div>

                {device.location && (
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground/70">Location:</span>
                    <span className="text-foreground font-medium">{device.location}</span>
                  </div>
                )}
              </div>

              {/* Device Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={device.enabled}
                      onChange={() => handleToggleDevice(device.id)}
                      className="w-5 h-5 rounded border-[#3BB273] text-[#3BB273] cursor-pointer"
                    />
                    <span className="ml-2 text-xs text-foreground/70">{device.enabled ? "Enabled" : "Disabled"}</span>
                  </label>
                </div>

                <button
                  onClick={() => handleRefreshDevice(device.id)}
                  className="p-2 hover:bg-[#f5f0e8] rounded-lg transition-colors duration-200 text-[#3BB273] hover:text-[#2d9059]"
                  title="Manually sync device data"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>

        {/* Footer note */}
        <div className="bg-[#f5f0e8] border border-[#3BB273]/20 rounded-lg p-4 flex items-start gap-3 mt-8">
          <div className="w-1 h-1 rounded-full bg-[#3BB273] mt-2 flex-shrink-0"></div>
          <p className="text-sm text-foreground/80">
            <span className="font-semibold text-foreground">Ensure all devices are online</span> for real-time data
            updates. Check battery levels regularly and update device firmware as needed.
          </p>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-6 bg-white rounded-xl border border-[#e8e8e8]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground">Add New Device</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-[#f5f0e8] rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-foreground/60" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Device Name</label>
                <input
                  type="text"
                  placeholder="e.g., North Field Sensor"
                  value={newDevice.name}
                  onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
                  className="w-full px-3 py-2 border border-[#e8e8e8] rounded-lg focus:ring-2 focus:ring-[#3BB273] focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Device Type</label>
                <select
                  value={newDevice.type}
                  onChange={(e) => setNewDevice({ ...newDevice, type: e.target.value })}
                  className="w-full px-3 py-2 border border-[#e8e8e8] rounded-lg focus:ring-2 focus:ring-[#3BB273] focus:border-transparent outline-none"
                >
                  <option value="temperature">Temperature Sensor</option>
                  <option value="humidity">Humidity Sensor</option>
                  <option value="soil">Soil Moisture Sensor</option>
                  <option value="air-quality">Air Quality Monitor</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Device ID</label>
                <input
                  type="text"
                  placeholder="e.g., SENSOR-001"
                  value={newDevice.id}
                  onChange={(e) => setNewDevice({ ...newDevice, id: e.target.value })}
                  className="w-full px-3 py-2 border border-[#e8e8e8] rounded-lg focus:ring-2 focus:ring-[#3BB273] focus:border-transparent outline-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => setIsModalOpen(false)}
                  variant="outline"
                  className="flex-1 border-[#e8e8e8] text-foreground hover:bg-[#f5f0e8]"
                >
                  Cancel
                </Button>
                <Button onClick={handleAddDevice} className="flex-1 bg-[#3BB273] hover:bg-[#2d9059] text-white">
                  Add Device
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
>>>>>>> 8c2689b6c35d2c57687bea2943756f980c7c4044
    </div>
  )
}
