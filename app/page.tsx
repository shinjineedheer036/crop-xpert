"use client";

import { useState } from "react";
import { LoginForm } from "@/components/auth/login-form";
import { MainApp } from "@/components/main-app";
import { AdvancedChatbot } from "@/components/advanced-chatbot";

export default function Page() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (email: string) => {
    setIsAuthenticated(true);
    localStorage.setItem("userEmail", email);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("userEmail");
  };

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div>
      <MainApp onLogout={handleLogout} />
      <AdvancedChatbot />
    </div>
  );
}