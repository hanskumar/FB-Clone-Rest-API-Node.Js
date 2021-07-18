/*
 * Middleware to check  auth token
*/
import JWT from 'jsonwebtoken'
import apiResponse from '../helpers/ApiResponse'
import UserModel from '../models/UserModel';
import { JWT_ACCESS_TOKEN_SECRET } from '../config';

const Auth = async function (req, res, next) {

        const authHeader = req.headers['authorization'] || req.headers['x-access-token'];
        
        if(authHeader){

            var token  = req.headers.authorization.split("Bearer ")[1] || undefined;
            
            JWT.verify(token, JWT_ACCESS_TOKEN_SECRET, function(error, payload) {
                if (error) {
                    console.log(error);
                    return apiResponse.unauthorizedResponse(res, "Unautharized Request");
                } else {
                    /* req.payload = payload;
                    var authenticated = true;
                    next(); */

                    //const {id} = payload
                    UserModel.findById({_id:payload.aud}).then(userdata=>{
                        req.user = userdata;
                        //console.log(userdata);
                        next()
                    })
                }
            });
        } else {
            return apiResponse.unauthorizedResponse(res, "Unautharized Error");
        }
}


export default Auth;