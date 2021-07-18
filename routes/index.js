import express from 'express'
const router = express.Router();
import { Authcontroller } from '../controllers'
import { PostController } from '../controllers'
import  Auth  from '../midllewares/check_auth'

router.post('/register',Authcontroller.register);

router.post('/login',Authcontroller.login);

router.post('/createPost',Auth,PostController.create);

router.get('/allPost/:userId',Auth,PostController.allPost);



export default router;
