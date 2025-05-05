import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import "../../../App.css"
import './myitems.css'

export default function MyItems({ MyfilteredItems }) {
  const [selectedItem, setSelectedItem] = useState(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [activeTab, setActiveTab] = useState('upi')
  const [paymentStatus, setPaymentStatus] = useState('pending') // pending, processing, completed

  const handlePayNow = (item) => {
    setSelectedItem(item)
    setShowPaymentModal(true)
    setPaymentStatus('pending')
  }

  const closeModal = () => {
    setShowPaymentModal(false)
    setTimeout(() => {
      setPaymentStatus('pending')
    }, 300)
  }

  const simulatePayment = () => {
    setPaymentStatus('processing')
    // Simulate payment processing
    setTimeout(() => {
      setPaymentStatus('completed')
    }, 2000)
  }

  return (
    <>
      <div className='user-myitems-div-container'>
        {MyfilteredItems.map(item => (
          <div key={item.id} className="user-myitems-div-item">
            <img
              src={item.url || "/placeholder.svg"}
              alt={item.name}
              className="user-myitems-div-image"
            />
            <div className="user-myitems-div-content">
              <h3 className="user-myitems-div-title">{item.name}</h3>
              <div className="user-myitems-div-details">
                <span className="user-myitems-div-owner">Owner: {item.person}</span>
                <span className="user-myitems-div-base-price">Base Price:₹{item.base_price}</span>
              </div>
              <div className="user-myitems-div-current-price">
                <span className="user-myitems-div-brought-price">Brought Price: ₹{item.current_price}</span>
              </div>
              <button 
                onClick={() => handlePayNow(item)}
                className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors duration-200"
              >
                Pay Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Make Payment</h3>
                <button 
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Pay ₹{selectedItem?.current_price} for {selectedItem?.name}
              </p>
            </div>

            {/* Tabs */}
            <div className="border-b">
              <div className="flex">
                <button
                  className={`flex-1 py-3 text-center font-medium ${activeTab === 'upi' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                  onClick={() => setActiveTab('upi')}
                >
                  UPI
                </button>
                <button
                  className={`flex-1 py-3 text-center font-medium ${activeTab === 'qrcode' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                  onClick={() => setActiveTab('qrcode')}
                >
                  QR Code
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-4">
              {activeTab === 'upi' && (
                <div>
                  {paymentStatus === 'pending' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                        <div>
                          <p className="font-medium">Item:</p>
                          <p>{selectedItem?.name}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">Amount:</p>
                          <p className="text-blue-600 font-bold">₹{selectedItem?.current_price}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Enter your UPI ID</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="yourname@upi"
                            className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <button 
                            onClick={simulatePayment}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                          >
                            Verify
                          </button>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-4 gap-2">
                        <div className="flex flex-col items-center p-2 border rounded-md hover:bg-gray-50 cursor-pointer">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-1">
                            <span className="text-green-600 text-xs font-bold">GPay</span>
                          </div>
                          <span className="text-xs">Google Pay</span>
                        </div>
                        <div className="flex flex-col items-center p-2 border rounded-md hover:bg-gray-50 cursor-pointer">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-1">
                            <span className="text-blue-600 text-xs font-bold">PhPe</span>
                          </div>
                          <span className="text-xs">PhonePe</span>
                        </div>
                        <div className="flex flex-col items-center p-2 border rounded-md hover:bg-gray-50 cursor-pointer">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mb-1">
                            <span className="text-purple-600 text-xs font-bold">Paytm</span>
                          </div>
                          <span className="text-xs">Paytm</span>
                        </div>
                        <div className="flex flex-col items-center p-2 border rounded-md hover:bg-gray-50 cursor-pointer">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-1">
                            <span className="text-gray-600 text-xs font-bold">More</span>
                          </div>
                          <span className="text-xs">Others</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentStatus === 'processing' && (
                    <div className="py-8 text-center">
                      <div className="flex flex-col items-center">
                        <div className="h-12 w-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                        <p>Processing your payment...</p>
                        <p className="text-sm text-gray-500 mt-2">Please do not close this window</p>
                      </div>
                    </div>
                  )}

                  {paymentStatus === 'completed' && (
                    <div className="py-6 text-center space-y-4">
                      <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-lg font-medium">Payment Successful!</p>
                        <p className="text-sm text-gray-500">
                          Transaction ID: TXN{Math.random().toString(36).substring(2, 10).toUpperCase()}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Amount: ₹{selectedItem?.current_price}
                        </p>
                      </div>
                      <button 
                        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
                        onClick={closeModal}
                      >
                        Done
                      </button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'qrcode' && (
                <div className="flex flex-col items-center justify-center py-4">
                  <div className="bg-white p-4 rounded-lg border mb-4">
                    <div className="h-48 w-48 relative bg-gray-100 flex items-center justify-center">
                      {/* QR Code Placeholder */}
                      <div className="grid grid-cols-5 grid-rows-5 gap-1 h-40 w-40">
                        <div className="col-span-1 row-span-1 bg-black"></div>
                        <div className="col-span-3"></div>
                        <div className="col-span-1 row-span-1 bg-black"></div>
                        
                        <div className="col-span-1"></div>
                        <div className="col-span-3 row-span-3 grid grid-cols-3 grid-rows-3 gap-1">
                          <div className="col-span-1 row-span-1 bg-black"></div>
                          <div className="col-span-1 row-span-1 bg-black"></div>
                          <div className="col-span-1 row-span-1 bg-black"></div>
                          <div className="col-span-1 row-span-1 bg-black"></div>
                          <div className="col-span-1 row-span-1 bg-black"></div>
                          <div className="col-span-1 row-span-1 bg-black"></div>
                          <div className="col-span-1 row-span-1 bg-black"></div>
                          <div className="col-span-1 row-span-1 bg-black"></div>
                          <div className="col-span-1 row-span-1 bg-black"></div>
                        </div>
                        <div className="col-span-1"></div>
                        
                        <div className="col-span-1 row-span-1 bg-black"></div>
                        <div className="col-span-3"></div>
                        <div className="col-span-1 row-span-1 bg-black"></div>
                      </div>
                    </div>
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-sm text-gray-500">Scan with any UPI app to pay</p>
                    <p className="font-medium">Amount: ₹{selectedItem?.current_price}</p>
                    <button 
                      className="mt-2 border border-blue-600 text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-md"
                      onClick={simulatePayment}
                    >
                      I've completed the payment
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
