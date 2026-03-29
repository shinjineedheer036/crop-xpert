"use client"

import { useState, useRef, useEffect } from "react"
import { MessageCircle, X, Mic, Volume2, Send } from "lucide-react"
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
  en: "English",
  hi: "Hindi",
  ta: "Tamil",
  te: "Telugu",
  bn: "Bengali",
  mr: "Marathi",
  pa: "Punjabi",
}

const CHATBOT_RESPONSES: Record<string, string> = {
  en: "Hello! I'm your farming assistant. Ask me about soil health, irrigation, weather tips, or crop management.",
  hi: "नमस्ते! मैं आपका कृषि सहायक हूं। मुझसे मिट्टी के स्वास्थ्य, सिंचाई, मौसम के सुझाव या फसल प्रबंधन के बारे में पूछें।",
  ta: "வணக்கம்! நான் உங்கள் விவசாய உதவியாளர். மண்ணின் ஆரோக்கியம், நீர்ப்பாசனம், காலநிலை குறிப்புகள் அல்லது பயிர் மேலாண்மை பற்றி கேளுங்கள்.",
  te: "హలో! నేను మీ వ్యవసాయ సహాయకుడిని. నేల ఆరోగ్యం, నీటిపాయన, వాతావరణ చిట్కాలు లేదా పంట నిర్వహణ గురించి నన్ను అడగండి.",
  bn: "হ্যালো! আমি আপনার কৃষি সহায়ক। মাটির স্বাস্থ্য, সেচ, আবহাওয়া টিপস বা ফসলের ব্যবস্থাপনা সম্পর্কে আমাকে জিজ্ঞাসা করুন।",
  mr: "नमस्कार! मी तुमचा कृषी सहाय्यक आहे. माती की आरोग्य, सिंचन, हवामान टिप्स किंवा पिकांचे व्यवस्थापन बद्दल मला विचारा.",
  pa: "ਨਮਸਤੇ! ਮੈਂ ਤੁਹਾਡਾ ਖੇਤੀ ਸਹਾਇਕ ਹਾਂ। ਮਿੱਟੀ ਦੀ ਸਿਹਤ, ਸਿੰਚਾਈ, ਮੌਸਮ ਦੀਆਂ ਸੁਝਾਈਆਂ ਜਾਂ ਫਸਲ ਪ੍ਰਬੰਧਨ ਬਾਰੇ ਮੈਨੂੰ ਪੁੱਛੋ।",
}

const SAMPLE_RESPONSES = {
  soil: {
    en: "For healthy soil, maintain pH 6-7, add organic matter regularly, and practice crop rotation.",
    hi: "स्वस्थ मिट्टी के लिए pH 6-7 बनाए रखें, नियमित रूप से जैविक पदार्थ जोड़ें, और फसल चक्र का पालन करें।",
    ta: "ஆரோக்கியமான மண்ணுக்கு pH 6-7 பராமரிக்கவும், தொடர்ந்து கரிம பொருள் சேர்க்கவும், பயிர் சுழற்சி பயிற்சி செய்யவும்.",
  },
  water: {
    en: "Water your crops early morning or late evening to minimize evaporation. Most crops need 1-2 inches per week.",
    hi: "अपनी फसलों को सुबह जल्दी या शाम को देर से पानी दें ताकि वाष्पीकरण कम हो। अधिकांश फसलों को प्रति सप्ताह 1-2 इंच की जरूरत होती है।",
    ta: "உங்கள் பயிர்களுக்கு காலையில் அல்லது மாலையில் தண்ணீர் விடவும். பெரும்பாலான பயிர்களுக்கு வாரத்திற்கு 1-2 இஞ்சு தேவை.",
  },
  health: {
    en: "Monitor crops regularly for pests and diseases. Use organic pesticides when needed and practice integrated pest management.",
    hi: "कीटों और रोगों के लिए फसलों की नियमित निगरानी करें। आवश्यकता पड़ने पर जैविक कीटनाशक का उपयोग करें।",
    ta: "பூச்சிகள் மற்றும் நோய்களுக்கான பயிர்களை வழக்கமாக கண்காணிக்கவும். தேவைக்கேற்ப கரிம பூச்சிக்கொல்லிகளைப் பயன்படுத்தவும்.",
  },
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState("")
  const [language, setLanguage] = useState<keyof typeof LANGUAGES>("en")
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Initialize speech recognition
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
      }
    }
  }, [])

  const handleStartListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true)
      recognitionRef.current.start()
    }
  }

  const handleSpeak = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = language === "en" ? "en-US" : language
      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      window.speechSynthesis.speak(utterance)
    }
  }

  const handleSendMessage = (text?: string) => {
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

    let botResponse = CHATBOT_RESPONSES[language]

    const lowerText = messageText.toLowerCase()
    if (lowerText.includes("soil") || lowerText.includes("मिट्टी") || lowerText.includes("மண்"))
      botResponse = SAMPLE_RESPONSES.soil[language] || SAMPLE_RESPONSES.soil.en
    else if (lowerText.includes("water") || lowerText.includes("सिंचन") || lowerText.includes("நீர்"))
      botResponse = SAMPLE_RESPONSES.water[language] || SAMPLE_RESPONSES.water.en
    else if (lowerText.includes("pest") || lowerText.includes("disease") || lowerText.includes("कीट"))
      botResponse = SAMPLE_RESPONSES.health[language] || SAMPLE_RESPONSES.health.en

    setTimeout(() => {
      const bot: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, bot])
      handleSpeak(botResponse)
    }, 500)
  }

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 p-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-40"
        title="Open Chatbot"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="w-96 h-[600px] p-0 flex flex-col rounded-2xl border-2 border-primary/20">
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-primary/80 to-accent/80 text-primary-foreground rounded-t-2xl">
              <h3 className="font-semibold mb-3">🌾 Farm Assistant</h3>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as keyof typeof LANGUAGES)}
                className="w-full text-sm p-2 rounded bg-primary-foreground/20 text-primary-foreground border border-primary-foreground/30"
              >
                {Object.entries(LANGUAGES).map(([code, name]) => (
                  <option key={code} value={code} className="bg-card text-foreground">
                    {name}
                  </option>
                ))}
              </select>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-background/50">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-foreground/50 text-sm text-center">
                  <p>{CHATBOT_RESPONSES[language]}</p>
                </div>
              ) : (
                <>
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                          msg.sender === "user"
                            ? "bg-primary text-primary-foreground rounded-br-none"
                            : "bg-secondary/30 text-foreground rounded-bl-none"
                        }`}
                      >
                        {msg.text}
                        {msg.sender === "bot" && (
                          <button
                            onClick={() => handleSpeak(msg.text)}
                            className="ml-2 inline-block hover:opacity-70"
                            title="Read message"
                          >
                            <Volume2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-border space-y-3 bg-background">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Ask about farming..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1"
                />
                <Button onClick={() => handleSendMessage()} className="bg-primary hover:bg-primary/90 p-2 h-10 w-10">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <Button
                onClick={handleStartListening}
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
