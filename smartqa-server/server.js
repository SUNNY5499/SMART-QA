require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const roomRoutes = require('./src/routes/roomRoutes');
const http = require('http');
const { Server } = require('socket.io');

const app = express(); // Create instance of express

// Middleware
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected'))
.catch((error) => console.log('❌ Error connecting to DB:', error));

// CORS Configuration
const corsConfig = {
    origin: process.env.CLIENT_URL,
    credentials: true
};
app.use(cors(corsConfig));

// HTTP Server
const ourServer = http.createServer(app);

// Socket.io Setup
const io = new Server(ourServer, {
    cors: {
        origin: process.env.CLIENT_URL,
        methods: ["GET", "POST", "DELETE", "UPDATE"]
    }
});

io.on("connection", (socket) => {
    console.log('🟢 New client connection:', socket.id);

    socket.on("join-room", (roomCode) => {
        socket.join(roomCode);
        console.log(`📥 User joined the room: ${roomCode}`);
    });

    socket.on("disconnect", () => {
        console.log("🔴 Client disconnected:", socket.id);
    });
});

// Make io accessible in routes
app.set("io", io);

// Routes
app.use('/room', roomRoutes);

// Start the Server
const PORT = process.env.PORT || 5000;
ourServer.listen(PORT, (error) => {
    if (error) {
        console.log('❌ Server failed to start:', error);
    } else {
        console.log(`🚀 Server running on port: ${PORT}`);
    }
});
