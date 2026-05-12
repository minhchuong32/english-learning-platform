import { useState } from "react";
import { LearningHeader } from "./components/layout/header.jsx";
import ForgotPasswordPage from "./pages/forgot-password.jsx";
import LoginPage from "./pages/login.jsx";
import ProfilePage from "./pages/user.jsx";
import RegisterPage from "./pages/register.jsx";

const pages = {
  login: {
    label: "Login",
    component: LoginPage,
  },
  register: {
    label: "Register",
    component: RegisterPage,
  },
  forgot: {
    label: "Forgot Password",
    component: ForgotPasswordPage,
  },
  profile: {
    label: "Profile",
    component: ProfilePage,
  },
};

function App() {
  const [screen, setScreen] = useState("login");
  const ActivePage = pages[screen]?.component ?? LoginPage;

  return (
    <div className="app-shell">
      <LearningHeader
        activeScreen={screen}
        onNavigate={setScreen}
        pageLabel={pages[screen]?.label ?? "Login"}
      />

      <main className="app-main">
        <ActivePage onNavigate={setScreen} />
      </main>
    </div>
  );
}

export default App;
