import Joi from 'joi';

const PostSchema = Joi.object({
    //userId: Joi.string().required(),
    desc: Joi.string().required(),
    image_url: Joi.string().required(),
});

export default PostSchema;