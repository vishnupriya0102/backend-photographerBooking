import User from "../models/UserSchema.js";
import Photographer from "../models/PhotographerSchema.js";
import Booking from "../models/BookingSchema.js";
import Stripe from "stripe";

export const getCheckoutSessions = async (req, res) => {
  try {
    const photographer = await Photographer.findById(req.params.photographerId);
    const user = await User.findById(req.userId);
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}checkout-success`,
      cancel_url: `${req.protocol}://${req.get("host")}/photographers/${photographer.id}`,
      client_reference_id: req.params.photographerId,
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: photographer.name,
              description: photographer.bio,
              images: [photographer.photo],
            },
            unit_amount: photographer.ticketPrice * 100,
          },
          quantity: 1,
        },
      ],
    });

    const booking = new Booking({
      photographer: photographer._id,
      user: user._id,
      ticketPrice: photographer.ticketPrice,
      session: session.id,
    });

    await booking.save();
    res.status(200).json({ success: true, message: 'Successfully paid', session });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: err.message });
  }
};
