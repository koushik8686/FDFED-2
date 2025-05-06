"use client"

import { useState } from "react"
import Cookies from "js-cookie"

const CreditCardModal = ({ onClose, onSuccess, selectedPlan, planPrice }) => {
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  })
  const sellerid = Cookies.get("seller")
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    
    // Format card number with spaces every 4 digits
    if (name === "cardNumber") {
      const formattedValue = value
        .replace(/\s/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim()
        .slice(0, 19)
      
      setCardDetails({ ...cardDetails, [name]: formattedValue })
      return
    }
    
    // Format expiry date as MM/YY
    if (name === "expiryDate") {
      const cleaned = value.replace(/\D/g, "")
      let formatted = cleaned
      
      if (cleaned.length > 2) {
        formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`
      }
      
      setCardDetails({ ...cardDetails, [name]: formatted })
      return
    }
    
    // Limit CVV to 3-4 digits
    if (name === "cvv") {
      const cleaned = value.replace(/\D/g, "").slice(0, 4)
      setCardDetails({ ...cardDetails, [name]: cleaned })
      return
    }
    
    setCardDetails({ ...cardDetails, [name]: value })
  }

  const validateForm = () => {
    const newErrors = {}
    
    // Validate card number (remove spaces for validation)
    const cardNumberClean = cardDetails.cardNumber.replace(/\s/g, "")
    if (!cardNumberClean || cardNumberClean.length < 16) {
      newErrors.cardNumber = "Please enter a valid card number"
    }
    
    // Validate name
    if (!cardDetails.cardName.trim()) {
      newErrors.cardName = "Please enter the name on card"
    }
    
    // Validate expiry date
    if (!cardDetails.expiryDate || !cardDetails.expiryDate.includes("/")) {
      newErrors.expiryDate = "Please enter a valid expiry date (MM/YY)"
    } else {
      const [month, year] = cardDetails.expiryDate.split("/")
      const currentYear = new Date().getFullYear() % 100
      const currentMonth = new Date().getMonth() + 1
      
      if (
        !month || 
        !year || 
        parseInt(month) < 1 || 
        parseInt(month) > 12 ||
        (parseInt(year) < currentYear || 
          (parseInt(year) === currentYear && parseInt(month) < currentMonth))
      ) {
        newErrors.expiryDate = "Card has expired or date is invalid"
      }
    }
    
    // Validate CVV
    if (!cardDetails.cvv || cardDetails.cvv.length < 3) {
      newErrors.cvv = "Please enter a valid security code"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)
    
    try {
      
      // In a real app, you would use a secure payment processor
      // and not send card details directly to your backend
      const response = await fetch(`${process.env.REACT_APP_BACKENDURL}/seller/${sellerid}/subscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan: selectedPlan,
        }),
      })
      
      if (!response.ok) {
        throw new Error("Subscription failed")
      }
      
      // Handle successful payment
      onSuccess()
    } catch (error) {
      console.error("Payment error:", error)
      setErrors({ 
        submit: "Payment failed. Please try again or use a different payment method." 
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Complete Your Purchase</h2>
            <button 
              onClick={onClose} 
              className="text-gray-500 hover:text-gray-700 transition-colors"
              disabled={isSubmitting}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="mb-6 bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">You selected</p>
                <p className="font-medium text-gray-900">{selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)} Plan</p>
              </div>
              <div className="text-xl font-bold text-gray-900">₹{planPrice}</div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={cardDetails.cardNumber}
                  onChange={handleInputChange}
                  className={`block w-full border ${
                    errors.cardNumber ? "border-red-500" : "border-gray-300"
                  } rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                  disabled={isSubmitting}
                />
                {errors.cardNumber && <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>}
              </div>
              
              <div>
                <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
                  Name on Card
                </label>
                <input
                  type="text"
                  id="cardName"
                  name="cardName"
                  placeholder="John Smith"
                  value={cardDetails.cardName}
                  onChange={handleInputChange}
                  className={`block w-full border ${
                    errors.cardName ? "border-red-500" : "border-gray-300"
                  } rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                  disabled={isSubmitting}
                />
                {errors.cardName && <p className="mt-1 text-sm text-red-600">{errors.cardName}</p>}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    id="expiryDate"
                    name="expiryDate"
                    placeholder="MM/YY"
                    value={cardDetails.expiryDate}
                    onChange={handleInputChange}
                    className={`block w-full border ${
                      errors.expiryDate ? "border-red-500" : "border-gray-300"
                    } rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                    disabled={isSubmitting}
                  />
                  {errors.expiryDate && <p className="mt-1 text-sm text-red-600">{errors.expiryDate}</p>}
                </div>
                
                <div>
                  <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                    Security Code
                  </label>
                  <input
                    type="text"
                    id="cvv"
                    name="cvv"
                    placeholder="123"
                    value={cardDetails.cvv}
                    onChange={handleInputChange}
                    className={`block w-full border ${
                      errors.cvv ? "border-red-500" : "border-gray-300"
                    } rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                    disabled={isSubmitting}
                  />
                  {errors.cvv && <p className="mt-1 text-sm text-red-600">{errors.cvv}</p>}
                </div>
              </div>
              
              {errors.submit && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{errors.submit}</p>
                </div>
              )}
              
              <button
                type="submit"
                className={`w-full py-3 rounded-lg font-medium text-white ${
                  isSubmitting 
                    ? "bg-purple-400 cursor-not-allowed" 
                    : "bg-purple-600 hover:bg-purple-700"
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </div>
                ) : (
                  `Pay ₹${planPrice}`
                )}
              </button>
              
              <div className="flex items-center justify-center space-x-2 mt-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <p className="text-xs text-gray-500">Your payment information is secure and encrypted</p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreditCardModal
