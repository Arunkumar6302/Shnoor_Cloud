const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { createServer } = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const path = require('path');

dotenv.config();

connectDB();

const app = express();
const httpServer = createServer(app);

const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', process.env.CLIENT_URL];

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

io.on('connection', (socket) => {
  console.log('someone connected!', socket.id);
  socket.on('disconnect', () => console.log('user left', socket.id));
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/files', require('./routes/fileRoutes'));
app.use('/api/folders', require('./routes/folderRoutes'));

// Serve static files from the React frontend app in production
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '../frontend/dist');
  app.use(express.static(frontendPath));
  
  app.get('*', (req, res) => {
    // If it's an API route, don't serve index.html
    if (req.originalUrl.startsWith('/api')) {
      return res.status(404).json({ message: 'API route not found' });
    }
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => res.send('API is up and running smoothly (Development Mode)'));
}

const port = process.env.PORT || 5000;
httpServer.listen(port, () => console.log(`Server listening on ${port}`));
