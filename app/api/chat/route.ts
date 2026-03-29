import { type NextRequest, NextResponse } from "next/server"

const FARMING_SYSTEM_PROMPT = `You are an expert agricultural AI assistant specialized in helping farmers with practical farming knowledge. You have deep expertise in:
- Crop health and disease management
- Soil management and fertility
- Irrigation and water management
- Fertilizer and nutrient management
- Weather patterns and seasonal farming
- Pest and disease control
- Sustainable farming practices
- Farm productivity optimization

Important guidelines:
1. Always provide detailed, practical advice tailored to the farmer's situation
2. Use simple, clear language that farmers can understand
3. Reference specific techniques, timelines, and measurements when applicable
4. Consider seasonal and regional variations in farming
5. Prioritize sustainable and cost-effective solutions
6. If you don't know something specific, admit it and suggest general best practices
7. Maintain conversation context - reference previous messages when relevant
8. Provide actionable recommendations with clear steps

Respond in the same language as the user's message.`

interface Message {
  role: "user" | "assistant"
  content: string
}

interface ChatRequest {
  message: string
  language: string
  conversationHistory: Message[]
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json()
    const { message, language, conversationHistory } = body

    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      // Fallback to mock response
      const mockResponse = getMockFarmingResponse(message, language)
      return NextResponse.json({ response: mockResponse })
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: FARMING_SYSTEM_PROMPT,
          },
          ...conversationHistory,
          {
            role: "user",
            content: message,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    })

    if (!response.ok) {
      console.error("[v0] OpenAI API error:", response.status)
      const mockResponse = getMockFarmingResponse(message, language)
      return NextResponse.json({ response: mockResponse })
    }

    const data = await response.json()
    const botResponse = data.choices[0]?.message?.content || "I couldn't generate a response. Please try again."

    return NextResponse.json({ response: botResponse })
  } catch (error) {
    console.error("[v0] Chat API error:", error)
    return NextResponse.json({ error: "Failed to process chat request" }, { status: 500 })
  }
}

