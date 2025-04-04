import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/adminRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";
import viewFeedbackRoutes from "./routes/viewFeedback.js";
import RecruitersRoutes from "./routes/RecruitersRoutes.js";
import attendeeRoutes from "./routes/attendees.js";

dotenv.config();

const app = express();

// Connect to MongoDB with retry logic
const connectWithRetry = async () => {
  try {
    await connectDB();
    console.log("✅ MongoDB Connected Successfully");
  } catch (err) {
    console.error("❌ MongoDB Connection Failed:", err);
    // Retry connection after 5 seconds
    setTimeout(connectWithRetry, 5000);
  }
};

connectWithRetry();

// Middleware
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://feedback-portal-frontend.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  maxAge: 86400 // 24 hours
}));

app.use(express.json());
app.use(bodyParser.json());

// Health check endpoint
app.get('/', (req, res) => {
  try {
    res.json({ 
      status: 'success',
      message: 'Backend Server is Running Successfully',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      mongodb: process.env.MONGO_URI ? 'Configured' : 'Not Configured',
      endpoints: {
        auth: '/api/auth',
        admin: '/api/admin',
        feedback: '/api/feedback',
        viewFeedback: '/api/viewFeedback',
        recruiters: '/api/recruiters',
        attendees: '/api/attendees'
      }
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Health check failed',
      error: error.message 
    });
  }
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/viewFeedback", viewFeedbackRoutes);
app.use('/api/recruiters', RecruitersRoutes);
app.use('/api/attendees', attendeeRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: { 
      code: '404', 
      message: 'Route not found' 
    } 
  });
});

// Error handling middleware (should be last)
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: { 
      code: '500', 
      message: 'A server error has occurred',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    } 
  });
});

// Handle serverless function timeouts
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    res.setTimeout(10000, () => {
      res.status(408).json({ 
        error: { 
          code: '408', 
          message: 'Request timeout' 
        } 
      });
    });
    next();
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

//made changes