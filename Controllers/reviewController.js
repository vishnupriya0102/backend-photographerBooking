import Review from "../models/ReviewSchema.js";
import Photographer from "../models/PhotographerSchema.js";

export const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find();
        res.status(200).json({success:false, message:"Successful", data: reviews });
        
    } catch (err) {
        res.status(404).json({success:false, message:"Not found"})
    }
}

// create review

export const createReview = async (req, res) => {
    if (!req.body.photographer) req.body.photographer = req.params.photographerId
    if(!req.body.user) req.body.user=req.userId

    const newReview = new Review(req.body)
    try {

        const savedReview = await newReview.save()

        await Photographer.findByIdAndUpdate(req.body.photographer, {
            $push: { reviews: savedReview._id },
        });
        res.status(200).json({success:false, message:"Review Successful", data: savedReview });
        
    } catch (err) {
        res.status(500).json({success:false, message: err.message});
    }
}