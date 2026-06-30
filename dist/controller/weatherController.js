"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDistrictWeatherAnalysis = void 0;
const axios_1 = __importDefault(require("axios"));
const WeatherAnalysis_1 = __importDefault(require("../model/WeatherAnalysis"));
const getDistrictWeatherAnalysis = async (req, res) => {
    try {
        // 1. Force the type to string to satisfy TypeScript compiler safely
        const districtName = req.params.districtName;
        if (!districtName) {
            res.status(400).json({ message: "District name parameter is required." });
            return;
        }
        const districtKey = districtName.toLowerCase();
        // 2. Check if we have a very recent analysis saved (e.g., within the last 30 minutes)
        const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
        const existingAnalysis = await WeatherAnalysis_1.default.findOne({
            district: districtKey,
            createdAt: { $gte: thirtyMinutesAgo }
        }).sort({ createdAt: -1 });
        if (existingAnalysis) {
            res.status(200).json(existingAnalysis);
            return;
        }
        // 3. Fetch Live weather from OpenWeatherMap
        const weatherApiKey = process.env.WEATHER_API_KEY;
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${districtName},LK&units=metric&appid=${weatherApiKey}`;
        const weatherRes = await axios_1.default.get(weatherUrl);
        const { main, wind, weather } = weatherRes.data;
        const temperature = main.temp;
        const humidity = main.humidity;
        const windSpeed = wind.speed;
        const condition = weather[0]?.description || 'clear sky';
        // 4. Request AI Insight via Groq
        let aiAnalysis = "AI Analysis unavailable at the moment.";
        if (process.env.GROQ_API_KEY) {
            try {
                const groqRes = await axios_1.default.post('https://api.groq.com/openai/v1/chat/completions', // Fixed typo here (completures -> completions)
                {
                    model: "llama-3.3-70b-versatile",
                    messages: [
                        {
                            role: "system",
                            content: "You are an environmental AI assistant for GlowCare. Keep insights under 3 sentences, focusing on climate impact and soil/plant conditions for Sri Lankan agriculture."
                        },
                        {
                            role: "user",
                            content: `Analyze metrics for ${districtName}: Temp ${temperature}°C, Humidity ${humidity}%, Wind ${windSpeed}m/s, Conditions: ${condition}.`
                        }
                    ],
                    max_tokens: 150
                }, {
                    headers: {
                        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                        'Content-Type': 'application/json'
                    }
                });
                aiAnalysis = groqRes.data.choices[0].message.content.trim();
            }
            catch (aiErr) {
                console.error("Groq AI Error:", aiErr);
            }
        }
        // 5. Save to Database separating by district
        const newAnalysis = await WeatherAnalysis_1.default.create({
            district: districtKey,
            temperature,
            humidity,
            windSpeed,
            condition,
            aiAnalysis
        });
        res.status(200).json(newAnalysis);
    }
    catch (error) {
        console.error("Weather Analysis Error:", error);
        res.status(500).json({ message: "Failed generating weather ecosystem diagnostic", error: error.message });
    }
};
exports.getDistrictWeatherAnalysis = getDistrictWeatherAnalysis;
