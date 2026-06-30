import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import connectDB from './config/db';
import helmet from 'helmet';
import authRoutes from "./routes/authRoutes";
import calculateRoutes from "./routes/calculateRoute";
import weatherRoutes from "./routes/weatherRoute"; 

const app = express();

const PORT = process.env.PORT || 5000;

const allowedOrigins = process.env.FRONTEND_ORIGIN
  ? process.env.FRONTEND_ORIGIN.split(",")
  : ["http://localhost:5173", "http://localhost:4173"];
const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";
const wsBackendUrl = process.env.WS_BACKEND_URL || "ws://localhost:5000";

// Middlewares
app.use(
  cors({
    origin: allowedOrigins, // Explicitly whitelist frontend origins
    credentials: true,
    allowedHeaders: ["Authorization", "Content-Type"],
  }),
);

// Content Security Policy Configuration to fix the browser loading block
app.use(
  helmet({
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
  })
);

// Increased body parser limits to accommodate larger base64 file buffers safely
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));


app.use('/api/auth', authRoutes);
app.use("/api/calculate", calculateRoutes);
app.use("/api/weather", weatherRoutes); 

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
    await connectDB();
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📚 EnviroScopeMap Backend is ready!`);
      console.log(`📌 Request System Active!`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();