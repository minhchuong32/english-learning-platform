const authService = require("../services/authService");
const getLogin = (req, res) => {
  return res.render("login.ejs");
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
};
