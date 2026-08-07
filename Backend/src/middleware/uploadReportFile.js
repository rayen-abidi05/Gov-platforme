const multer = require("multer");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = `uploads/${req.user.id}`;
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },

    filename: (req, file, cb) => {
        
        const ext = path.extname(file.originalname); 
        const uniqueId = crypto.randomUUID(); 
        const fileName = `Report File-${uniqueId}${ext}`;
        cb(null, fileName);
    },
});

const uploadReportFile = multer({ storage });

module.exports = uploadReportFile;