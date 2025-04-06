import jwt from 'jsonwebtoken';
import Photographer from '../models/PhotographerSchema.js';
import User from '../models/UserSchema.js';
import { generateRandomBytes } from '../cryptoUtils.js';

// Generate random bytes for JWT secret
// const jwtSecret = generateRandomBytes(); 

export const authenticate = async (req,res,next) => {
    //get token from headers
    const authToken = req.headers.authorization;

    //check if token exists
    if(!authToken || !authToken.startsWith("Bearer ")){
        return res.status(401).json({success:false, message:'No token, authorization denied'})
    }

    try {
        //  console.log(jwtSecret);
         //console.log(authToken);
        const token = authToken.split(" ")[1];
        // verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY, { algorithms: ['HS256'] });

        req.userId = decoded.id
        req.role = decoded.role
        // console.log(decoded);
        next();//important & must call the next function
    } catch (err) {
         console.log(err);

        if(err.name==="TokenExpiredError"){
            return res.status(401).json({message:'Token is expired'});
        }
        return res.status(401).json({success:false, message:'Invalid Token'}) ; 
    }
};

export const restrict = roles => async(req, res, next)=>{
    const userId = req.userId

    let user;

    const customer = await User.findById(userId);
    const photographer = await Photographer.findById(userId);

    if(customer){
        user = customer;
    }
    if(photographer){
        user = photographer;
    }
    if(!roles.includes(user.role)){
        return res.status(403).json({success:false, message:'You are not authorized'});
    }

    next();
}