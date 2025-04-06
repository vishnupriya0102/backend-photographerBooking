import User from '../models/UserSchema.js';
import Photographer from '../models/PhotographerSchema.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { generateRandomBytes } from '../cryptoUtils.js';
//  console.log(randomBytes);
const generateToken = user => {
    // Generate random bytes for signing the token
    // const secretKey = generateRandomBytes();
    
    // Sign the token using the generated secret key
    return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET_KEY, { expiresIn: "15d" });
};

export const register = async(req, res)=>{
    
    const {email, password, name, role, photo, gender} = req.body

    try {
        
        let user = null;

        if(role ==='customer'){
            user = await User.findOne({email})
        }
        else if(role ==='photographer'){
            user = await Photographer.findOne({email})
        }
        if(user){
            return res.status(400).json({message:'User already exists'})
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        if(role ==='customer'){
            user = new User({
                name,
                email,
                password:hashedPassword,
                photo,
                gender,
                role
            })
        }
        if(role ==='photographer'){
            user = new Photographer({
                name,
                email,
                password:hashedPassword,
                photo,
                gender,
                role
            })
        }

        await user.save();
        // const token = jwt.sign({id:user._id}, process.env.JWT_SECRET);
        // res.status(201).json({token, user})
        res.status(200).json({success:true, message:'User successfully created'})
        
    } catch (err) {

        res.status(500).json({success:false, message:'Internal Server Error, try again'})

    }
};
export const login = async(req, res)=>{

    const {email, password} = req.body;
    
    try {

        let user = null;

        const customer = await User.findOne({email})
        const photographer = await Photographer.findOne({email})

        if(customer){
            user= customer
        }
        if(photographer){
            user= photographer
        }

        if(!user){
            return res
            .status(404)
            .json({message:'User not found'});
        }

        const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
        
        if(!isPasswordMatch){
            return res
            .status(400)
            .json({status:false, message:'Invalid credentials'});
        }

        //get toke
        const token = generateToken(user);

        const {password, role, appointments, ...rest} = user._doc
        res
        .status(200)
        .json({success:true, message:"Successfully login", token, data:{...rest}, role})

    } catch (err) {
        
        return res
        .status(500)
        .json({status:false, message:'Failed to login'});

    }
};