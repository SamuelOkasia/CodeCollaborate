const express = require('express');
const http = require('http');  // Import http module
const { Server } = require('socket.io');  // Import Socket.IO
const passport = require('passport');
const bodyParser = require('body-parser');
require('dotenv').config();
require('./config/passport');
const cors = require('cors');  // Import cors
const authRoutes = require('./routes/authRoutes');
const codeRoutes = require('./routes/codeRoutes');

const app = express();
const server = http.createServer(app);  // Create an HTTP server
const io = new Server(server, {  // Create a Socket.IO instance
  cors: {
    origin: 'http://localhost:3000',  // Allow frontend requests
    methods: ['GET', 'POST'],         // Allowed methods

  },
});

// Apply CORS middleware
app.use(cors({
    origin: 'http://localhost:3000',  // Allow requests from the frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true  // Allow credentials (like cookies, if applicable)
  }));

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log('A user connected');

  // Listening for "code change" events
  socket.on('code-change', (data) => {
    console.log('Code change received:', data);

    // Broadcast the code change to all connected clients except the sender
    socket.broadcast.emit('receive-code-change', data);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

app.use(passport.initialize());
app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use('/code', codeRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {  // Start the server
  console.log(`Server is running on port ${PORT}`);
});
