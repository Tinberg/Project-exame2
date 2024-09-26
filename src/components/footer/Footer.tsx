import { Link } from "react-router-dom";
import "./footer.scss";
import {
  faFacebook,
  faPinterest,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Footer() {
  return (
    <footer className="footer bg-secondary text-center py-4 mt-auto">
      <div className="container-xxl">
        <div className="row">
          {/* Quick Links Section */}
          <div className="col-md-3">
            <p className="text-start fs-5">Quick Links</p>
            <ul className="list-unstyled text-start">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/venues">All Venues</Link>
              </li>
              <li>
                <Link to="/about">About</Link>
              </li>
            </ul>
          </div>
          {/* Terms and Privacy Section */}
          <div className="col-md-3">
            <p className="text-start fs-5">Terms and Privacy</p>
            <ul className="list-unstyled text-start">
              <li>
                <Link to="/privacy">Privacy Statement</Link>
              </li>
              <li>
                <Link to="/privacy-policy">Privacy in Holidaze</Link>
              </li>
              <li>
                <Link to="/privacy-settings">Privacy Settings</Link>
              </li>
            </ul>
          </div>
          {/* Get Help Section */}
          <div className="col-md-3">
            <p className="text-start fs-5">Get Help</p>
            <ul className="list-unstyled text-start">
              <li>Customer Service</li>
              <li>Safe Payment with Holidaze</li>
              <li>Terms of Use</li>
            </ul>
          </div>
          {/* Social Section */}
          <div className="col-12 col-md-3">
            <p className="text-start fs-5">Social</p>
            <ul className="list-unstyled d-flex flex-row justify-content-md-between">
              <li className="mb-4 mb-md-0">
                {" "}
                <Link
                  to="https://www.facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FontAwesomeIcon
                    icon={faFacebook}
                    style={{ color: "#1b115c" }}
                    size="3x"
                  />
                </Link>
              </li>
              <li className="mb-4 mb-md-0 mx-md-0 mx-4">
                {" "}
                <Link
                  to="https://www.pinterest.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FontAwesomeIcon
                    icon={faPinterest}
                    style={{ color: "#1b115c" }}
                    size="3x"
                  />
                </Link>
              </li>
              <li className="mb-4 mb-md-0">
                {" "}
                <Link
                  to="https://www.whatsapp.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FontAwesomeIcon
                    icon={faWhatsapp}
                    style={{ color: "#1b115c" }}
                    size="3x"
                  />
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-3">
          <p className="mb-0">&copy; 2024 Holidaze. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
