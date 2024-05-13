const Razorpay = require("razorpay");
const Order = require("../models/order");
const userController = require("./users");

exports.purchasePremium = async (req, res, next) => {
  try {
    var rzp = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    const amount = 2500;

    rzp.orders.create({ amount, currency: "INR" }, async (err, order) => {
      if (err) {
        throw new Error(JSON.stringify(err));
      }

      const result = await req.user.createOrder({
        orderid: order.id,
        status: "PENDING",
      });

      return res
        .status(201)
        .json({ success: true, result, key_id: rzp.key_id });
    });
  } catch (err) {
    console.log(err);
    return res.json({ success: false, err });
  }
};

exports.updateTransactionStatus = async (req, res, next) => {
  try {
    const userId = req.user.id
    const payment_id = req.body.payment_id;
    const order_id = req.body.order_id;
    const order = await Order.findOne({ where: { orderid: order_id } });
    const promise1 = order.update({
      paymentid: payment_id,
      status: "SUCCESSFUL",
    });
    const promise2 = req.user.update({ ispremiumuser: true });

    Promise.all([promise1, promise2])
      .then(() => {
        return res.status(202).json({
          sucess: true,
          message: "Transaction Successful",
          token: userController.generateToken(userId, undefined, true),
        });
      })
      .catch((error) => {
        throw new Error(error);
      });
  } catch (err) {
    console.log(err);
    res.status(403).json({ errpr: err, message: "Something went wrong" });
  }
};