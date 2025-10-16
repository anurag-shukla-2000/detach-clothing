'use client'
import { useCart } from '../context/CartContext'
import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/navigation';

interface TrialRoomProps {
  onClose: () => void
}

const TrialRoom = ({ onClose }: TrialRoomProps) => {
  const router = useRouter();
  const { cartItems, removeFromCart } = useCart()
  const [selectedTshirtIndex, setSelectedTshirtIndex] = useState(0)
  const [selectedDesignIndex, setSelectedDesignIndex] = useState(0)
  const [activeTab, setActiveTab] = useState<'tshirts' | 'preview' | 'designs'>('preview')

  // Filter items
  const tshirts = cartItems.filter(item => item.type === 'tshirt')
  const designs = cartItems.filter(item => item.type === 'design')

  const handleRemoveItem = (index: number, type: 'tshirt' | 'design') => {
    const cartIndex = cartItems.findIndex(item => 
      item.type === type && 
      (type === 'tshirt' 
        ? item.item.label === tshirts[index].item.label 
        : item.item.id === designs[index].item.id)
    )
    if (cartIndex !== -1) removeFromCart(cartIndex)
  }

  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
      {/* Main Container */}
      <div className="bg-white rounded-2xl w-full max-w-4xl flex flex-col shadow-2xl border border-gray-200">
        {/* Header with close button and actions */}
        <div className="border-b border-gray-200 p-5 flex flex-col gap-4 sticky top-0 bg-white z-10">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Your Trial Room</h2>
            <button 
              onClick={onClose}
              className="md:hidden text-gray-500 hover:text-black transition-colors p-1 rounded-full hover:bg-gray-200 ml-2"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Continue Shopping
            </button>
            <button 
              onClick={() => router.push('/cart')}
              className="px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition-colors"
              disabled={tshirts.length === 0 || designs.length === 0}
            >
              Proceed to Checkout
            </button>
            <button 
              onClick={onClose}
              className="hidden md:block text-gray-500 hover:text-black transition-colors p-1 rounded-full hover:bg-gray-200 ml-2"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Mobile Navigation Tabs */}
          <div className="md:hidden flex border-b border-gray-200 -mx-5 -mb-5">
            <button
              onClick={() => setActiveTab('tshirts')}
              className={`flex-1 py-3 text-center font-medium ${activeTab === 'tshirts' ? 'text-black border-b-2 border-black' : 'text-gray-500'}`}
            >
              T-Shirts ({tshirts.length})
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex-1 py-3 text-center font-medium ${activeTab === 'preview' ? 'text-black border-b-2 border-black' : 'text-gray-500'}`}
            >
              Preview
            </button>
            <button
              onClick={() => setActiveTab('designs')}
              className={`flex-1 py-3 text-center font-medium ${activeTab === 'designs' ? 'text-black border-b-2 border-black' : 'text-gray-500'}`}
            >
              Designs ({designs.length})
            </button>
          </div>
        </div>

        {/* Desktop Content Area */}
        <div className="hidden md:grid md:grid-cols-3 overflow-y-auto">
          {/* T-shirts Column */}
          <div className="border-r border-gray-200 p-5 h-[70vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="bg-black text-white rounded-full w-5 h-5 flex items-center justify-center mr-2 text-xs">
                {tshirts.length}
              </span>
              T-Shirts
            </h3>
            
            <div className="grid gap-4">
              {tshirts.length > 0 ? (
                tshirts.map((item, index) => (
                  <div 
                    key={index}
                    onClick={() => setSelectedTshirtIndex(index)}
                    className={`relative p-4 rounded-lg border transition-all cursor-pointer ${
                      selectedTshirtIndex === index 
                        ? 'border-black shadow-md' 
                        : 'border-gray-100 hover:border-gray-300'
                    }`}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemoveItem(index, 'tshirt')
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:scale-110 transition-transform"
                    >
                      ×
                    </button>
                    <div className="relative aspect-square w-full">
                      <Image
                        src={item.item.src}
                        alt={item.item.label}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="mt-2 text-center">
                      <p className="font-medium text-gray-900">{item.item.label}</p>
                      <p className="text-sm text-gray-700">Size: {item.size}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-gray-600">
                  No t-shirts added
                </div>
              )}
            </div>
          </div>

          {/* Preview Column */}
          <div className="border-r border-gray-200 p-5 flex flex-col">
            <h3 className="text-lg font-semibold text-black mb-4">Preview</h3>
            
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="relative w-full aspect-[3/4] bg-gray-50 rounded-lg shadow-inner overflow-hidden">
                {tshirts.length > 0 ? (
                  <>
                    {/* T-shirt Base */}
                    <div className="absolute inset-0 p-4">
                      <Image
                        src={tshirts[selectedTshirtIndex].item.src}
                        alt="Selected t-shirt"
                        fill
                        className="object-contain"
                        style={{ objectPosition: 'center 30%' }}
                      />
                    </div>
                    
                    {/* Design Overlay */}
                    {designs.length > 0 && (
                      <div className="absolute inset-0">
                        <div className="absolute" style={{
                          top: '45%',
                          left: '50%',
                          width: '40%',
                          aspectRatio: '1/1',
                          transform: 'translate(-50%, -50%) scale(1.25)'
                        }}>
                          <Image
                            src={designs[selectedDesignIndex].item.src}
                            alt="Selected design"
                            fill
                            className="object-contain drop-shadow-lg"
                          />
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    Select items to preview
                  </div>
                )}
              </div>

              {/* Combination Details */}
              {tshirts.length > 0 && designs.length > 0 && (
                <div className="mt-6 text-center">
                  <p className="font-bold text-black">
                    {tshirts[selectedTshirtIndex].item.label} + Design #{designs[selectedDesignIndex].item.id}
                  </p>
                  <p className="text-black mt-1">
                    ₹{designs[selectedDesignIndex].item.price + tshirts[selectedTshirtIndex].item.price}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Designs Column */}
          <div className="p-5 h-[70vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-black mb-4 flex items-center">
              <span className="bg-black text-white rounded-full w-5 h-5 flex items-center justify-center mr-2 text-xs">
                {designs.length}
              </span>
              Designs
            </h3>
            
            <div className="grid gap-4">
              {designs.length > 0 ? (
                designs.map((item, index) => (
                  <div 
                    key={index}
                    onClick={() => setSelectedDesignIndex(index)}
                    className={`relative p-4 rounded-lg border transition-all cursor-pointer ${
                      selectedDesignIndex === index 
                        ? 'border-black shadow-md' 
                        : 'border-gray-100 hover:border-gray-300'
                    }`}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemoveItem(index, 'design')
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:scale-110 transition-transform"
                    >
                      ×
                    </button>
                    <div className="relative aspect-square min-h-[200px] w-full">
                      <Image
                        src={item.item.src}
                        alt={`Design ${item.item.id}`}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="mt-2 text-center">
                      <p className="text-base font-medium text-black">Design #{item.item.id}</p>
                      <p className="text-sm text-black">A3 Size</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-gray-600">
                  No designs added
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Content Area */}
        <div className="md:hidden">
          {/* T-shirts Panel */}
          {activeTab === 'tshirts' && (
            <div className="p-5 h-[calc(100vh-220px)] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                {tshirts.length > 0 ? (
                  tshirts.map((item, index) => (
                    <div 
                      key={index}
                      onClick={() => {
                        setSelectedTshirtIndex(index)
                        setActiveTab('preview')
                      }}
                      className={`relative p-4 rounded-lg border transition-all cursor-pointer ${
                        selectedTshirtIndex === index 
                          ? 'border-black shadow-md' 
                          : 'border-gray-100 hover:border-gray-300'
                      }`}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRemoveItem(index, 'tshirt')
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:scale-110 transition-transform"
                      >
                        ×
                      </button>
                      <div className="relative aspect-square w-full">
                        <Image
                          src={item.item.src}
                          alt={item.item.label}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div className="mt-2 text-center">
                        <p className="font-medium text-sm text-gray-900 truncate">{item.item.label}</p>
                        <p className="text-xs text-gray-700">Size: {item.size}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-10 text-gray-600">
                    No t-shirts added
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Preview Panel */}
          {activeTab === 'preview' && (
            <div className="p-5 h-[calc(100vh-220px)] flex flex-col items-center overflow-y-auto">
              <div className="relative w-full max-w-xs aspect-[3/4] bg-gray-50 rounded-lg shadow-inner overflow-hidden">
                {tshirts.length > 0 ? (
                  <>
                    {/* T-shirt Base */}
                    <div className="absolute inset-0 p-4">
                      <Image
                        src={tshirts[selectedTshirtIndex].item.src}
                        alt="Selected t-shirt"
                        fill
                        className="object-contain"
                        style={{ objectPosition: 'center 30%' }}
                      />
                    </div>
                    
                    {/* Design Overlay */}
                    {designs.length > 0 && (
                      <div className="absolute inset-0">
                        <div className="absolute" style={{
                          top: '45%',
                          left: '50%',
                          width: '40%',
                          aspectRatio: '1/1',
                          transform: 'translate(-50%, -50%) scale(1.25)'
                        }}>
                          <Image
                            src={designs[selectedDesignIndex].item.src}
                            alt="Selected design"
                            fill
                            className="object-contain drop-shadow-lg"
                          />
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    Select items to preview
                  </div>
                )}
              </div>

              {tshirts.length > 0 && designs.length > 0 && (
                <div className="mt-6 text-center w-full">
                  <p className="font-bold text-black">
                    {tshirts[selectedTshirtIndex].item.label} + Design #{designs[selectedDesignIndex].item.id}
                  </p>
                  <p className="text-black mt-1 text-lg font-semibold">
                    ₹{designs[selectedDesignIndex].item.price + tshirts[selectedTshirtIndex].item.price}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Designs Panel */}
          {activeTab === 'designs' && (
            <div className="p-5 h-[calc(100vh-220px)] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                {designs.length > 0 ? (
                  designs.map((item, index) => (
                    <div 
                      key={index}
                      onClick={() => {
                        setSelectedDesignIndex(index)
                        setActiveTab('preview')
                      }}
                      className={`relative p-4 rounded-lg border transition-all cursor-pointer ${
                        selectedDesignIndex === index 
                          ? 'border-black shadow-md' 
                          : 'border-gray-100 hover:border-gray-300'
                      }`}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRemoveItem(index, 'design')
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:scale-110 transition-transform"
                      >
                        ×
                      </button>
                      <div className="relative aspect-square min-h-[150px] w-full">
                        <Image
                          src={item.item.src}
                          alt={`Design ${item.item.id}`}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div className="mt-2 text-center">
                        <p className="text-sm font-medium text-black truncate">Design #{item.item.id}</p>
                        <p className="text-xs text-black">A3 Size</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-10 text-gray-600">
                    No designs added
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TrialRoom