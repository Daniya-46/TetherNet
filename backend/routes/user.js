const express = require("express");
const multer = require("multer");

const {
  loginUser,
  signupUser,
  getUserProfile,
  updatePfp,
  sendDeleteRequest,
  acceptRequest,
  rejectRequest,
  getFriendRequests,
  getFriends,
  updatePrivacySettings,
} = require("../controllers/userController");
const verifyToken = require("../middleware/verifyToken");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/profilePics");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

const router = express.Router();

//login
router.post("/login", loginUser);

//signup
router.post("/signup", signupUser);

router.use(verifyToken);

//profile routes

router.get("/:id", getUserProfile);

router.patch("/:id/privacy-settings", updatePrivacySettings);

//profile pic
router.patch("/:id", upload.single("pfp"), updatePfp);

//friend routes
router.get("/:id/friends", getFriends);

//requests
router.get("/:id/friend-requests", getFriendRequests);

router.patch("/:id/friend-request/:requestId", sendDeleteRequest);

router.patch("/:id/friends/:senderId/accept", acceptRequest);

router.patch("/:id/friends/:senderId/reject", rejectRequest);

module.exports = router;
