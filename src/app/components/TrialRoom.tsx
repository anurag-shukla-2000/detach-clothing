'use client'
import { useCart } from '../context/CartContext'
import Image from 'next/image'
import { useState, useMemo, useCallback } from 'react'
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

  // Memoized filtered items for better performance
  const { tshirts, designs } = useMemo(() => ({
    tshirts: cartItems.filter(item => item.type === 'tshirt'),
    designs: cartItems.filter(item => item.type === 'design')
  }), [cartItems])

  // Memoized current selections
  const currentTshirt = useMemo(() => 
    tshirts[selectedTshirtIndex], [tshirts, selectedTshirtIndex]
  )
  const currentDesign = useMemo(() => 
    designs[selectedDesignIndex], [designs, selectedDesignIndex]
  )

  // Optimized remove handler
  const handleRemoveItem = useCallback((index: number, type: 'tshirt' | 'design') => {
    const items = type === 'tshirt' ? tshirts : designs;
    const cartIndex = cartItems.findIndex(item => 
      item.type === type && 
      (type === 'tshirt' 
        ? item.item.label === items[index].item.label 
        : item.item.id === items[index].item.id)
    )
    if (cartIndex !== -1) {
      removeFromCart(cartIndex)
      // Reset selections if current item is removed
      if (type === 'tshirt' && index === selectedTshirtIndex && tshirts.length > 1) {
        setSelectedTshirtIndex(Math.max(0, index - 1))
      }
      if (type === 'design' && index === selectedDesignIndex && designs.length > 1) {
        setSelectedDesignIndex(Math.max(0, index - 1))
      }
    }
  }, [tshirts, designs, cartItems, removeFromCart, selectedTshirtIndex, selectedDesignIndex])

  // Navigation handlers
  const navigateToPreview = useCallback((type: 'tshirt' | 'design', index: number) => {
    if (type === 'tshirt') setSelectedTshirtIndex(index)
    if (type === 'design') setSelectedDesignIndex(index)
    setActiveTab('preview')
  }, [])

  const canCheckout = tshirts.length > 0 && designs.length > 0
  const totalPrice = currentTshirt && currentDesign ? currentTshirt.item.price + currentDesign.item.price : 0

  return (
    <div 
      className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Main Container - Stop propagation to prevent closing when clicking inside */}
      <div 
        className="bg-white rounded-2xl w-full max-w-6xl flex flex-col shadow-2xl border border-gray-200 max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header - Fixed height, no shrink */}
        <div className="border-b border-gray-200 p-6 flex-shrink-0">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Your Trial Room</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-black transition-colors p-2 rounded-full hover:bg-gray-200"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors font-medium"
            >
              Continue Shopping
            </button>
            <button 
              onClick={() => router.push('/cart')}
              className={`flex-1 px-6 py-3 rounded-lg transition-colors font-medium ${
                canCheckout 
                  ? 'bg-black text-white hover:bg-gray-800' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              disabled={!canCheckout}
            >
              Proceed to Checkout
            </button>
          </div>

          {/* Mobile Navigation Tabs */}
          <div className="md:hidden flex border-b border-gray-200 -mx-6 mt-4">
            {[
              { key: 'tshirts', label: `T-Shirts (${tshirts.length})` },
              { key: 'preview', label: 'Preview' },
              { key: 'designs', label: `Designs (${designs.length})` }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={`flex-1 py-4 text-center font-medium transition-colors ${
                  activeTab === key ? 'text-black border-b-2 border-black' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area - This will scroll */}
        <div className="flex-1 min-h-0">
          {/* Desktop Layout */}
          <div className="hidden md:grid md:grid-cols-3 h-full">
            {/* T-shirts Column */}
            <div className="border-r border-gray-200 overflow-hidden">
              <div className="p-6 h-full flex flex-col">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="bg-black text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 text-sm">
                    {tshirts.length}
                  </span>
                  T-Shirts
                </h3>
                <div className="flex-1 overflow-y-auto">
                  <div className="grid gap-4 pb-4">
                    {tshirts.length > 0 ? tshirts.map((item: any, index: number) => (
                      <ItemCard
                        key={`tshirt-${item.item.label}-${index}`}
                        item={item}
                        isSelected={selectedTshirtIndex === index}
                        onSelect={() => setSelectedTshirtIndex(index)}
                        onRemove={() => handleRemoveItem(index, 'tshirt')}
                        type="tshirt"
                      />
                    )) : (
                      <EmptyState message="No t-shirts added" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Preview Column */}
            <div className="border-r border-gray-200 overflow-hidden">
              <div className="p-6 h-full flex flex-col">
                <h3 className="text-lg font-semibold text-black mb-4">Preview</h3>
                <div className="flex-1 flex flex-col items-center justify-center">
                  <PreviewImage tshirt={currentTshirt} design={currentDesign} />
                  {currentTshirt && currentDesign && (
                    <div className="mt-6 text-center">
                      <p className="font-bold text-black text-lg">
                        {currentTshirt.item.label} + Design #{currentDesign.item.id}
                      </p>
                      <p className="text-black mt-2 text-xl font-semibold">₹{totalPrice}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Designs Column */}
            <div className="overflow-hidden">
              <div className="p-6 h-full flex flex-col">
                <h3 className="text-lg font-semibold text-black mb-4 flex items-center">
                  <span className="bg-black text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 text-sm">
                    {designs.length}
                  </span>
                  Designs
                </h3>
                <div className="flex-1 overflow-y-auto">
                  <div className="grid gap-4 pb-4">
                    {designs.length > 0 ? designs.map((item: any, index: number) => (
                      <ItemCard
                        key={`design-${item.item.id}-${index}`}
                        item={item}
                        isSelected={selectedDesignIndex === index}
                        onSelect={() => setSelectedDesignIndex(index)}
                        onRemove={() => handleRemoveItem(index, 'design')}
                        type="design"
                      />
                    )) : (
                      <EmptyState message="No designs added" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden h-full">
            <div className="h-full overflow-y-auto">
              {activeTab === 'tshirts' && (
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-4">
                    {tshirts.length > 0 ? tshirts.map((item: any, index: number) => (
                      <ItemCard
                        key={`mobile-tshirt-${item.item.label}-${index}`}
                        item={item}
                        isSelected={selectedTshirtIndex === index}
                        onSelect={(index: number) => navigateToPreview('tshirt', index)}
                        onRemove={() => handleRemoveItem(index, 'tshirt')}
                        type="tshirt"
                        mobile
                      />
                    )) : (
                      <div className="col-span-2">
                        <EmptyState message="No t-shirts added" />
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {activeTab === 'preview' && (
                <div className="p-6 flex flex-col items-center">
                  <div className="w-full max-w-sm">
                    <PreviewImage tshirt={currentTshirt} design={currentDesign} />
                  </div>
                  {currentTshirt && currentDesign && (
                    <div className="mt-6 text-center w-full">
                      <p className="font-bold text-black text-lg">
                        {currentTshirt.item.label} + Design #{currentDesign.item.id}
                      </p>
                      <p className="text-black mt-2 text-xl font-semibold">₹{totalPrice}</p>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'designs' && (
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-4">
                    {designs.length > 0 ? designs.map((item: any, index: number) => (
                      <ItemCard
                        key={`mobile-design-${item.item.id}-${index}`}
                        item={item}
                        isSelected={selectedDesignIndex === index}
                        onSelect={(index: number) => navigateToPreview('design', index)}
                        onRemove={() => handleRemoveItem(index, 'design')}
                        type="design"
                        mobile
                      />
                    )) : (
                      <div className="col-span-2">
                        <EmptyState message="No designs added" />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Shared Components
const ItemCard = ({ item, isSelected, onSelect, onRemove, type, mobile = false }: any) => (
  <div 
    onClick={() => onSelect()}
    className={`relative p-4 rounded-xl border-2 transition-all cursor-pointer bg-white group ${
      isSelected 
        ? 'border-black shadow-lg scale-[1.02]' 
        : 'border-gray-200 hover:border-gray-400 hover:shadow-md'
    } ${mobile ? '' : 'hover:scale-[1.02] active:scale-[0.98]'}`}
  >
    <button
      onClick={(e) => {
        e.stopPropagation()
        onRemove()
      }}
      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:scale-110 hover:bg-red-600 transition-all duration-200 z-10 shadow-md opacity-0 group-hover:opacity-100 focus:opacity-100"
      aria-label={`Remove ${type === 'tshirt' ? item.item.label : `Design ${item.item.id}`}`}
    >
      ×
    </button>
    <div className={`relative aspect-square w-full ${mobile ? 'min-h-[120px]' : 'min-h-[160px]'}`}>
      <Image
        src={item.item.src}
        alt={type === 'tshirt' ? item.item.label : `Design ${item.item.id}`}
        fill
        className="object-contain transition-transform duration-200"
        sizes={mobile ? "(max-width: 768px) 50vw, 33vw" : "33vw"}
      />
    </div>
    <div className="mt-3 text-center">
      <p className={`font-semibold text-gray-900 truncate ${mobile ? 'text-sm' : 'text-base'}`}>
        {type === 'tshirt' ? item.item.label : `Design #${item.item.id}`}
      </p>
      <p className={`text-gray-600 mt-1 ${mobile ? 'text-xs' : 'text-sm'}`}>
        {type === 'tshirt' ? `Size: ${item.size}` : 'Velcro Patch'}
      </p>
      <p className={`text-black font-semibold mt-2 ${mobile ? 'text-sm' : 'text-base'}`}>
        ₹{item.item.price}
      </p>
    </div>
  </div>
)

const PreviewImage = ({ tshirt, design }: any) => (
  <div className="relative w-full aspect-[3/4] bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-inner overflow-hidden border-2 border-gray-200">
    {tshirt ? (
      <>
        <div className="absolute inset-0 p-6">
          <Image
            src={tshirt.item.src}
            alt="Selected t-shirt"
            fill
            className="object-contain transition-transform duration-500"
            style={{ objectPosition: 'center 30%' }}
            sizes="(max-width: 768px) 80vw, 33vw"
          />
        </div>
        
        {design && (
          <div className="absolute inset-0">
            <div className="absolute" style={{
              top: '45%',
              left: '50%',
              width: '35%',
              aspectRatio: '1/1',
              transform: 'translate(-50%, -50%) scale(1.3)'
            }}>
              <Image
                src={design.item.src}
                alt="Selected design"
                fill
                className="object-contain drop-shadow-2xl transition-transform duration-500"
                sizes="(max-width: 768px) 40vw, 20vw"
              />
            </div>
          </div>
        )}
      </>
    ) : (
      <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
        <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        <p className="text-lg font-medium">Select items to preview</p>
        <p className="text-sm mt-2">Choose a t-shirt and design combination</p>
      </div>
    )}
  </div>
)

const EmptyState = ({ message }: { message: string }) => (
  <div className="text-center py-12 text-gray-500">
    <div className="max-w-xs mx-auto">
      <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center">
        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2" />
        </svg>
      </div>
      <p className="text-lg font-medium mb-2">Nothing here yet</p>
      <p className="text-gray-600">{message}</p>
    </div>
  </div>
)

export default TrialRoom