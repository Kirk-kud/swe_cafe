import React from "react";
import { Download } from "lucide-react";

export default function ShoppingCart() {
  return (
    <div className="w-full bg-black p-2">
      <div className="flex items-center justify-between bg-green-600 text-white rounded-md px-3 py-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center bg-white text-green-600 rounded-full h-6 w-6 font-bold text-sm">
            WG
          </div>
          <span className="font-medium">23 items</span>
        </div>
        <span className="font-medium">GBP 79.89</span>
        <button className="bg-transparent border-none p-0">
          <Download size={20} color="white" />
        </button>
      </div>
    </div>
  );
}