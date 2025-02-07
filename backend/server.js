import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// ✅ Allow requests from your frontend
app.use(cors({ origin: "https://blog-website-pv7a.onrender.com" }));

app.get("/api/location", async (req, res) => {
  try {
    // ✅ Extract user IP properly (works on Render & similar services)
    const publicIp = req.headers["x-forwarded-for"]?.split(",")[0] || req.ip;
    console.log("User's Public IP:", publicIp);

    if (!publicIp || publicIp === "127.0.0.1") {
      return res.status(500).json({ location: "unknown", error: "Invalid IP detected" });
    }

    // ✅ Fetch location from FindIP API
    const apiUrl = `https://api.findip.net/${publicIp}/?token=${process.env.FINDIP_API_KEY}`;
    console.log("Fetching location from:", apiUrl);

    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!data || !data.country || !data.country.iso_code) {
      console.error("Error: Invalid response from FindIP", data);
      return res.status(500).json({ location: "unknown", error: "Invalid response from FindIP" });
    }

    // ✅ Determine location based on country code
    const countryCode = data.country.iso_code;
    const location = countryCode === "IN" ? "india" : countryCode === "US" ? "america" : "unknown";

    res.status(200).json({ location });
  } catch (error) {
    console.error("Server Error:", error.message);
    res.status(500).json({ location: "unknown", error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
