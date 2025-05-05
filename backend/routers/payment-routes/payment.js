const express = require('express');
const router = express.Router();
const stripe = require('../../config/stripe');

router.post('/create-checkout-session', async (req, res) => {
  try {
    const { items, couponCode } = req.body;
    
    let totalAmount = 0;
    const lineItems = items.map(item => {
      const amount = Math.round(item.current_price * 100);
      totalAmount += amount;
      
      return {
        price_data: {
          currency: 'inr',
          product_data: {
            name: item.name,
            images: [item.url]
          },
          unit_amount: amount
        },
        quantity: 1
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
      metadata: {
        itemIds: JSON.stringify(items.map(item => item._id))
      }
    });

    res.json({ id: session.id, totalAmount: totalAmount / 100 });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

module.exports = router;
