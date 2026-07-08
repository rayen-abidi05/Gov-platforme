const express = require('express');
const cors = require('cors');
const authRouter = require('./routes/authRoute');
const cookieParser = require('cookie-parser');
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"]
}));

app.use('/api/auth', authRouter);





module.exports = app;