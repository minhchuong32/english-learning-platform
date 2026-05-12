const authService = require("../services/authService");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const getLogin = (req, res) => {
  return res.render("login.ejs");
};

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const normalizedUsername = username?.trim();
    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedUsername || !normalizedEmail || !password) {
      return res
        .status(400)
        .json({ message: "Dữ liệu bị trống hoặc sai định dạng." });
    }

    const existingUser = await User.findOne({
      $or: [{ email: normalizedEmail }, { username: normalizedUsername }],
    });
    if (existingUser) {
      return res.status(409).json({ message: "Tài khoản đã tồn tại." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      username: normalizedUsername,
      email: normalizedEmail,
      password: hashedPassword,
      role: "user",
      profile: {},
    });

    return res.status(201).json({ message: "Đăng ký thành công." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server nội bộ." });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedEmail) {
      return res
        .status(400)
        .json({ message: "Dữ liệu bị trống hoặc sai định dạng." });
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(200).json({
        message: "Email khôi phục đã được gửi! Kiểm tra hộp thư của bạn.",
      });
    }

    const token = crypto.randomBytes(24).toString("hex");
    user.otp = {
      code: token,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    };
    await user.save();

    return res.status(200).json({
      message: "Email khôi phục đã được gửi! Kiểm tra hộp thư của bạn.",
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server nội bộ." });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res
        .status(400)
        .json({ message: "Dữ liệu bị trống hoặc sai định dạng." });
    }

    const user = await User.findOne({
      "otp.code": token,
      "otp.expiresAt": { $gt: new Date() },
    });

    if (!user) {
      return res
        .status(404)
        .json({ message: "Token không hợp lệ hoặc đã hết hạn." });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = undefined;
    await user.save();

    return res.status(200).json({ message: "Đặt lại mật khẩu thành công." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server nội bộ." });
  }
};
const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    // Gọi Service xử lý logic
    const authResult = await authService.loginUser(identifier, password);

    // Set Cookie cho JWT (Bảo mật: httpOnly tránh tấn công XSS)
    res.cookie("jwt", authResult.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Chỉ dùng https ở production
      maxAge: 15 * 60 * 1000, // 15 phút
    });

    res.cookie("refreshToken", authResult.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
    });

    // Xác thực thành công: 200 OK + redirect_url
    return res.status(200).json({
      message: "Đăng nhập thành công",
      redirect_url: authResult.redirect_url,
    });
  } catch (error) {
    // Bắt lỗi từ Service trả về
    if (error.message === "UNAUTHORIZED") {
      return res
        .status(401)
        .json({ message: "Không tìm thấy người dùng hoặc sai mật khẩu." });
    }

    console.error(error);
    return res.status(500).json({ message: "Lỗi server nội bộ." });
  }
};
const googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: "Không tìm thấy Google Token." });
    }

    // Gọi Service xử lý
    const authResult = await authService.loginWithGoogle(idToken);

    // Set Cookie y hệt đăng nhập thường
    res.cookie("jwt", authResult.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", authResult.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Đăng nhập Google thành công",
      redirect_url: authResult.redirect_url,
    });
  } catch (error) {
    console.error("Google Login Error:", error);
    return res.status(401).json({ message: "Xác thực Google thất bại." });
  }
};
module.exports = {
  login,
  getLogin,
  googleLogin,
  register,
  forgotPassword,
  resetPassword,
};
