"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./config/db"));
const helmet_1 = __importDefault(require("helmet"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const calculateRoute_1 = __importDefault(require("./routes/calculateRoute"));
const weatherRoute_1 = __importDefault(require("./routes/weatherRoute"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
const allowedOrigins = process.env.FRONTEND_ORIGIN
    ? process.env.FRONTEND_ORIGIN.split(",")
    : ["http://localhost:5173", "http://localhost:4173"];
const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";
const wsBackendUrl = process.env.WS_BACKEND_URL || "ws://localhost:5000";
// Middlewares
app.use((0, cors_1.default)({
    origin: allowedOrigins, // Explicitly whitelist frontend origins
    credentials: true,
    allowedHeaders: ["Authorization", "Content-Type"],
}));
// Content Security Policy Configuration to fix the browser loading block
app.use((0, helmet_1.default)({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            // Whitelists local port 5000 so the frontend can display image attachments
            imgSrc: ["'self'", "data:", "https:", "http://localhost:5000"],
            // Whitelists network connection access pipelines
            connectSrc: ["'self'", "http://localhost:5000"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
        },
    },
    // Allows cross-origin requests for resources (like displaying your uploaded files)
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
// Increased body parser limits to accommodate larger base64 file buffers safely
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ limit: '50mb', extended: true }));
app.use('/api/auth', authRoutes_1.default);
app.use("/api/calculate", calculateRoute_1.default);
app.use("/api/weather", weatherRoute_1.default);
app.get('/', (req, res) => {
    res.send(`
    <h1>✅ EnviroScopeMap Backend is Running Successfully!</h1>
    <p><strong>API is working at:</strong> http://localhost:5000/api</p>
    <br>
    <p>Available Routes:</p>
    <ul>
      <li><a href="/api/health">/api/health</a></li>
      <li><a href="/api/weather">/api/weather</a></li>
      <li><strong>POST:</strong> /api/auth/login (Frontend Login Connection Endpoint)</li>
    </ul>
  `);
});
// Health Check
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'EnviroScopeMap Backend is running smoothly!'
    });
});
const startServer = async () => {
    try {
        await (0, db_1.default)();
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
            console.log(`📚 EnviroScopeMap Backend is ready!`);
            console.log(`📌 Request System Active!`);
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};
startServer();
