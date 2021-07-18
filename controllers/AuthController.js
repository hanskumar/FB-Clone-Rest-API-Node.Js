/**
 * Login ,Register methods
*/
import Joi from 'joi';
import  registerSchema  from '../validation/RegisterSchema'
import LoginSchema from '../validation/LoginSchema'
import CustomErrorHandler from '../midllewares/customErrorHadler'
import UserModel from '../models/UserModel';
import apiResponse from '../helpers/ApiResponse'
import moment from 'moment';
import bcrypt from 'bcrypt';

const { loginAccessToken,signAccessToken,signRefreshToken } = require('../helpers/JwtToken')

const Authcontroller = {

    async register(req,res,next) {

        const { error } = registerSchema.validate(req.body);
        
        if (error) {
            return next(error);
        } 
        //console.log(error);

        try{
            const { name, email, password } = req.body;
            const today = moment(new Date()).format("YYYY-MM-DD");
            //console.log(req.body);

            const exist = await UserModel.exists({ email });
            if (exist) {
                return next(CustomErrorHandler.alreadyExist('This email is already taken.'));
            }

            let userData = {
                password,
                name,
                email,
                proifle_image:'',
                status : 'active',
                reg_date:today
            };

            const user = new UserModel(userData);
            const savedUser = await user.save();
            
            return apiResponse.successResponse(res,"Registration Done successfully.");
            
        } catch(err){
            console.log(err);
            return next(err);
        }
    },

    async login(req,res,next) {

        const { error } = LoginSchema.validate(req.body);
        
        if (error) {
            return next(error);
        } 
        //console.log(error);

        try{
            const { email, password } = req.body;
            const today = moment(new Date()).format("YYYY-MM-DD");
            //console.log(req.body);

            const user = await UserModel.findOne({ email });

            if (!user) {
                //return next(CustomErrorHandler.wrongCredentials());
                return apiResponse.unauthorizedResponse(res, "Email or Password are invalid.");
            }

            //const isMatch = await UserModel.isPasswordMatch(password);

            const isMatch = await bcrypt.compare(req.body.password, user.password);

            if(!isMatch){
                return apiResponse.unauthorizedResponse(res, "Email or Password are invalid.");
            }

            if(user.status == "active"){

                let userData = {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    status : user.status,
                    profile_image :user.profile_image
                };

                const accessToken = await signAccessToken(user.id);
                const refreshToken = await signRefreshToken(user.id);

                userData.accessToken = accessToken;
                userData.refreshToken = refreshToken;

                return apiResponse.successResponseWithData(res,"Login done Successfully.", userData);

            } else {
                return apiResponse.unauthorizedResponse(res, "Account is not confirmed. Please confirm your account.");
            }
            
        } catch(err){
            console.log(err);
            return next(err);
        }
    }

}

export default Authcontroller;