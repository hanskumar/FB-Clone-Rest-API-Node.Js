/**
 * Create ,Edit,Delete Post methods
*/
import PostSchema from '../validation/PostSchema'
import CustomErrorHandler from '../midllewares/customErrorHadler'
import PostModel from '../models/PostModel';
import apiResponse from '../helpers/ApiResponse'
import moment from 'moment';


const PostController = {

    /**
     * Create New Post
    */
    async create(req,res,next) {

        const { error } = PostSchema.validate(req.body);
        
        if (error) {
            return next(error);
        } 
        //console.log(error);

        try{
            const {image_url, desc } = req.body;
            const today = moment(new Date()).format("YYYY-MM-DD");
            //console.log(req.body);

            let PostData = {
                userId:req.user,
                image:image_url,
                descprtion:desc
            };

            const post = new PostModel(PostData);
            const savedpost = await post.save();
            
            return apiResponse.successResponse(res,"Post Created Succssfully.",savedpost);
            
        } catch(err){
            console.log(err);
            return next(err);
        }
    },

    /**
    * Delete Post
    */
    async delete(req,res,next) {

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

export default PostController;