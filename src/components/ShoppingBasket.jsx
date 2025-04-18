import React from "react";

const ShoppingBasket = () => {
  const basketItems = [
    { id: 1, name: "12\" Vegetarian Pizza", description: "No Mushrooms + green peppers", quantity: 1, price: 27.90 },
    { id: 2, name: "17\" Tandoori Pizza", description: "No Mushrooms + green peppers", quantity: 1, price: 17.90 },
    { id: 3, name: "Coke Coca Cola", description: "", quantity: 2, price: 4.90 },
    { id: 4, name: "12\" Vegetarian Pizza", description: "No Mushrooms + green peppers", quantity: 1, price: 27.90 }
  ];

  const subtotal = 127.90;
  const discount = -3.00;
  const deliveryFee = 2.50;
  const total = 127.90;

  return (
    <div className="w-[300px] overflow-y-auto shadow-lg bg-white rounded">
      <div className="bg-green-600 p-3 text-white">
        <div className="flex items-center">
          <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 4h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 14c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
          </svg>
          <h1 className="text-lg font-bold">My Basket</h1>
        </div>
      </div>

      {/* Items list */}
      <div className="px-3 py-2">
        {basketItems.map((item) => (
          <div key={item.id} className="flex items-center mb-3 border-b pb-2">
            <div className="flex items-center justify-center w-8 h-8 bg-orange-500 text-white rounded-full mr-2">
              <span className="text-xs">{item.quantity}x</span>
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm">{item.name}</p>
              <p className="text-xs text-gray-600">{item.description}</p>
            </div>
            <div className="text-sm font-bold">£{item.price.toFixed(2)}</div>
            <div className="ml-2 w-6 h-6 bg-gray-200 flex items-center justify-center rounded text-gray-500 text-xs">
              ×
            </div>
          </div>
        ))}
      </div>

      <div className="px-3 py-2 border-t">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium">Sub Total:</span>
          <span className="text-sm font-medium">£{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-3">
          <span className="text-sm">Delivery Fee:</span>
          <span className="text-sm">£{deliveryFee.toFixed(2)}</span>
        </div>
      </div>

      {/* Total */}
      <div className="px-3 py-3 bg-orange-400 text-white flex justify-between items-center">
        <span className="font-medium">Total to pay</span>
        <span className="text-xl font-bold">£{total}</span>
      </div>

      

      {/* Delivery options */}
      <div className="px-3 py-2 grid grid-cols-2 gap-2">
        <div className="border rounded p-2 text-center">
          <div className="flex justify-center">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </div>
          <div className="text-xs mt-1">Delivery</div>
          <div className="text-xs text-gray-500">starts at £1.50</div>
        </div>
        <div className="border rounded p-2 text-center">
          <div className="flex justify-center">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div className="text-xs mt-1">Collection</div>
          <div className="text-xs text-gray-500">starts at £0.50</div>
        </div>
      </div>

      <div className="px-3 py-2">
        <button className="w-full bg-green-600 text-white py-2 rounded font-medium">
          Checkout!
        </button>
      </div>

      {/* Store status */}
      <div className="px-3 py-3 bg-navy-900 text-white text-xs text-center">
        <p>We are open now, but delivery starts at <span className="text-orange-400">16:30</span> however you may order and collect in store now</p>
      </div>
    </div>
  );
};

export default ShoppingBasket;