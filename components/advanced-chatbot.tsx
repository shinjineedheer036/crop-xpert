"use client"

import { useState, useRef, useEffect } from "react"
import { Bot, X, Mic, Volume2, Send, ChevronDown } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent } from "@/components/ui/dialog"

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

const LANGUAGES = {
  en: { name: "English", code: "en-US" },
  hi: { name: "Hindi", code: "hi-IN" },
  ta: { name: "Tamil", code: "ta-IN" },
  te: { name: "Telugu", code: "te-IN" },
  bn: { name: "Bengali", code: "bn-IN" },
  mr: { name: "Marathi", code: "mr-IN" },
  kn: { name: "Kannada", code: "kn-IN" },
  pa: { name: "Punjabi", code: "pa-IN" },
}

const WELCOME_MESSAGES = {
  en: "Hello! I'm your AI farming assistant. Ask me anything about crop health, soil management, irrigation, fertilizer usage, weather patterns, or farming tips. I'm here to help optimize your farm production.",
  hi: "नमस्ते! मैं आपका AI कृषि सहायक हूं। मुझसे फसल स्वास्थ्य, मिट्टी प्रबंधन, सिंचाई, उर्वरक उपयोग, मौसम के पैटर्न या कृषि सुझाव के बारे में कुछ भी पूछें। मैं आपके खेत का उत्पादन अनुकूलित करने के लिए यहां हूं।",
  ta: "வணக்கம்! நான் உங்கள் AI விவசாய உதவியாளர். பயிர் ஆரோக்கியம், மண் நிர்வாகம், நீர்ப்பாசனம், உரப் பயன்பாடு, காலநிலை முறைகள் அல்லது விவசாய குறிப்புகள் பற்றி எதையும் என்னிடம் கேளுங்கள்.",
  te: "హలో! నేను మీ AI వ్యవసాయ సహాయకుడిని. పంట ఆరోగ్యం, నేల నిర్వహణ, నీటిపాయన, ఎరువుల ఉపయోగం, వాతావరణ నమూనాలు లేదా వ్యవసాయ చిట్కాల గురించి నన్ను ఏదైనా అడగండి.",
  bn: "হ্যালো! আমি আপনার AI কৃষি সহায়ক। ফসলের স্বাস্থ্য, মাটি ব্যবস্থাপনা, সেচ, সার ব্যবহার, আবহাওয়া পরিস্থিতি বা কৃষি টিপস সম্পর্কে আমাকে যে কোনো কিছু জিজ্ঞাসা করুন।",
  mr: "नमस्कार! मी तुमचा AI कृषी सहाय्यक आहे. पिक स्वास्थ्य, मातीचे निर्वहण, सिंचन, खत वापर, हवा-मान नमुने किंवा शेतकरी सल्ल्या बद्दल मला कधीही विचारा.",
  kn: "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ AI ಕೃಷಿ ಸಹಾಯಕ. ಸಸ್ಯ ಆರೋಗ್ಯ, ಮಣ್ಣಿನ ನಿರ್ವಹಣೆ, ನೀರಾವರಿ, ಗೊಬ್ಬರ ಬಳಕೆ, ಹವಾಮಾನ ಮಾದರಿಗಳು ಅಥವಾ ಕೃಷಿ ಸಲಹೆಗಳ ಬಗ್ಗೆ ನನ್ನನ್ನು ಕೇಳಿ.",
  pa: "ਨਮਸਤੇ! ਮੈਂ ਤੁਹਾਡਾ AI ਖੇਤੀ ਸਹਾਇਕ ਹਾਂ। ਪਿਆਜ ਦੀ ਸਿਹਤ, ਮਿੱਟੀ ਦਾ ਪ੍ਰਬੰਧਨ, ਸਿੰਚਾਈ, ਖਾਦ ਦੀ ਵਰਤੋਂ, ਮੌਸਮ ਦੇ ਪੈਟਰਨ ਜਾਂ ਖੇਤੀ ਦੀਆਂ ਸੁਝਾਈਆਂ ਬਾਰੇ ਮੈਨੂੰ ਕੁਝ ਵੀ ਪੁੱਛੋ।",
}

