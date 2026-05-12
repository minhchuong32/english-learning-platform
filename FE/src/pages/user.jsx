import { useState } from "react";
import { AuthShell } from "../components/layout/auth-shell.jsx";
import { ActionButton } from "../components/ui/action-button.jsx";
import { FormField } from "../components/ui/form-field.jsx";

function ProfilePage({ onNavigate }) {
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const updateField = (field) => (event) => {
    setProfile((current) => ({
      ...current,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <AuthShell title="Profile">
      <form className="form-stack" onSubmit={handleSubmit}>
        <FormField
          label="Họ và tên"
          type="text"
          value={profile.fullName}
          onChange={updateField("fullName")}
        />
        <FormField
          label="Email"
          type="email"
          value={profile.email}
          onChange={updateField("email")}
        />
        <FormField
          label="Mật khẩu"
          type="password"
          value={profile.password}
          onChange={updateField("password")}
        />

        <div className="form-actions">
          <ActionButton type="submit" fullWidth>
            Save
          </ActionButton>
          <ActionButton
            type="button"
            variant="secondary"
            fullWidth
            onClick={() => onNavigate("login")}
          >
            Logout
          </ActionButton>
        </div>
      </form>
    </AuthShell>
  );
}

export default ProfilePage;
