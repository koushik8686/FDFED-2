"use client"

import { useState } from "react"
import CreditCardModal from "./creditcardModal"

const SubscriptionModal = ({ onClose, onSubscribe }) => {
  const [showCreditCardModal, setShowCreditCardModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [selectedPrice, setSelectedPrice] = useState(null)

  const plans = [
    {
      name: "Standard",
      price: "500",
      features: ["List up to 10 items"],
      recommended: false,
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
    },
    {
      name: "Premium",
      price: "1000",
      features: ["Unlimited items", "24/7 support"],
      recommended: true,
      color: "bg-gradient-to-br from-purple-500 to-purple-600",
    },
  ]

  const handlePlanSelect = (plan, price) => {
    setSelectedPlan(plan)
    setSelectedPrice(price)
    setShowCreditCardModal(true)
  }

  const handlePaymentSuccess = () => {
    // Close the credit card modal
    setShowCreditCardModal(false)

    // Call the parent component's onSubscribe function
    onSubscribe(selectedPlan)
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="w-full max-w-3xl bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Upgrade Your Subscription</h2>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="text-gray-600 mb-6">
              <p>
                You've reached the limit of 3 items for the free plan. Upgrade now to list more items and unlock premium
                features!
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {plans.map((plan, index) => (
                <div
                  key={index}
                  className={`relative rounded-xl overflow-hidden border ${plan.recommended ? "border-purple-300 shadow-lg" : "border-gray-200"}`}
                >
                  {plan.recommended && (
                    <div className="absolute top-0 right-0 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                      RECOMMENDED
                    </div>
                  )}

                  <div className={`${plan.color} text-white p-6`}>
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                    <div className="mt-2">
                      <span className="text-3xl font-bold">₹{plan.price}</span>
                      <span className="text-white/80 ml-1">/month</span>
                    </div>
                  </div>

                  <div className="p-6 bg-white">
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center">
                          <svg
                            className="h-5 w-5 text-green-500 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => handlePlanSelect(plan.name.toLowerCase(), plan.price)}
                      className={`w-full py-3 rounded-lg font-medium transition-all ${
                        plan.recommended
                          ? "bg-purple-600 hover:bg-purple-700 text-white"
                          : "bg-blue-600 hover:bg-blue-700 text-white"
                      }`}
                    >
                      Upgrade to {plan.name}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center text-gray-500 text-sm">
              <p>All plans include a 7-day free trial. Cancel anytime.</p>
            </div>
          </div>
        </div>
      </div>

      {showCreditCardModal && (
        <CreditCardModal
          onClose={() => setShowCreditCardModal(false)}
          onSuccess={handlePaymentSuccess}
          selectedPlan={selectedPlan}
          planPrice={selectedPrice}
        />
      )}
    </>
  )
}

export default SubscriptionModal
