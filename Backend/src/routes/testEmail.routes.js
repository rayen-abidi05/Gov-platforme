const express = require("express");
const { sendEmail } = require("../services/emailService");

const router = express.Router();

router.get("/test-email", async (req, res) => {
  try {
    await sendEmail({
      to: process.env.SMTP_USER,
      subject: "Test Email - Olex-TN",
      html: `
        <h2>Olex-TN</h2>
        <p>Test email.</p>
      `,
    });

    res.json({
      success: true,
      message: "Email envoyé avec succès",
    });
  } catch (error) {
    console.error("EMAIL ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Échec de l'envoi de l'email",
      error: error.message,
    });
  }
});

module.exports = router;