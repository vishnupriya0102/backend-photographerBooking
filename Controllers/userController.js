import User from '../models/UserSchema.js';
import Booking from '../models/BookingSchema.js';
import Photographer from '../models/PhotographerSchema.js';

export const updateUser = async(req, res)=> {

    const id = req.params.id;
    
    try {

        const updateUser =await User.findByIdAndUpdate(id,{$set:req.body}, {new:true})

        res
        .status(200)
        .json({success:true, message:'Successfully updated', data:updateUser});
        
    } catch (err) {

        res
        .status(500)
        .json({success:false, message:'failed to update'});
        
    }
}

export const deleteUser = async(req, res)=> {

    const id = req.params.id;
    
    try {

        await User.findByIdAndDelete(id,)

        res
        .status(200)
        .json({success:true, message:'Successfully deteleted'});
        
    } catch (err) {

        res
        .status(500)
        .json({success:false, message:'failed to delete'});
        
    }
}

export const getSingleUser = async(req, res)=> {

    const id = req.params.id;
    
    try {

        const user =await User.findById(id,).select("-password");

        res
        .status(200)
        .json({success:true, message:'User found', data:user});
        
    } catch (err) {

        res
        .status(404)
        .json({success:false, message:'No user found'});
        
    }
}

export const getAllUser = async(req, res)=> {
    
    try {

        const users =await User.find({}).select("-password");

        res
        .status(200)
        .json({success:true, message:'Users found', data:users});
        
    } catch (err) {

        res
        .status(404)
        .json({success:false, message:'Not found'});
        
    }
}

export  const getUserProfile= async(req, res)=> {
    const userId = req.userId

    try {
        const user = await User.findById(userId)

        if(!user) {
            return res
                .status(404)
                .json({success:false, message:'User not found'});
        }
        const {password, ...rest} = user._doc

        res.status(200).json({success:true, message:'Profile info is getting', data:{...rest}})
    } catch (err) {
        res
            .status(500)
            .json({success:false, message:'Something went wrong cannot get'});
    }
}

export const getMyAppointments = async (req, res) => {
    try {

        // step-1 : retrieve appointments from booking for specific user
        const bookings = await Booking.find({user: req.userId})

        //step 2 : extract photographer ids from appointment bookings
        const photographerIds = bookings.map(el => el.photographer.id);

        //step 3 : retrieve photographers using photographer ids
        const photographers = await Photographer.find({_id: {$in: photographerIds}}).select('-password')

        res
           .status(200)
           .json({success:true, message:'Appointments are getting', data:photographers})
        
    } catch (err) {
        res
            .status(500)
            .json({success:false, message:'Something went wrong cannot get'});
    
    }
}