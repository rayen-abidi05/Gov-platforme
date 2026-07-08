const multer = require("multer");
const fs = require("fs");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = `uploads/${req.user.id}`;

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        cb(null, dir);
    },

    filename: (req, file, cb) => {

            const category = req.body.category;

            const fileName =
                category + "-" + Date.now() + "-" + file.originalname;

            cb(null, fileName);
        }
});

const upload = multer({ storage });

module.exports = upload;