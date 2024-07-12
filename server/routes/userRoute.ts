import  express  from 'express';
import { activateUser, registrationUser } from '../controllers/userController';
const router=express.Router();

router.post("/register", registrationUser)
router.post("/activate-user", activateUser)

export default router;