import React from "react";
import FoodCard from "../components/Food_Card";
import testImage2 from "../assets/test2.png";
import MenuBar from "../components/MenuBar";
import ShoppingBasket from "../components/ShoppingBasket";
import Search from "../components/Search";
import RestaurantInfoCard from "../components/RestaurantInfoCard";

const RestaurantProfiles = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">Order from Akornor</h1>
          </div>
          <div className="w-64">
            <Search />
          </div>
        </div>
        
        <div className="flex gap-6">
          <div className="w-64">
            <MenuBar />
          </div>

          <div className="flex-1">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Pizzas</h2>
              <div className="space-y-4">
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
            </div>
          </div>

          <div className="w-64">
            <ShoppingBasket />
          </div>
        </div>

        <div className="mt-8">
          <RestaurantInfoCard />
        </div>
      </div>
    </div>
  );
};

export default RestaurantProfiles;
