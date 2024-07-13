import  express  from 'express';
import { activateUser, loginUser, registrationUser } from '../controllers/userController';
const router=express.Router();

router.post("/register", registrationUser)
router.post("/activate-user", activateUser)
router.post("/login", loginUser)

export default router;