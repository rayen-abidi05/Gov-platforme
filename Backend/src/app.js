const cookieParser = require("cookie-parser");
const express = require('express');
const cors = require('cors');

const testEmailRoutes = require("./routes/testEmail.routes");
const authRouter = require('./routes/authRoute');
const fileRoute = require("./routes/fileRoute");
const reqRgistRoute = require("./routes/reqRgist");
const companyRoute = require("./routes/companyRoute");
const notifRoute = require("./routes/notifRoute");
const activityLogRoute = require("./routes/activityLog.routes");
const ministerRoute = require ("./routes/ministerFormulaire.routes");
const instanceRoute = require ("./routes/instances");
const inspecRoute = require("./routes/inspections"); 
const exportRequestsRoute = require("./routes/export-requests");
const authenticateToken = require('./middleware/authToken');

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"]
}));



app.use("/api", testEmailRoutes);
app.use('/api/auth', authRouter);
app.use("/api/files",authenticateToken,fileRoute);
app.use("/api/registration",authenticateToken,reqRgistRoute);
app.use("/api/company",companyRoute);
app.use("/api/notifications",authenticateToken,notifRoute)
app.use("/api/activity-logs",authenticateToken,activityLogRoute)
app.use("/api/minister-formulaires",authenticateToken,ministerRoute)
app.use("/api/instances",instanceRoute)
app.use("/api/inspections",inspecRoute)
app.use("/api/export-requests",exportRequestsRoute)
module.exports = app;