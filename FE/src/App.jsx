import { useState } from "react";
import { useSelector } from "react-redux";
import { Provider } from "react-redux";
import store from "./store/index.js";
import { Navbar } from "./components/layout/Navbar.jsx";
import HomePage from "./pages/home.jsx";
import LoginPage from "./pages/login.jsx";
import RegisterPage from "./pages/register.jsx";
import ForgotPasswordPage from "./pages/forgot-password.jsx";
import ProfilePage from "./pages/user.jsx";

const PAGES = {
  home: HomePage,
  login: LoginPage,
  register: RegisterPage,
  forgot: ForgotPasswordPage,
  profile: ProfilePage,
};

// Pages that use their own full-page layout (no shared navbar)
const FULL_PAGE = new Set(["home", "login", "register", "forgot"]);

function AppContent() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [screen, setScreen] = useState(() =>
    isAuthenticated ? "home" : "login",
  );
  const ActivePage = PAGES[screen] ?? LoginPage;
  const showNavbar = screen === "profile";

  return (
    <div className="min-h-screen">
      {showNavbar && <Navbar currentPage={screen} onNavigate={setScreen} />}
      <ActivePage onNavigate={setScreen} />
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
