import React from "react";
import HomePage from "./pages/Home.jsx";
import Navbar from "./components/Navbar.jsx";
import Heading from "./components/heading.jsx";
import Footer from "./components/Footer.jsx";
import RestaurantProfiles from "./pages/RestaurantProfiles.jsx";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <Router>
      <div>
        <header>
          <Heading />
          <Navbar />
        </header>
        <main>
          <Routes>
            <Route exact path="/" element={<HomePage />}></Route>
            <Route
              exact
              path="/RestaurantProfiles"
              element={<RestaurantProfiles />}
            ></Route>
          </Routes>
        </main>
        <footer>
          <Footer />
        </footer>
      </div>
    </Router>
  );
}

export default App;