function getMockFarmingResponse(message: string, language: string): string {
  const lowerMessage = message.toLowerCase()

  // Soil management responses
  if (lowerMessage.includes("soil") || lowerMessage.includes("मिट्टी") || lowerMessage.includes("മണ്ണ്")) {
    const responses: Record<string, string> = {
      en: "For optimal soil health, I recommend: 1) Test soil pH (aim for 6-7 for most crops), 2) Add organic matter annually (compost, manure), 3) Practice crop rotation every 2-3 years, 4) Avoid excessive tilling, 5) Use cover crops in off-season. Healthy soil leads to healthy crops and better yields.",
      hi: "मिट्टी के स्वास्थ्य के लिए मैं अनुशंसा करता हूं: 1) मिट्टी की pH जांचें (अधिकांश फसलों के लिए 6-7), 2) हर साल जैविक पदार्थ जोड़ें (खाद, गोबर), 3) हर 2-3 साल में फसल चक्र करें, 4) अत्यधिक जुताई न करें, 5) ऑफ-सीजन में कवर क्रॉप लगाएं।",
      ta: "மண்ணின் ஆரோக்கியத்திற்காக நான் பரிந்துரைக்கிறேன்: 1) மண்ணின் pH சோதிக்கவும் (பெரும்பாலான பயிர்களுக்கு 6-7), 2) ஆண்டுதோறும் கரிம பொருட்கள் சேர்க்கவும் (உரம், சாணம்), 3) ஒவ்வொரு 2-3 ஆண்டுக்கும் பயிர் சுழற்சி செய்யவும், 4) அதிக உழவு கூடாது, 5) ஆஃப்-சीசன்ல மூடும் பயிர்களை வளர்க்கவும்.",
    }
    return responses[language] || responses.en
  }

  // Irrigation responses
  if (lowerMessage.includes("water") || lowerMessage.includes("irrigation") || lowerMessage.includes("सिंचन")) {
    const responses: Record<string, string> = {
      en: "Irrigation best practices: 1) Water early morning or late evening to reduce evaporation, 2) Most crops need 1-2 inches per week, 3) Check soil moisture before watering (soil should be moist 6 inches deep), 4) Use drip irrigation for efficiency, 5) Avoid waterlogging. Proper irrigation increases yields by 30-40%.",
      hi: "सिंचन के सर्वोत्तम तरीके: 1) सुबह जल्दी या शाम को देर से पानी दें, 2) अधिकांश फसलों को प्रति सप्ताह 1-2 इंच की जरूरत है, 3) पानी देने से पहले मिट्टी की नमी जांचें, 4) ड्रिप सिंचाई का उपयोग करें, 5) जलभराव न होने दें।",
      ta: "நீர்ப்பாசன சிறந்த பயிற்சிகள்: 1) காலையில் அல்லது மாலையில் பানி விடவும், 2) பெரும்பாலான பயிர்களுக்கு வாரம் 1-2 இஞ்சு தேவை, 3) பனி விடுவதற்கு முன் மண்ணின் ஈரப்பதத்தை பரிசோதிக்கவும், 4) சொட்டு நீர்ப்பாசன பயன்படுத்தவும், 5) நீர் தேக்கம் தவிர்க்கவும்.",
    }
    return responses[language] || responses.en
  }

  // Crop health responses
  if (
    lowerMessage.includes("crop") ||
    lowerMessage.includes("health") ||
    lowerMessage.includes("पिक") ||
    lowerMessage.includes("disease") ||
    lowerMessage.includes("pest")
  ) {
    const responses: Record<string, string> = {
      en: "Maintaining crop health: 1) Monitor crops daily for pests and diseases, 2) Use integrated pest management (IPM), 3) Apply organic pesticides when needed, 4) Ensure proper spacing for air circulation, 5) Rotate crops annually, 6) Remove infected plants immediately. Regular monitoring prevents 70% of crop diseases.",
      hi: "पिक के स्वास्थ्य को बनाए रखना: 1) कीटों और रोगों के लिए रोजाना निगरानी करें, 2) एकीकृत कीट प्रबंधन (IPM) का उपयोग करें, 3) जरूरत पड़ने पर जैविक कीटनाशक लागू करें, 4) हवा के संचार के लिए उचित दूरी सुनिश्चित करें, 5) सालाना फसल चक्र करें, 6) संक्रमित पौधों को तुरंत हटाएं।",
      ta: "பயிர் ஆரோக்கியத்தை பராமரிக்கவும்: 1) பயிர்களை தினமும் பூச்சி மற்றும் நோய்களுக்கு கண்காணிக்கவும், 2) ஒருங்கிணைந்த பூச்சி மேலாண்மையை பயன்படுத்தவும், 3) தேவைக்கேற்ப கரிம பூச்சிக்கொல்லி பயன்படுத்தவும், 4) காற்றோட்டத்திற்கு சரியான இடைவெளி உறுதி செய்யவும், 5) ஆண்டுதோறும் பயிர்கள் சுழற்றவும், 6) தொற்றுயुक்த தாவரங்களை உடனே அகற்றவும்.",
    }
    return responses[language] || responses.en
  }

  // Fertilizer responses
  if (lowerMessage.includes("fertilizer") || lowerMessage.includes("nutrient") || lowerMessage.includes("खाद")) {
    const responses: Record<string, string> = {
      en: "Nutrient management strategy: 1) Test soil nutrients annually, 2) Use NPK (Nitrogen-Phosphorus-Potassium) balanced fertilizers, 3) Apply 50% through composting, 50% through chemical (if needed), 4) Split applications: base dose before planting, top dress during growth, 5) Consider micronutrients (Zinc, Boron) if deficient. Proper nutrition increases yields by 20-35%.",
      hi: "पोषक तत्व प्रबंधन रणनीति: 1) सालाना मिट्टी के पोषक तत्वों का परीक्षण करें, 2) संतुलित NPK खाद का उपयोग करें, 3) 50% खाद के माध्यम से, 50% रासायनिक के माध्यम से, 4) आवेदन को दो भागों में बांटें, 5) सूक्ष्म पोषक तत्वों पर विचार करें।",
      ta: "ஊட்டச்சத்து மேலாண்மை உத்தி: 1) ஆண்டுதோறும் மண்ணின் ஊட்டச்சத்தை சோதிக்கவும், 2) சமநிலை NPK உரத்தைப் பயன்படுத்தவும், 3) 50% உரம் மூலம், 50% இரசாயனம் மூலம், 4) பயன்பாடு பிரிக்கவும், 5) நுண்ணூட்ட தாதுக்கள் பற்றி கவனியுங்கள்.",
    }
    return responses[language] || responses.en
  }

  // Default general farming advice
  const responses: Record<string, string> = {
    en: "I'm your AI farming expert! Ask me about crop health, soil management, irrigation techniques, fertilizer usage, pest control, weather patterns, or any farming challenges you're facing. I'll provide detailed, practical advice to help optimize your farm productivity.",
    hi: "मैं आपका AI कृषि विशेषज्ञ हूं! मुझसे फसल स्वास्थ्य, मिट्टी प्रबंधन, सिंचाई तकनीकें, खाद उपयोग, कीट नियंत्रण, मौसम पैटर्न या किसी भी कृषि चुनौती के बारे में पूछें।",
    ta: "நான் உங்கள் AI விவசாய நிபுணர்! பயிர் ஆரோக்கியம், மண் நிர்வாகம், நீர்ப்பாசன நுட்பங்கள், உரப் பயன்பாடு, பூச்சி கட்டுப்பாடு, காலநிலை முறைகள் அல்லது ஏதேனும் விவசாய சவால் பற்றி எனக்கு கேளுங்கள்.",
    te: "నేను మీ AI వ్యవసాయ నిపుణుడిని! పంట ఆరోగ్యం, నేల నిర్వహణ, నీటిపాయన పద్ధతులు, ఎరువుల ఉపయోగం, పీడకజ్జ నియంత్రణ, వాతావరణ నమూనాలు గురించి నన్ను అడగండి.",
    bn: "আমি আপনার AI কৃষি বিশেষজ্ঞ! ফসলের স্বাস্থ্য, মাটি ব্যবস্থাপনা, সেচ কৌশল, সার ব্যবহার, কীটপতঙ্গ নিয়ন্ত্রণ, আবহাওয়া পরিস্থিতি বা যেকোনো কৃষি চ্যালেঞ্জ সম্পর্কে আমাকে জিজ্ঞাসা করুন।",
    mr: "मी तुमचा AI कृषी तज्ञ आहे! पिक आरोग्य, मातीचे व्यवस्थापन, सिंचन तंत्र, खत वापर, कीटक नियंत्रण, हवामान नमुने किंवा कोणत्याही शेतकरी आव्हानाबद्दल मला विचारा।",
    kn: "ನಾನು ನಿಮ್ಮ AI ಕೃಷಿ ಪರಿಣತರು! ಸಸ್ಯ ಆರೋಗ್ಯ, ಮಣ್ಣಿನ ನಿರ್ವಹಣೆ, ನೀರಾವರಿ ತಂತ್ರಗಳು, ಗೊಬ್ಬರ ಬಳಕೆ, ಕೀಟ ನಿಯಂತ್ರಣ, ಹವಾಮಾನ ನಮೂನೆಗಳ ಬಗ್ಗೆ ನನ್ನನ್ನು ಕೇಳಿ.",
    pa: "ਮੈਂ ਤੁਹਾਡਾ AI ਖੇਤੀ ਮਾਹਿਰ ਹਾਂ! ਪਿਆਜ ਦੀ ਸਿਹਤ, ਮਿੱਟੀ ਦਾ ਪ੍ਰਬੰਧਨ, ਸਿੰਚਾਈ ਤਕਨੀਕਾਂ, ਖਾਦ ਦੀ ਵਰਤੋਂ, ਕੀਟ ਨਿਯੰਤ੍ਰਣ, ਮੌਸਮ ਦੇ ਪੈਟਰਨ ਬਾਰੇ ਮੈਨੂੰ ਪੁੱਛੋ।",
  }

  return responses[language] || responses.en
}
