import React from "react";

const Navbar = () => {
  return (
    <nav>
      <header
        className="flex justify-between items-center text-black py-6 px-8
        md:px-32 bg-blue"
      >
        <a href="" className="w-52 hover:scale-105 transition-all">
          AshesiEats
        </a>

        <ul className="flex items-center gap-12 font-semibold text-base">
          <li className="p-3 hover:bg-sky-400 rounded-md transition-all cursor-pointer">
            Home
          </li>
          <li className="p-3 hover:bg-sky-400 rounded-md transition-all cursor-pointer">
            Special Offers
          </li>
          <li className="p-3 hover:bg-sky-400 rounded-md transition-all cursor-pointer">
            Restaurants
          </li>

         
        </ul>
      </header>
    </nav>
  );
};

export default Navbar;
