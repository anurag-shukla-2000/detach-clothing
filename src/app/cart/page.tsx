'use client';
import { useCart } from '../context/CartContext';
import Link from 'next/link';
import Image from 'next/image';

export default function CartPage() {
  const { cartItems, removeFromCart } = useCart();
  
  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Cart</h1>
        
        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">Your cart is empty</p>
            <Link href="/" className="text-blue-600 hover:underline">
              Continue shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-200">
              {cartItems.map((item, index) => (
                <div key={index} className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center">
                    <div className="w-16 h-16 relative">
                      <Image
                        src={item.item.src}
                        alt={item.type === 'tshirt' ? item.item.label : `Design ${item.item.id}`}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium text-gray-900">
                        {item.type === 'tshirt' ? `${item.item.label} T-shirt` : `Design #${item.item.id}`}
                      </h3>
                      {item.size && <p className="text-gray-600">Size: {item.size}</p>}
                      <p className="text-gray-900 font-medium">₹{item.price}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => removeFromCart(index)}
                    className="text-red-500 hover:text-red-700 px-4 py-2 border border-red-200 rounded-md"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            
            <div className="mt-6 border-t border-gray-200 pt-6">
              <div className="flex justify-between items-center">
                <span className="text-black font-bold">Total:</span>
                <span className="text-black font-bold">₹{total}</span>
              </div>
              <button className="mt-6 w-full bg-black text-white py-3 px-4 rounded-md hover:bg-gray-800 transition">
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}