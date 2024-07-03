import { Router } from 'express';
import { upload } from '../middlewares/multer.middleware.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { 
    getCurrentUser,
    loginUser, 
    logoutUser, 
    refreshToken, 
    registerUser, 
    updateAccountDetails, 
    updatePassword,
    updateProfilePicture
} from '../controllers/user.controller.js';

const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "profilePicture",
            maxCount: 1,
        }
    ]),
    registerUser
);

router.route("/login").post(loginUser);

router.route("/logout").post(verifyJWT, logoutUser);

router.route("/refresh-token").post(verifyJWT, refreshToken);

router.route("/update-password").post(verifyJWT, updatePassword);

router.route("/current-user").get(verifyJWT, getCurrentUser);

router.route("/update-account-details").patch(verifyJWT, updateAccountDetails);

router.route("/update-profile-picture").patch(
    verifyJWT, 
    upload.fields([
        {
            name: "profilePicture",
            maxCount: 1,
        }
    ]),
    updateProfilePicture
);

export default router;