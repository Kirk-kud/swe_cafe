import React from "react";
import Navbar from "./components/Navbar";
import Heading from "./components/heading"

function App() {
  return (
    <div>
      <Heading />
      <Navbar />
      <div className="p-8">
        <h1 className="text-4xl font-bold">Welcome to MyApp</h1>
        {/* Other content goes here */}
      </div>
    </div>
  );
}

export default App;
