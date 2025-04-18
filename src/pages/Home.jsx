import React from "react";
import RestaurantCard from "../components/Restaurant_Card.jsx";
import testImage from "../assets/test.png";
import testImage2 from "../assets/test2.png";
import mainImage from "../assets/dinning.png";

const HomePage = () => {
  return (
    <div>
      <div className="px-8">
        <div className="w-full h-[80vh]">
          <div
            className="flex flex-col items-start justify-end h-full bg-black bg-opacity-50 text-white text-center px-4 rounded-2xl bg-cover bg-center rounded-2xl  mx-auto  px-8 pb-8 pt-40" 
            style={{backgroundImage: `url(${mainImage})`}}
          >
            <p className="mt-4 text-4xl content-end ">Welcome to AshesiEats</p>
            <p className="mt-4 text-6xl ">Crave it. Click it. Campus-delivered.</p>
          </div>
        </div>

        <div className="mt-10"></div>
        <p className="mb-5 font-bold text-3xl">Categories</p>
        <div className="flex flex-wrap justify-center gap-5">
          <RestaurantCard
            text="Steak and Mashed Potatoes"
            color="white"
            image={testImage}
          />
          <RestaurantCard text="Hallmark" color="white" image={testImage} />
          <RestaurantCard text="Hallmark" color="white" image={testImage} />
          <RestaurantCard text="Hallmark" color="white" image={testImage} />
        </div>
        <div className="mt-10"></div>
        <p className="mb-5 font-bold text-3xl">Restaurants</p>
        <div className="flex flex-wrap justify-center gap-5">
          <RestaurantCard
            text="Real Munchys"
            color="orange"
            image={testImage2}
          />
          <RestaurantCard text="Hallmark" color="white" image={testImage2} />
          <RestaurantCard text="Hallmark" color="white" image={testImage2} />
          <RestaurantCard text="Hallmark" color="white" image={testImage2} />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
