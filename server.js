// ===== In-Memory Database =====
const memoryDB = {
  users: [],
  agents: [],
  chats: []
};

// ===== Imports =====
const express = require('express');
const session = require('express-session');
// const mongoose = require('mongoose'); // Database disabled
const passport = require('passport');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const rateLimit = require('express-rate-limit');
// const Agent = require('./models/Agent'); // Database disabled
// const Chat = require('./models/Chat'); // Database disabled
// const User = require('./models/User'); // Database disabled

// ===== Deepseek Util Placeholder =====
// You should replace this mock with your actual deepseekUtil module.
const deepseekUtil = {
  async ask(q) {
    // Dummy mock for agent creation; replace with real logic or API.
    if (q.includes('human name')) return "Alex Doe";
    if (q.includes('personality')) return "Curious and witty";
    if (q.includes('life story')) return "Born in a lab, loves AI, helps humans.";
    return "Unknown";
  }
};

// ===== App and Socket Setup =====
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

// ====== Auth Routes ======
const authRouter = express.Router();
authRouter.post('/login', passport.authenticate('local', {
  successRedirect: '/home.html',
  failureRedirect: '/login.html'
}));
authRouter.post('/logout', (req, res) => {
  req.logout();
  res.redirect('/login.html');
});
app.get('/', (req, res) => {res.redirect("/login.html")})
app.use('/auth', authRouter);

// ====== Agents Routes ======
const agentsRouter = express.Router();
agentsRouter.post('/create', async (req, res) => {
  // Generate AI attributes
  const name = await deepseekUtil.ask('Generate a random human name.');
  const personality = await deepseekUtil.ask('Describe a unique AI personality.');
  const lifeStory = await deepseekUtil.ask('Write a life story for an AI agent.');

  // const agent = new Agent({ name, personality, lifeStory, notes: [], files: [] });
  // await agent.save(); // Database disabled

  // In-memory storage
  const agent = { 
    id: memoryDB.agents.length + 1, 
    name, 
    personality, 
    lifeStory, 
    notes: [], 
    files: [] 
  };
  memoryDB.agents.push(agent);

  res.json(agent);
});
app.use('/agents', agentsRouter);

// ====== Chats Routes ======
const chatsRouter = express.Router();
// Get all chats for a user
chatsRouter.get('/', (req, res) => {
  // const chats = await Chat.find({ userId: req.user._id }); // Database disabled
  if (!req.user || typeof req.user._id === "undefined") {
    return res.status(401).json({ error: "Unauthorized: No user in session." });
  }
  const chats = memoryDB.chats.filter(chat => chat.userId === req.user._id);
  res.json(chats);
});
// Create a new chat
chatsRouter.post('/', (req, res) => {
  // const newChat = new Chat({ userId: req.user._id, messages: [] }); // Database disabled
  // await newChat.save(); // Database disabled
  if (!req.user || typeof req.user._id === "undefined") {
    return res.status(401).json({ error: "Unauthorized: No user in session." });
  }
  const newChat = { id: memoryDB.chats.length + 1, userId: req.user._id, messages: [] };
  memoryDB.chats.push(newChat);
  res.status(201).json(newChat);
});
app.use('/chats', chatsRouter);

// ====== Settings Routes ======
const settingsRouter = express.Router();
// Define rate limiter: maximum of 100 requests per 15 minutes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per windowMs
});
// Get user settings
settingsRouter.get('/', limiter, (req, res) => {
  // const user = await User.findById(req.user._id).select('settings'); // Database disabled
  if (!req.user || typeof req.user._id === "undefined") {
    return res.status(401).json({ error: "Unauthorized: No user in session." });
  }
  const user = memoryDB.users.find(u => u._id === req.user._id);
  res.json(user ? user.settings : {});
});
// Update user settings
settingsRouter.post('/', limiter, (req, res) => {
  const { theme, notifications } = req.body;
  // const user = await User.findById(req.user._id); // Database disabled
  if (!req.user || typeof req.user._id === "undefined") {
    return res.status(401).json({ error: "Unauthorized: No user in session." });
  }
  let user = memoryDB.users.find(u => u._id === req.user._id);
  if (!user) {
    user = { _id: req.user._id, settings: {} };
    memoryDB.users.push(user);
  }
  user.settings = user.settings || {};
  user.settings.theme = theme;
  user.settings.notifications = notifications;
  // await user.save(); // Database disabled
  res.json(user.settings);
});
app.use('/settings', settingsRouter);

// ====== Socket.io Events ======
io.on('connection', socket => {
  socket.on('chat message', msg => {
    io.emit('chat message', msg);
  });
});

// ====== Server Start ======
server.listen(3000, () => console.log('Server started on http://localhost:3000'));
