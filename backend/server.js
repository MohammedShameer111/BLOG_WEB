import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());

app.get("/api/location", async (req, res) => {
  try {
    // Step 1: Get the user's public IP
    const ipResponse = await fetch("https://api64.ipify.org?format=json");
    const ipData = await ipResponse.json();
    const publicIp = ipData.ip; // Extract public IP

    console.log("User's Public IP:", publicIp); // Debugging

    // Step 2: Fetch location data from FindIP API
    const apiUrl = `https://api.findip.net/${publicIp}/?token=${process.env.FINDIP_API_KEY}`;
    console.log("Fetching location from:", apiUrl);

    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!data || !data.country || !data.country.iso_code) {
      console.error("Error: Invalid response from FindIP", data);
      return res.status(500).json({ location: "unknown", error: "Invalid response from FindIP" });
    }

    // ✅ Extract country code from correct location in response
    const countryCode = data.country.iso_code;
    const location = countryCode === "IN" ? "india" : countryCode === "US" ? "america" : "unknown";

    res.status(200).json({ location });
  } catch (error) {
    console.error("Server Error:", error.message);
    res.status(500).json({ location: "unknown", error: error.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
