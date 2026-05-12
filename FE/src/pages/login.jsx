import { useState } from "react";
import { AuthShell } from "../components/layout/auth-shell.jsx";
import { ActionButton } from "../components/ui/action-button.jsx";
import { FormField } from "../components/ui/form-field.jsx";

function LoginPage({ onNavigate }) {
  const [form, setForm] = useState({
    identifier: "",
    password: "",
    remember: true,
  });

  const updateField = (field) => (event) => {
    const value =
      field === "remember" ? event.target.checked : event.target.value;

    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <AuthShell title="Login">
      <form className="form-stack" onSubmit={handleSubmit}>
        <FormField
          label="Email hoặc username"
          type="text"
          value={form.identifier}
          onChange={updateField("identifier")}
        />

        <FormField
          label="Mật khẩu"
          type="password"
          value={form.password}
          onChange={updateField("password")}
        />

        <label className="checkline">
          <input
            type="checkbox"
            checked={form.remember}
            onChange={updateField("remember")}
          />
          <span>Ghi nhớ</span>
        </label>

        <div className="form-actions">
          <ActionButton type="submit" fullWidth>
            Login
          </ActionButton>
        </div>

        <div className="inline-links">
          <button
            type="button"
            className="text-button"
            onClick={() => onNavigate("forgot")}
          >
            Forgot password
          </button>
          <button
            type="button"
            className="text-button"
            onClick={() => onNavigate("register")}
          >
            Register
          </button>
        </div>
      </form>
    </AuthShell>
  );
}

export default LoginPage;
