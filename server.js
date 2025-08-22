import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { Resend } from "resend";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const resend = new Resend(process.env.RESEND_API_KEY);

app.post("/api/send-email", async (req, res) => {
  const { name, contact, email, travellers } = req.body;

  if (!name || !contact || !email || !travellers) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const result = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "krishnaprasad24795@gmail.com",
      subject: "New Travel Enquiry Form Submission",
      html: `
        <h2>✈️ New Travel Enquiry</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Contact No:</strong> ${contact}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Travellers:</strong> ${travellers}</p>
      `,
    });

    res.json({ message: "✅ Email sent successfully!", result });
  } catch (error) {
    console.error("❌ Failed to send email:", error);
    res.status(500).json({ message: "Failed to send email", error });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
