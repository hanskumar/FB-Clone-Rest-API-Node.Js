import JWT from 'jsonwebtoken'
import apiResponse from './ApiResponse'
import { JWT_TIMEOUT_DURATION,JWT_ACCESS_TOKEN_SECRET,JWT_REFRESH_TOKEN_SECRET } from '../config';

 module.exports = {

    /*-------------Access Token for login---------------*/    
    loginAccessToken: (userData,res) => {
        return new Promise((resolve, reject) => {
          const payload = {}
          const secret = process.env.JWT_ACCESS_TOKEN_SECRET
          const options = {
            expiresIn: process.env.JWT_TIMEOUT_DURATION,
            issuer: 'classified.com',
            audience: userData,
          }
          JWT.sign(payload, secret, options, (err, token) => {
            if (err) {
              console.log(err.message)
              //reject(createError.InternalServerError())
              return apiResponse.unauthorizedResponse(res, "Error in Generating Login Request Token");
            }
            resolve(token)
          })
        })
    },

    signAccessToken: (userId,res) => {
        return new Promise((resolve, reject) => {
          const payload = {}
          const secret = process.env.JWT_ACCESS_TOKEN_SECRET
          const options = {
            expiresIn: process.env.JWT_TIMEOUT_DURATION,
            issuer: 'classified.com',
            audience: userId,
          }
          JWT.sign(payload, secret, options, (err, token) => {
            if (err) {
              console.log(err.message)
              //reject(createError.InternalServerError())
              return apiResponse.unauthorizedResponse(res, "Unautharized Request Token");
            }
            resolve(token)
          })
        })
    },

    signRefreshToken: (userId,res) => {
        return new Promise((resolve, reject) => {
          const payload = {}
          const secret = process.env.JWT_REFRESH_TOKEN_SECRET
          const options = {
            expiresIn: '1y',
            issuer: 'classified.com',
            audience: userId,
          }
          JWT.sign(payload, secret, options, (err, token) => {
            if (err) {
              console.log(err.message);
              // reject(err)
              //reject(createError.InternalServerError())
              reject (apiResponse.unauthorizedResponse(res, "Unautharized Request Token"));
            }
    
            /* client.SET(userId, token, 'EX', 365 * 24 * 60 * 60, (err, reply) => {
              if (err) {
                console.log(err.message)
                //reject(createError.InternalServerError())
                return
              }
              resolve(token)
            }) */

            resolve(token)

          })
        })
    },
}