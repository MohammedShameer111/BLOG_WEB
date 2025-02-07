import express from "express";
import cors from "cors";
import geoip from "geoip-lite";

const app = express();

// ✅ Allow frontend requests
app.use(cors({ origin: "https://blog-website-pv7a.onrender.com" }));

app.get("/api/location", (req, res) => {
  try {
    // ✅ Get the user's IP from request headers
    const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;
    console.log("User IP:", ip);

    // ✅ Lookup location using geoip-lite
    const geo = geoip.lookup(ip);

    if (!geo || !geo.country) {
      return res.status(500).json({ location: "unknown", error: "GeoIP lookup failed" });
    }

    // ✅ Determine location based on country code
    const location = geo.country === "IN" ? "india" : geo.country === "US" ? "america" : "unknown";

    res.json({ location });
  } catch (error) {
    console.error("GeoIP Error:", error.message);
    res.status(500).json({ location: "unknown", error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
