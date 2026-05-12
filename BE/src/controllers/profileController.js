const User = require("../models/userModel");

const toSafeUser = (user) => ({
  id: user._id,
  username: user.username,
  email: user.email,
  role: user.role,
  isVerified: user.isVerified,
  profile: user.profile,
});

const userProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password -otp");

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng." });
    }

    return res.status(200).json({
      message: "This is user profile",
      data: toSafeUser(user),
    });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server nội bộ." });
  }
};

const adminProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password -otp");

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng." });
    }

    return res.status(200).json({
      message: "This is admin profile",
      data: toSafeUser(user),
    });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server nội bộ." });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const { fullName, bio, phoneNumber, avatarUrl } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng." });
    }

    user.profile = {
      ...((user.profile && user.profile.toObject && user.profile.toObject()) ||
        user.profile ||
        {}),
      fullName: fullName ?? user.profile.fullName,
      bio: bio ?? user.profile.bio,
      phoneNumber: phoneNumber ?? user.profile.phoneNumber,
      avatarUrl: avatarUrl ?? user.profile.avatarUrl,
    };

    await user.save();

    return res.status(200).json({
      message: "Cập nhật hồ sơ thành công.",
      user: toSafeUser(user),
    });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server nội bộ." });
  }
};

module.exports = {
  userProfile,
  adminProfile,
  updateUserProfile,
};
