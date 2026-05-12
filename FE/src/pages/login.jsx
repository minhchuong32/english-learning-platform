import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser, clearMessages } from "../store/authSlice.js";
import { AuthLayout } from "../components/layout/AuthLayout.jsx";
import {
  InputField,
  Button,
  Alert,
  AuthCard,
} from "../components/ui/index.jsx";

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, successMsg } = useSelector((state) => state.auth);
  const [form, setForm] = useState({
    identifier: "",
    password: "",
    remember: true,
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const updateField = (field) => (event) => {
    const value =
      field === "remember" ? event.target.checked : event.target.value;

    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: "" }));
    }

    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = {};
    const identifier = form.identifier.trim();
    const password = form.password;

    if (!identifier || !password) {
      if (!identifier)
        nextErrors.identifier = "Vui lòng nhập email hoặc username.";
      if (!password) nextErrors.password = "Vui lòng nhập mật khẩu.";
      setErrors(nextErrors);
      return;
    }

    dispatch(loginUser({ identifier, password }))
      .unwrap()
      .then((response) => {
        window.alert(response?.message || "Đăng nhập thành công.");
        navigate("/home", { replace: true });
      })
      .catch(() => {});
  };

  return (
    <AuthLayout>
      <AuthCard>
        <div className="mb-6">
          <h1 className="font-display text-2xl md:text-3xl font-bold text-gray-900">
            Chào mừng trở lại 👋
          </h1>
          <p className="mt-1 text-gray-500 text-sm">
            Đăng nhập để tiếp tục hành trình học tiếng Anh.
          </p>
        </div>

        {error ? (
          <div className="mb-4">
            <Alert
              type="error"
              message={error}
              onClose={() => dispatch(clearMessages())}
            />
          </div>
        ) : null}
        {successMsg ? (
          <div className="mb-4">
            <Alert type="success" message={successMsg} />
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <InputField
            label="Email hoặc Username"
            type="text"
            placeholder="example@email.com hoặc username"
            value={form.identifier}
            onChange={updateField("identifier")}
            error={errors.identifier}
            autoComplete="username"
            autoFocus
          />

          <InputField
            label="Mật khẩu"
            type={showPassword ? "text" : "password"}
            placeholder="Nhập mật khẩu..."
            value={form.password}
            onChange={updateField("password")}
            error={errors.password}
            autoComplete="current-password"
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            }
          />

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 accent-brand-600"
                checked={form.remember}
                onChange={updateField("remember")}
              />
              <span className="text-sm text-gray-600">Ghi nhớ</span>
            </label>
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-sm text-brand-600 hover:text-brand-700 font-medium"
            >
              Quên mật khẩu?
            </button>
          </div>

          <Button type="submit" loading={loading} className="mt-2">
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Chưa có tài khoản?{" "}
          <button
            onClick={() => navigate("/register")}
            className="text-brand-600 font-semibold hover:text-brand-700"
          >
            Đăng ký miễn phí
          </button>
        </p>
      </AuthCard>
    </AuthLayout>
  );
}

export default LoginPage;
