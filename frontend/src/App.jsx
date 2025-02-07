import { useEffect, useState } from "react";

function App() {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    fetch("https://blog-web-backend-uexw.onrender.com/api/location") // Use deployed backend URL
      .then((res) => res.json())
      .then((data) => setLocation(data.location))
      .catch(() => setLocation("unknown"));
  }, []);

  if (!location) return <p>Loading...</p>;

  return (
    <div>
      {location === "india" ? (
        <h1>🇮🇳 Welcome to the Indian Blog</h1>
      ) : location === "america" ? (
        <h1>🇺🇸 Welcome to the American Blog</h1>
      ) : (
        <h1>🌍 Welcome! Unable to determine your location.</h1>
      )}
    </div>
  );
}

export default App;
