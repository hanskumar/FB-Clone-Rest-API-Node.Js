/**
 * Create ,Edit,Delete Post methods
*/
import PostSchema from '../validation/PostSchema'
import CustomErrorHandler from '../midllewares/customErrorHadler'
import PostModel from '../models/PostModel';
import UserModel from '../models/UserModel';
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
    * allPost Post ,logged in user + Friends Post
    */
    async allPost(req,res,next) {

        try {
            const { userId } = req.params.userId;
            console.log(req.params.userId);
            
            const user = await UserModel.findById(req.params.userId);

            if (!user) {
                //return next(CustomErrorHandler.wrongCredentials());
                return apiResponse.unauthorizedResponse(res, "No User found.");
            }

            const post = await PostModel.find({userId:user._id}).populate("userId").sort('-createdAt');

            if(post){
                return apiResponse.successResponseWithData(res,"All Post Data.", post);

            } else {
                return apiResponse.unauthorizedResponse(res, "No Post Found.");
            }
            
        } catch(err){
            console.log(err);
            return next(err);
        }
    }

}

export default PostController;