const express = require("express");
const multer = require("multer");

const {
  newPost,
  getFeed,
  getSinglePost,
  deletePost,
  likePost,
  commentOnPost,
} = require("../controllers/postController");
const verifyToken = require("../middleware/verifyToken");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/posts");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith("image/") ||
    file.mimetype.startsWith("video/")
  ) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1024 * 1024 * 10 },
});

const router = express.Router();

router.use(verifyToken);

//feed
router.get("/feed", getFeed);

//GET single post
router.get("/:id", getSinglePost);

//POST a new post
router.post("/", upload.single("media"), newPost);

//DELETE a post
router.delete("/:id", deletePost);

//like a post
router.patch("/:id/like", likePost);

//comment on a post
router.patch("/:id/comments", commentOnPost);

module.exports = router;
