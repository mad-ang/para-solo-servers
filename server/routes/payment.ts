import express from 'express';
import * as paypal from "../paypal";

const router = express.Router();

router.post('/api/orders', async (req, res) => {
  const order = await paypal.createOrder();
  console.log("들어옴")
  res.json(order);
});

router.post('/api/orders:orderID/Capture', async (req, res) => {
  const {orderID} = req.params
  const captureData = await paypal.capturePayment(orderID)
  res.json(captureData);
});

// router.post('/paypal:orderID/capture', p);

export default router;
