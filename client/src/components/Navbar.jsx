import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => (location.pathname === path ? 'active' : '');
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <nav>
      <div className="container nav-content">
        <Link to="/" className="logo">
          Food<span>Express</span>
        </Link>
        <div className="nav-links">
          <Link
            to="/restaurants"
            className={`nav-link ${isActive('/restaurants')}`}
          >
            Restaurants
          </Link>
          <Link
            to="/add-restaurant"
            className={`nav-link ${isActive('/add-restaurant')}`}
          >
            Add Restaurant
          </Link>

          <div
            style={{
              width: '1px',
              height: '24px',
              background: '#e0e0e0',
              margin: '0 8px',
            }}
          />

          {token ? (
            <>
              <Link to="/account" className="nav-link">
                My Account
              </Link>
              <button
                onClick={handleLogout}
                className="nav-link"
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="nav-link"
                style={{ background: '#f6f6f6' }}
              >
                Log in
              </Link>
              <Link to="/register" className="nav-link btn-primary">
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
