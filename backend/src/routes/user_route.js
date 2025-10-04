import express from "express";
import { protectRoute } from "../middleware/auth_middleware.js";
import { 
    getRecommendedUsers, 
    getMyFriends, 
    sendFriendRequest, 
    acceptFriendRequest, 
    getFriendRequests,
    getOutgoingFriendRequests
} from "../controllers/user_controller.js";

const router = express.Router();

router.use(protectRoute);

router.get('/', getRecommendedUsers );
router.get('/friends', getMyFriends );

router.post('/friend-request/:id', sendFriendRequest);
router.put('/friend-request/:id/accept', acceptFriendRequest);

router.get('/friend-requests', getFriendRequests);
router.get('/friend-requests/sent', getOutgoingFriendRequests);

export default router;