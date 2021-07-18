import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
const {ObjectId} = mongoose.Schema.Types
//const validator = require('validator');

mongoose.set('debug', true);
var UserSchema = new mongoose.Schema({
    name: {type: String,trim: true},
    email: {type: String, trim: true,unique: true,index:true,sparse:true},
    password: { type: String,trim: true},
    profile_image: {type: String,default: 'noAvatar.png'},
    cover_photo: {type: String,default: 'default.jpg'},
    reg_date:  { type: Date,default: Date.now},
    status: { type:String,default:'active'},

    followers:[{type:ObjectId,ref:"User"}],
    following:[{type:ObjectId,ref:"User"}],

    city: {type: String,max: 50},
    from: {type: String,max: 50},

    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    emailConfirmStatus: {
      type: Boolean,
      default: false,
    },
    emailConfirmToken: String,
    emailConfirmTokenExpires: Date,
    created_by:  String,
});

//password will be hashed beforre its saved
UserSchema.pre('save', async function (next) {
    try {

        var user = this;

        /* if(!user.isModified('password')){
            return next();
        } */
       
     // Here first checking if the document is new by using a helper of mongoose .isNew, therefore, this.isNew is true if document is new else false, and we only want to hash the password if its a new document, else  it will again hash the password if you save the document again by making some changes in other fields incase your document contains other fields.
      
      if (this.isNew) {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(this.password, salt)
        this.password = hashedPassword
      }
      next()
    } catch (error) {
      next(error)
    }
}) 

UserSchema.methods.isPasswordMatch = async function(password) {
    try{
        return await bcrypt.compare(password, this.password)

    } catch (error){
        console.log(error);
        throw error
    }
}

export default mongoose.model('User', UserSchema, 'users');