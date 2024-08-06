const User = require("../models/userModel");
const Post = require("../models/postModel");
const jwt = require("jsonwebtoken");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

//login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);

    //create token
    const token = createToken(user._id);

    res.status(200).json({
      email,
      username: user.username,
      profilePic: user.profilePic,
      token,
      _id: user._id,
      isPrivate: user.isPrivate,
      friends: user.friends,
      friendRequests: user.friendRequests,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

//signup
const signupUser = async (req, res) => {
  const { email, password, username } = req.body;

  try {
    const user = await User.signup(email, password, username);

    //create token
    const token = createToken(user._id);

    res.status(200).json({
      email,
      username: user.username,
      profilePic: user.profilePic,
      token,
      _id: user._id,
      isPrivate: user.isPrivate,
      friends: [],
      friendRequests: [],
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

//get user's profile
const getUserProfile = async (req, res) => {
  const author = req.user._id;
  try {
    const posts = await Post.find({ author })
      .sort({ createdAt: -1 })
      .populate("author", "username profilePic")
      .populate({
        path: "comments.author",
        select: "username",
      });

    res.status(200).json(posts);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//privacy settings
const updatePrivacySettings = async (req, res) => {
  const { id } = req.params;
  const { privacy } = req.body;

  if (!id || privacy === undefined) {
    return res
      .status(400)
      .json({ error: "User ID and privacy settings are required" });
  }

  try {
    const user = await User.findByIdAndUpdate(
      id,
      { isPrivate: privacy },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//update pfp
const updatePfp = async (req, res) => {
  const { id } = req.params;
  const pfpUrl = req.file ? `/uploads/profilePics/${req.file.filename}` : "";

  try {
    const user = await User.findByIdAndUpdate(
      id,
      { profilePic: pfpUrl },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getFriends = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(404).json({ error: "id required" });
  }

  try {
    const user = await User.findById(id).populate({
      path: "friends",
      select: "username profilePic",
    });

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const getFriendRequests = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(404).json({ error: "id required" });
  }

  try {
    const user = await User.findById(id).populate({
      path: "friendRequests",
      select: "username profilePic",
    });

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const sendDeleteRequest = async (req, res) => {
  const { id, requestId } = req.params;

  if (!id || !requestId) {
    return res
      .status(400)
      .json({ error: "User Id and Request Id are required" });
  }

  try {
    // const user = await User.findById(id);
    const requestedUser = await User.findById(requestId);
    if (!requestedUser) {
      return res.status(404).json({ error: "Requested User not found" });
    }

    const isRequest = requestedUser.friendRequests.includes(id);

    const updateOperation = isRequest
      ? { $pull: { friendRequests: id } }
      : { $addToSet: { friendRequests: id } };

    await User.findByIdAndUpdate(requestId, updateOperation, {
      new: true,
    }).populate("friendRequests", "username profilePic");

    res.status(200).json({ message: "Request successfully sent" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const acceptRequest = async (req, res) => {
  const { id, senderId } = req.params;

  if (!id || !senderId) {
    return res
      .status(404)
      .json({ error: "User Id and Sender Id are required" });
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const sender = await User.findById(senderId);
    if (!sender) {
      return res.status(404).json({ error: "Requested User not found" });
    }

    // Add as friends to both users
    await User.findByIdAndUpdate(id, { $addToSet: { friends: senderId } });
    await User.findByIdAndUpdate(senderId, { $addToSet: { friends: id } });

    // Remove from requests from both
    await User.findByIdAndUpdate(id, { $pull: { friendRequests: senderId } });

    const updatedUser = await User.findById(id)
      .select("friends friendRequests")
      .populate("friends", "username profilePic")
      .populate("friendRequests", "username profilePic");

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const rejectRequest = async (req, res) => {
  const { id, senderId } = req.params;

  if (!id || !senderId) {
    return res
      .status(404)
      .json({ error: "User Id and Sender Id are required" });
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const sender = await User.findById(senderId);
    if (!sender) {
      return res.status(404).json({ error: "Requested User not found" });
    }

    // Remove from requests from both
    await User.findByIdAndUpdate(id, { $pull: { friendRequests: senderId } });

    const updatedUser = await User.findById(id)
      .select("friends friendRequests")
      .populate("friends", "username profilePic")
      .populate("friendRequests", "username profilePic");

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  signupUser,
  loginUser,
  getUserProfile,
  updatePrivacySettings,
  updatePfp,
  getFriends,
  getFriendRequests,
  sendDeleteRequest,
  acceptRequest,
  rejectRequest,
};
