import Booking from '../models/BookingSchema.js';
import Photographer from '../models/PhotographerSchema.js';
import Review from '../models/ReviewSchema.js';

export const updatePhotographer = async(req, res)=> {

    const id = req.params.id;
    
    try {

        const updatePhotographer =await Photographer.findByIdAndUpdate(id,{$set:req.body}, {new:true})

        res
        .status(200)
        .json({success:true, message:'Successfully updated', data:updatePhotographer});
        
    } catch (err) {

        res
        .status(500)
        .json({success:false, message:'failed to update'});
        
    }
}

export const deletePhotographer = async(req, res)=> {

    const id = req.params.id;
    
    try {

        await Photographer.findByIdAndDelete(id,)

        res
        .status(200)
        .json({success:true, message:'Successfully deteleted'});
        
    } catch (err) {

        res
        .status(500)
        .json({success:false, message:'failed to delete'});
        
    }
}

export const getSinglePhotographer = async(req, res)=> {

    const id = req.params.id;
    
    try {

        const photographer =await Photographer.findById(id ,)
            .populate("reviews")
            .select("-password");

        res
        .status(200)
        .json({success:true, message:'Photographer found', data:photographer});
        
    } catch (err) {

        res
        .status(404)
        .json({success:false, message:'No Photographer found'});
        
    }
}

export const getAllPhotographer = async(req, res)=> {
    
    try {

        const {query} = req.query
        let photographers;

        if(query){
            photographers = await Photographer.find({
                isApproved:'approved',
                $or:[
                    {name:{$regex:query, $options:'i'}},
                    {company:{$regex:query, $options:'i'}},
                    {location:{$regex:query, $options:'i'}},
                ] 
            }).select("-password");
        }else{
            
            photographers =await Photographer.find({isApproved:'approved'}).select("-password");

        }
 
        res
        .status(200)
        .json({success:true, message:'Photographers found', data:photographers});
        
    } catch (err) {

        res
        .status(404)
        .json({success:false, message:'Not found'});
        
    }
};

export const getPhotographerProfile = async(req, res)=> {
    
    const photographerId = req.userId

    try {
        const photographer = await Photographer.findById(photographerId)

        if(!photographer) {
            return res
                .status(404)
                .json({success:false, message:'Photographer not found'});
        }
        const {password, ...rest} = photographer._doc;
        const appointments = await Booking.find({photographer:photographerId})

        res.status(200).json({success:true, message:'Profile info is getting', data:{...rest, appointments}})
    } catch (err) {
        res
            .status(500)
            .json({success:false, message:'Something went wrong cannot get'});
    }
}