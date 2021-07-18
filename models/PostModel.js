import mongoose from 'mongoose'
const {ObjectId} = mongoose.Schema.Types
//const validator = require('validator');

mongoose.set('debug', true);
var PostSchema = new mongoose.Schema(
    {
        userId: {type:ObjectId,ref:"User",required:true},
        descprtion: {type: String, trim: true},
        image: {type: String,default: 'noAvatar.png'},
        status: { type:String,default:'active'},
        likes:[{type:ObjectId,ref:"User"}],
    },
    { timestamps: true }
);

export default mongoose.model('Post', PostSchema, 'posts');