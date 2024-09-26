import { Link } from "react-router-dom";
import "./header.scss";
import "bootstrap/dist/js/bootstrap.bundle.min";

function Header() {
  const isLoggedIn = true; // This would be determined from your API
  const profileImageUrl = "/path/to/profile/image.jpg"; // Replace with the actual image URL from the API

  return (
    <nav className="navbar navbar-expand-sm navbar-custom bg-secondary">
      <div className="container-fluid">
        {/* Holidaze logo on the left */}
        <Link className="navbar-brand fs-3" to="/">
          Holidaze
        </Link>

        {/* Links in the center */}
        <div
          className="collapse navbar-collapse justify-content-center"
          id="navbarNav"
        >
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link fs-5 nav-link-custom" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fs-5 nav-link-custom" to="/explore">
                Explore
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fs-5 nav-link-custom" to="/about">
                About Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Sign Up/Login or Profile Image on the right */}
        <div className="auth-buttons">
          {isLoggedIn ? (
            <Link to="/profile">
              <img
                src={profileImageUrl}
                alt="Profile"
                className="profile-img rounded-circle"
              />
            </Link>
          ) : (
            <>
              <Link className="btn btn-outline-primary" to="/signup">
                Sign Up
              </Link>
              <Link className="btn btn-primary ms-2" to="/login">
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Header;