export function AdvancedChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState("")
  const [language, setLanguage] = useState<keyof typeof LANGUAGES>("en")
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [detectedLanguage, setDetectedLanguage] = useState<keyof typeof LANGUAGES>("en")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = false
        recognitionRef.current.interimResults = false

        recognitionRef.current.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0].transcript)
            .join("")
          setInputText(transcript)
          handleSendMessage(transcript)
        }

        recognitionRef.current.onerror = () => {
          setIsListening(false)
        }
      }
    }
  }, [])

  const handleStartListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true)
      recognitionRef.current.lang = LANGUAGES[language].code
      recognitionRef.current.start()
    }
  }

  const handleSpeak = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = LANGUAGES[language].code
      utterance.rate = 0.9
      utterance.pitch = 1
      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      window.speechSynthesis.speak(utterance)
    }
  }

  const handleSendMessage = async (text?: string) => {
    const messageText = text || inputText.trim()
    if (!messageText) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputText("")
    setIsListening(false)
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageText,
          language,
          conversationHistory: messages.map((m) => ({
            role: m.sender === "user" ? "user" : "assistant",
            content: m.text,
          })),
        }),
      })

      if (!response.ok) throw new Error("API request failed")

      const data = await response.json()
      const botResponse = data.response

      setTimeout(() => {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: botResponse,
          sender: "bot",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, botMessage])
        handleSpeak(botResponse)
      }, 300)
    } catch (error) {
      console.log("[v0] Chat error:", error)
      // Fallback response if API fails
      const fallbackResponse =
        "I apologize, but I'm having trouble processing your request. Please try again or check your connection."
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: fallbackResponse,
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 p-4 bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-40 hover:scale-110"
        title="Open Farm AI Assistant"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
      </button>

      {isOpen && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="w-96 h-[600px] p-0 flex flex-col rounded-2xl border-2 border-primary/20 shadow-2xl bg-gradient-to-b from-background to-background/95">
            {/* Header with language selector */}
            <div className="p-4 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-t-2xl space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">AI Farm Assistant</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="hover:bg-primary-foreground/20 p-1 rounded transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Language selector */}
              <div className="relative">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as keyof typeof LANGUAGES)}
                  className="w-full text-sm p-2.5 rounded-lg bg-primary-foreground/20 text-primary-foreground border border-primary-foreground/40 appearance-none cursor-pointer hover:bg-primary-foreground/30 transition-colors"
                >
                  {Object.entries(LANGUAGES).map(([code, data]) => (
                    <option key={code} value={code} className="bg-card text-foreground">
                      {data.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-3.5 pointer-events-none text-primary-foreground/60" />
              </div>
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-background/50 to-background">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center space-y-3">
                    <div className="text-3xl">🌾</div>
                    <p className="text-sm text-foreground/60 leading-relaxed px-2">{WELCOME_MESSAGES[language]}</p>
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-xs px-4 py-3 rounded-xl text-sm leading-relaxed ${
                          msg.sender === "user"
                            ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-br-none shadow-md"
                            : "bg-secondary/20 text-foreground rounded-bl-none border border-secondary/30"
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                        {msg.sender === "bot" && (
                          <button
                            onClick={() => handleSpeak(msg.text)}
                            disabled={isSpeaking}
                            className="mt-2 inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded bg-primary-foreground/10 hover:bg-primary-foreground/20 disabled:opacity-50 transition-colors"
                            title="Read message"
                          >
                            <Volume2 className="w-3 h-3" />
                            Speak
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-secondary/20 text-foreground px-4 py-3 rounded-xl rounded-bl-none border border-secondary/30">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input area */}
            <div className="p-4 border-t border-border space-y-3 bg-background">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Ask about your farm..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && !isLoading && handleSendMessage()}
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button
                  onClick={() => handleSendMessage()}
                  disabled={isLoading || !inputText.trim()}
                  className="bg-primary hover:bg-primary/90 p-2 h-10 w-10 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <Button
                onClick={handleStartListening}
                disabled={isLoading || isListening}
                variant={isListening ? "default" : "outline"}
                className="w-full flex items-center justify-center gap-2"
              >
                <Mic className={`w-4 h-4 ${isListening ? "animate-pulse" : ""}`} />
                {isListening ? "Listening..." : "Voice Input"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
