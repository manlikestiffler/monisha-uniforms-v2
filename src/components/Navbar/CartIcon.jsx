import React from 'react';
import { ShoppingBag, X } from 'lucide-react';

const CartIcon = () => {
  const cartItems = [
    {
      id: 1,
      name: "Boys' White Shirt",
      price: 599,
      quantity: 1,
      image: "https://placehold.co/100x100/fff/e2e8f0?text=Shirt"
    },
    {
      id: 2,
      name: "Girls' Pleated Skirt",
      price: 799,
      quantity: 2,
      image: "https://placehold.co/100x100/fff/e2e8f0?text=Skirt"
    }
  ];

  return (
    <div className="relative group">
      <button className="relative p-2 rounded-full hover:bg-primary-50 transition-colors">
        <ShoppingBag className="h-5 w-5 text-gray-600 group-hover:text-primary-600" />
        <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full bg-primary-600 text-white text-xs font-medium">
          3
        </span>
      </button>
      
      {/* Cart Preview */}
      <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible translate-y-2 
                    group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-900">Shopping Cart</h3>
            <span className="text-sm text-gray-500">3 items</span>
          </div>

          <div className="space-y-3">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg">
                <img src={item.image} alt={item.name} className="w-12 h-12 rounded-md object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.quantity} × ₹{item.price}</p>
                </div>
                <button className="p-1 hover:bg-gray-100 rounded-full">
                  <X className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500">Subtotal</span>
              <span className="text-sm font-medium text-gray-900">₹2,197</span>
            </div>
            
            <div className="space-y-2">
              <a 
                href="/cart"
                className="block w-full py-2 px-4 rounded-lg bg-primary-600 text-white text-center font-medium hover:bg-primary-700 transition-colors"
              >
                View Cart
              </a>
              <a 
                href="/checkout"
                className="block w-full py-2 px-4 rounded-lg bg-gray-900 text-white text-center font-medium hover:bg-gray-800 transition-colors"
              >
                Checkout
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartIcon; 