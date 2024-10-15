// import { useContext } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { UserContext } from "../../contexts/UserContext";
// import { clearAuthData } from "../../services/api";
// import "./header.scss";
// import "bootstrap/dist/js/bootstrap.bundle.min";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faUser, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

// // Header component with navigation links, user profile dropdown, and logout functionality.
// function Header() {
//   const { user, setUser } = useContext(UserContext)!;
//   const isLoggedIn = !!user.accessToken;
//   const userName = user.userName;
//   const avatarUrl = user.avatarUrl || "/path/to/default/avatar.jpg";
//   const navigate = useNavigate();

//   //Logout function
//   const handleLogout = () => {
//     clearAuthData();
//     setUser({
//       accessToken: null,
//       userName: null,
//       avatarUrl: null,
//     });
//     navigate("/");
//   };

//   return (
//     <nav className="navbar navbar-expand-sm navbar-custom bg-secondary fixed-top">
//       <div className="container-fluid">
//         {/* Logo */}
//         <Link className="navbar-brand fs-4" to="/">
//           Holidaze
//         </Link>

//         {/* Toggler button */}
//         <button
//           className="navbar-toggler ms-auto"
//           type="button"
//           data-bs-toggle="collapse"
//           data-bs-target="#navbarNavContent"
//           aria-controls="navbarNavContent"
//           aria-expanded="false"
//           aria-label="Toggle navigation"
//         >
//           <span className="navbar-toggler-icon"></span>
//         </button>

//         {/* Navbar */}
//         <div className="collapse navbar-collapse" id="navbarNavContent">
//           {/* Navigation links center */}
//           <ul className="navbar-nav mx-auto">
//             <li className="nav-item">
//               <Link className="nav-link nav-link-custom" to="/">
//                 Home
//               </Link>
//             </li>
//             <li className="nav-item">
//               <Link className="nav-link nav-link-custom" to="/explore">
//                 Explore
//               </Link>
//             </li>
//             <li className="nav-item">
//               <Link className="nav-link nav-link-custom" to="/about">
//                 About Us
//               </Link>
//             </li>
//           </ul>

//           {/* Authentication buttons */}
//           <div className="auth-buttons d-flex align-items-center justify-content-center justify-content-sm-end">
//             {isLoggedIn ? (
//               <div className="dropdown">
//                 <button
//                   className="dropdown-toggle d-flex align-items-center bg-secondary border-0"
//                   type="button"
//                   id="dropdownMenuLink"
//                   data-bs-toggle="dropdown"
//                   aria-expanded="false"
//                 >
//                   <span className="me-2 user-name">{userName}</span>
//                   <div className="position-relative">
//                     <img
//                       src={avatarUrl}
//                       alt={userName || "Profile"}
//                       className="header-img rounded-circle"
//                     />
//                   </div>
//                 </button>
//                 <ul
//                   className="dropdown-menu dropdown-menu-end dropdown-menu-sm-start"
//                   aria-labelledby="dropdownMenuLink"
//                 >
//                   <li>
//                     <Link className="dropdown-item" to="/myProfile">
//                       <FontAwesomeIcon icon={faUser} className="me-2" />
//                       Go to Profile
//                     </Link>
//                   </li>
//                   <li>
//                     <button className="dropdown-item" onClick={handleLogout}>
//                       <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
//                       Log Out
//                     </button>
//                   </li>
//                 </ul>
//               </div>
//             ) : (
//               <div className="d-flex align-items-center">
//                 <Link className="me-2" to="/register">
//                   Sign Up
//                 </Link>
//                 <span className="mx-2">Or</span>
//                 <Link
//                   className="btn btn-primary ms-2 text-light"
//                   to="/login"
//                 >
//                   Login
//                 </Link>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// }

// export default Header;


import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSearchProfiles } from "../../hooks/useProfiles";
import { useSearchVenues } from "../../hooks/useVenues";
import { UserContext } from "../../contexts/UserContext";
import { clearAuthData } from "../../services/api";
import "./header.scss";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faSignOutAlt, faSearch } from "@fortawesome/free-solid-svg-icons";

function Header() {
  const { user, setUser } = useContext(UserContext)!;
  const isLoggedIn = !!user.accessToken;
  const userName = user.userName;
  const avatarUrl = user.avatarUrl || "/path/to/default/avatar.jpg";
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // Hooks for searching
  const { data: profileResults } = useSearchProfiles(searchQuery);
  const { data: venueResults } = useSearchVenues(searchQuery);

  // Logout function
  const handleLogout = () => {
    clearAuthData();
    setUser({
      accessToken: null,
      userName: null,
      avatarUrl: null,
    });
    navigate("/");
  };

  // Navigate to venue or profile based on type and ID
  const handleResultClick = (type: "venue" | "profile", id: string) => {
    navigate(type === "venue" ? `/venueDetails/${id}` : `/profile/${id}`);
  };

  return (
    <nav className="navbar navbar-expand-sm navbar-custom bg-secondary fixed-top">
      <div className="container-fluid">
        <Link className="navbar-brand fs-4" to="/">
          Holidaze
        </Link>

        <button
          className="navbar-toggler ms-auto"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavContent"
          aria-controls="navbarNavContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNavContent">
          <ul className="navbar-nav mx-auto">
            <li className="nav-item">
              <Link className="nav-link nav-link-custom" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link nav-link-custom" to="/explore">
                Explore
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link nav-link-custom" to="/about">
                About Us
              </Link>
            </li>
          </ul>

          <div className="auth-buttons d-flex align-items-center">
            {isLoggedIn ? (
              <div className="dropdown">
                <button
                  className="dropdown-toggle d-flex align-items-center bg-secondary border-0"
                  type="button"
                  id="dropdownMenuLink"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <span className="me-2 user-name">{userName}</span>
                  <img
                    src={avatarUrl}
                    alt={userName || "Profile"}
                    className="header-img rounded-circle"
                  />
                </button>
                <ul
                  className="dropdown-menu dropdown-menu-end dropdown-menu-sm-start"
                  aria-labelledby="dropdownMenuLink"
                >
                  <li>
                    <Link className="dropdown-item" to="/myProfile">
                      <FontAwesomeIcon icon={faUser} className="me-2" />
                      Go to Profile
                    </Link>
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={handleLogout}>
                      <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
                      Log Out
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex align-items-center">
                <Link className="me-2" to="/register">
                  Sign Up
                </Link>
                <span className="mx-2">Or</span>
                <Link className="btn btn-primary ms-2 text-light" to="/login">
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;
