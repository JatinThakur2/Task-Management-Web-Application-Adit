import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [theme, setTheme] = useState(
    () => localStorage.getItem('theme') || 'light'
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand">
          Task Manager
        </Link>
        <div className="navbar-actions">
          <button
            type="button"
            className="icon-btn"
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            title="Toggle theme"
          >
            {theme === 'light' ? 'Dark' : 'Light'}
          </button>
          {user && (
            <>
              <span className="navbar-user">Hi, {user.name}</span>
              <button type="button" className="btn btn-ghost" onClick={logout}>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
