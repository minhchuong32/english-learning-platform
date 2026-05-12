const navItems = [
  { key: "login", label: "Login" },
  { key: "register", label: "Register" },
  { key: "forgot", label: "Forgot" },
  { key: "profile", label: "Profile" },
];

export function LearningHeader({ activeScreen, onNavigate }) {
  return (
    <header className="app-header">
      <nav className="nav-tabs" aria-label="Auth navigation">
        {navItems.map((item) => {
          const isActive = activeScreen === item.key;

          return (
            <button
              key={item.key}
              type="button"
              className={`nav-tab${isActive ? " nav-tab--active" : ""}`}
              onClick={() => onNavigate(item.key)}
            >
              {item.label}
            </button>
          );
        })}
      </nav>
    </header>
  );
}
