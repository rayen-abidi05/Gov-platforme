const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authRouter = require('./routes/authRoute');
const fileRoute = require("./routes/fileRoute");
const authenticateToken = require('./middleware/authToken');

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"]
}));

app.use('/api/auth', authRouter);
app.use("/api/files",authenticateToken,fileRoute);




module.exports = app;