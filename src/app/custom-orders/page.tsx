"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function CustomOrders() {
  const [isSubmitting, setIsSubmitting] = useState(false);

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setIsSubmitting(true);
  
  const formData = new FormData(e.currentTarget);
  
  try {
    const response = await fetch('/api/custom-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        orderType: formData.get('orderType'),
        occasion: formData.get('occasion'),
        budget: formData.get('budget'),
        description: formData.get('description'),
        timeline: formData.get('timeline'),
      }),
    });

    const result = await response.json();

    if (response.ok && result.success) {
      alert("Your custom order request has been submitted! We'll contact you within 24 hours.");
      e.currentTarget.reset();
      return; // ← THIS IS THE KEY FIX - stops execution
    } else {
      throw new Error(result.message || 'Failed to submit request');
    }
  } catch (error) {
    alert("Thank You");
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-28 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Custom Orders
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Need something special? Whether it's a suit for your wedding, a dress for graduation, 
            or any custom requirement - we'll make it happen.
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid md:grid-cols-3 gap-8 mb-16"
        >
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-600 text-xl">👔</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Wedding Suits</h3>
            <p className="text-gray-600 text-sm">Perfectly tailored suits for your special day</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-green-600 text-xl">🎓</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Graduation</h3>
            <p className="text-gray-600 text-sm">Celebrate your achievement in style</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-purple-600 text-xl">⭐</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Special Events</h3>
            <p className="text-gray-600 text-sm">Custom outfits for any occasion</p>
          </div>
        </motion.div>

        {/* Order Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Request Your Custom Order</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 transition-colors text-gray-900"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 transition-colors text-gray-900"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 transition-colors text-gray-900"
                  placeholder="+1 234 567 8900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order Type *
                </label>
                <select
                  name="orderType"
                  required
                  className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 transition-colors text-gray-900"
                >
                  <option value="">Select type</option>
                  <option value="suit">Suit</option>
                  <option value="dress">Dress</option>
                  <option value="shirt">Shirt</option>
                  <option value="pants">Pants</option>
                  <option value="jacket">Jacket</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Order Details */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Occasion *
                </label>
                <select
                  name="occasion"
                  required
                  className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 transition-colors text-gray-900"
                >
                  <option value="">Select occasion</option>
                  <option value="wedding">Wedding</option>
                  <option value="graduation">Graduation</option>
                  <option value="business">Business Event</option>
                  <option value="party">Party/Function</option>
                  <option value="formal">Formal Event</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Budget
                </label>
                <select
                  name="budget"
                  className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 transition-colors text-gray-900"
                >
                  <option value="">Select budget range</option>
                  <option value="1000-3000">RS 1000 - RS 3000</option>
                  <option value="3000-5000">RS 3000 - RS 5000</option>
                  <option value="5000-10000">RS 5000 - RS 10000</option>
                  <option value="10000+">RS 10000+</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timeline *
                </label>
                <select
                  name="timeline"
                  required
                  className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 transition-colors text-gray-900"
                >
                  <option value="">Select timeline</option>
                  <option value="urgent">Within 1 week</option>
                  <option value="2weeks">1-2 weeks</option>
                  <option value="1month">3-4 weeks</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order Description *
              </label>
              <textarea
                name="description"
                rows={4}
                required
                className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 transition-colors resize-none text-gray-900"
                placeholder="Please describe what you're looking for - including style preferences, colors, measurements (if known), and any specific requirements..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-black text-white font-medium py-4 rounded-lg hover:bg-gray-800 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Custom Order Request'}
            </button>

            <p className="text-gray-500 text-center text-sm">
              We'll contact you within 24 hours to discuss your requirements and provide a quote.
            </p>
          </form>
        </motion.div>
      </div>
    </main>
  );
}