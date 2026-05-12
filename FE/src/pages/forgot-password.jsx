import { useState } from "react";
import { AuthShell } from "../components/layout/auth-shell.jsx";
import { ActionButton } from "../components/ui/action-button.jsx";
import { FormField } from "../components/ui/form-field.jsx";

function ForgotPasswordPage({ onNavigate }) {
  const [email, setEmail] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <AuthShell title="Forgot Password">
      <form className="form-stack" onSubmit={handleSubmit}>
        <FormField
          label="Email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <div className="form-actions">
          <ActionButton type="submit" fullWidth>
            Send
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

export default ForgotPasswordPage;
