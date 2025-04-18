import React from "react";
import FoodCard from "../components/Food_Card";
import testImage2 from "../assets/test2.png";
import MenuBar from "../components/MenuBar";
import ShoppingBasket from "../components/ShoppingBasket";
import Search from "../components/Search";
import RestaurantInfoCard from "../components/RestaurantInfoCard";

const RestaurantProfiles = () => {
  return (
    <div>
      <div className="flex justify-between mt-5">
        <div className="ml-5">
          <p>Order from Akornor</p>
        </div>
        <div className="mr-5">
          <Search />
        </div>
      </div>
      <div className="flex p-4 mt-5">
        <div className="w-[300px]">
          <MenuBar />
        </div>

        <div className="ml-15 w-full max-w-[600px] flex flex-col gap-3">
          <p>Pizzas</p>
          <FoodCard
            title="Hallmark"
            text="Delicious spicy rice with chicken"
            image={testImage2}
          />
          <FoodCard
            title="Hallmark"
            text="Delicious spicy rice with chicken"
            image={testImage2}
          />
        </div>

        <div className="w-[300px]">
          <ShoppingBasket />
        </div>
      </div>

      <div className="flex items-center justify-center mt-5">
        <RestaurantInfoCard />
      </div>
    </div>
  );
};

export default RestaurantProfiles;
