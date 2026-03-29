"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IoTChart } from "@/components/charts/iot-chart";
import { GaugeChart } from "@/components/charts/gauge-chart";
import { AlertBox } from "@/components/alert-box";
import { Cloud, Droplets, Leaf, Wind, TrendingUp, RefreshCw } from "lucide-react";
import { ref, onValue } from "firebase/database";
import { db } from "@/lib/firebase";   // ✅ SAME AS YOUR WORKING CODE

interface SensorData {
  temperature: number;
  humidity: number;
  soilMoisture: number;
  airQuality: number;
  cropHealth: number;
  lastUpdated: string;
}

export default function Dashboard() {
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // YOUR EXACT REALTIME DATABASE PATH
    const sensorRef = ref(db, "sensors/current");

    const unsubscribe = onValue(sensorRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setSensorData({
          temperature: data.temperature,
          humidity: data.humidity,
          soilMoisture: data.soilMoisture,
          airQuality: data.airQuality,
          cropHealth: data.cropHealth,
          lastUpdated: new Date().toLocaleTimeString(),
        });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getAlert = () => {
    if (!sensorData) return null;
    if (sensorData.soilMoisture < 30) return "Low soil moisture detected!";
    if (sensorData.temperature > 32) return "High temperature alert!";
    if (sensorData.airQuality < 40) return "Air quality needs attention";
    return null;
  };

  if (loading || !sensorData) {
    return (
      <div className="p-8 flex items-center justify-center h-full">
        <div className="animate-pulse text-foreground/60">
          Loading farm data...
        </div>
      </div>
    );
  }

  const alert = getAlert();

  return (
    <div className="flex flex-col h-full w-full">
      {/* Header */}
      <div className="p-8 border-b border-border bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-3xl font-bold text-foreground">Farm Dashboard</h1>
          <Button
            onClick={() => {}}
            disabled
            className="bg-primary hover:bg-primary/90 flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Live Data
          </Button>
        </div>
        <p className="text-foreground/60">
          Real-time IoT monitoring • Last updated: {sensorData.lastUpdated}
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-8 space-y-6">
        {/* Alerts */}
        {alert && <AlertBox message={alert} />}

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Temperature */}
          <Card className="p-6 border border-border hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold">Temperature</h3>
              <Cloud className="w-5 h-5 text-primary" />
            </div>
            <div className="text-3xl font-bold mb-2">
              {sensorData.temperature}°C
            </div>
            <div className="h-20">
              <IoTChart value={sensorData.temperature} range={[15, 35]} color="#6B8B3A" />
            </div>
          </Card>

          {/* Humidity */}
          <Card className="p-6 border border-border hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold">Humidity</h3>
              <Droplets className="w-5 h-5 text-accent" />
            </div>
            <div className="text-3xl font-bold mb-2">
              {sensorData.humidity}%
            </div>
            <div className="h-20">
              <IoTChart value={sensorData.humidity} range={[30, 80]} color="#D4A574" />
            </div>
          </Card>

          {/* Soil Moisture */}
          <Card className="p-6 border border-border hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold">Soil Moisture</h3>
              <Leaf className="w-5 h-5 text-secondary" />
            </div>
            <div className="h-32 flex items-center justify-center">
              <GaugeChart value={sensorData.soilMoisture} />
            </div>
          </Card>

          {/* Air Quality */}
          <Card className="p-6 border border-border hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold">Air Quality</h3>
              <Wind className="w-5 h-5 text-primary" />
            </div>
            <div className="text-3xl font-bold mb-2">
              {sensorData.airQuality}
            </div>
          </Card>

          {/* Crop Health */}
          <Card className="p-6 border border-border hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold">Crop Health</h3>
              <TrendingUp className="w-5 h-5 text-secondary" />
            </div>
            <div className="text-3xl font-bold mb-2">
              {sensorData.cropHealth}%
            </div>
          </Card>
        </div>

        {/* Footer */}
        <div className="py-6 text-center text-sm text-foreground/50">
          Real-time data from your IoT sensors
        </div>
      </div>
    </div>
  );
}
