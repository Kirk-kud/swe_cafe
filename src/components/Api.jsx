// src/components/Api.jsx
import React, { useEffect, useState } from "react";

function Api() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api") // or "/api" if using Vite proxy
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  return (
    <div>
      <h2>{message || "Loading message from server..."}</h2>
    </div>
  );
}

export default Api;
