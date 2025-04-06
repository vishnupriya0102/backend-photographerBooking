import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoute from "./Routes/auth.js";
import userRoute from "./Routes/user.js";
import photographerRoute from "./Routes/photographer.js";
import reviewRoute from "./Routes/review.js";
import BookingRoute from "./Routes/booking.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// const password = encodeURIComponent('VudtuDlojgbGIA6F');
// const uri = `mongodb+srv://vishnu:${password}@cluster0.yoscs0b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const corsOptions = {
    origin: true
};

app.get('/', (req, res) => {
    res.send('API is working');
});

// DB connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("DB connected");
    } catch (err) {
        console.error("Error connecting to DB:", err);
    }
};

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/photographers', photographerRoute);
app.use('/api/v1/reviews', reviewRoute);
app.use('/api/v1/booking', BookingRoute);

app.listen(port, () => {
    connectDB();
    console.log("Server is running on port " + port);
});
