const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const loginUser = async (identifier, password) => {
  const normalizedIdentifier = identifier.trim();
  const emailIdentifier = normalizedIdentifier.toLowerCase();

  // 1. Tìm người dùng trong Database (findUser)
  const user = await User.findOne({
    $or: [{ email: emailIdentifier }, { username: normalizedIdentifier }],
  });

  // 2. Không tìm thấy người dùng
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }

  // 3. Kiểm tra mật khẩu
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("UNAUTHORIZED");
  }

  // 4. Tạo JWT (Access Token & Refresh Token)
  const payload = { id: user._id, role: user.role };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
  // Lưu ý: Nên có REFRESH_SECRET riêng trong file .env
  const refreshToken = jwt.sign(
    payload,
    process.env.REFRESH_SECRET || process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );

  // 5. Xác định redirect_url dựa trên role
  let redirect_url = "/user/profile";
  if (user.role === "admin") {
    redirect_url = "/admin/profile";
  }

  // Trả dữ liệu về cho Controller
  return { accessToken, refreshToken, redirect_url };
};

const loginWithGoogle = async (googleIdToken) => {
  // 1. Xác minh token từ Google
  const ticket = await client.verifyIdToken({
    idToken: googleIdToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  // Lấy thông tin user từ Google
  const payload = ticket.getPayload();
  const { sub: googleId, email, name, picture } = payload;

  // 2. Tìm user trong hệ thống (tìm theo googleId hoặc email)
  let user = await User.findOne({
    $or: [{ googleId: googleId }, { email: email }],
  });

  // 3. Nếu user chưa tồn tại -> Tạo mới hoàn toàn
  if (!user) {
    // Tạo username ngẫu nhiên từ email để không bị trùng lặp
    const baseUsername = email.split("@")[0];
    const randomSuffix = Math.floor(Math.random() * 10000);

    user = await User.create({
      username: `${baseUsername}_${randomSuffix}`,
      email: email,
      googleId: googleId,
      isVerified: true, // Google đã xác thực email này rồi
      role: "user", // Mặc định là user
      profile: {
        fullName: name,
        avatarUrl: picture,
      },
    });
  } else if (!user.googleId) {
    // Bổ sung: Nếu user đã đăng ký bằng Form (có email này) nhưng chưa liên kết Google
    // Thì cập nhật thêm googleId vào tài khoản đó luôn
    user.googleId = googleId;
    user.isVerified = true;
    await user.save();
  }

  // 4. Tạo JWT cho User (Dùng chung logic với đăng nhập thường)
  const tokenPayload = { id: user._id, role: user.role };

  const accessToken = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign(
    tokenPayload,
    process.env.REFRESH_SECRET || process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );

  let redirect_url = "/user/profile";
  if (user.role === "admin") {
    redirect_url = "/admin/profile";
  }

  return { accessToken, refreshToken, redirect_url };
};
module.exports = {
  loginUser,
  loginWithGoogle,
};
