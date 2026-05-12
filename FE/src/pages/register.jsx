import { useState } from "react";
import { AuthShell } from "../components/layout/auth-shell.jsx";
import { ActionButton } from "../components/ui/action-button.jsx";
import { FormField } from "../components/ui/form-field.jsx";

function RegisterPage({ onNavigate }) {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const updateField = (field) => (event) => {
    setForm((current) => ({
      ...current,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <AuthShell title="Register">
      <form className="form-stack" onSubmit={handleSubmit}>
        <FormField
          label="Họ và tên"
          type="text"
          value={form.fullName}
          onChange={updateField("fullName")}
        />

        <FormField
          label="Email"
          type="email"
          value={form.email}
          onChange={updateField("email")}
        />

        <FormField
          label="Mật khẩu"
          type="password"
          value={form.password}
          onChange={updateField("password")}
        />

        <FormField
          label="Xác nhận mật khẩu"
          type="password"
          value={form.confirmPassword}
          onChange={updateField("confirmPassword")}
        />

        <div className="form-actions">
          <ActionButton type="submit" fullWidth>
            Register
          </ActionButton>
          <ActionButton
            type="button"
            variant="secondary"
            fullWidth
            onClick={() => onNavigate("login")}
          >
            Login
          </ActionButton>
        </div>
      </form>
    </AuthShell>
  );
}

export default RegisterPage;
