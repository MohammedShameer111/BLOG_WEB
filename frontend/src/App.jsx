import { useEffect, useState } from "react";
import "./index.css"; // Import CSS file

function App() {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    fetch("https://blog-web-backend-uexw.onrender.com/api/location")
      .then((res) => res.json())
      .then((data) => setLocation(data.location))
      .catch(() => setLocation("unknown"));
  }, []);

  if (!location) return <div className="loader">Loading...</div>;

  return (
    <div className="container">
      <div className="content">
        {location === "india" ? (
          <h1 className="heading">🇮🇳 Welcome to the Indian Blog</h1>
        ) : location === "america" ? (
          <h1 className="heading">🇺🇸 Welcome to the American Blog</h1>
        ) : (
          <h1 className="heading">🌍 Welcome! Unable to determine your location.</h1>
        )}
      </div>
    </div>
  );
}

export default App;
