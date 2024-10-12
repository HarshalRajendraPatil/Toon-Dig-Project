import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa"; // Social icons

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-purple-400 text-xl font-semibold mb-4">
              About ToonDig
            </h3>
            <p className="text-gray-400 text-sm">
              ToonDig is the ultimate destination for anime fans to explore,
              stream, and engage with the best anime content. Stay updated with
              the latest trends, episodes, and community discussions.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-purple-400 text-xl font-semibold mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="hover:text-purple-400">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-purple-400">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-purple-400">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-purple-400">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-purple-400">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Account Links */}
          <div>
            <h3 className="text-purple-400 text-xl font-semibold mb-4">
              Account
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/login" className="hover:text-purple-400">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-purple-400">
                  Sign Up
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-purple-400">
                  My Account
                </Link>
              </li>
              <li>
                <Link to="/subscriptions" className="hover:text-purple-400">
                  Subscription Plans
                </Link>
              </li>
              <li>
                <Link to="/support" className="hover:text-purple-400">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect Section */}
          <div>
            <h3 className="text-purple-400 text-xl font-semibold mb-4">
              Connect with Us
            </h3>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-purple-400"
              >
                <FaFacebook size={24} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-purple-400"
              >
                <FaTwitter size={24} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-purple-400"
              >
                <FaInstagram size={24} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-purple-400"
              >
                <FaYoutube size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-gray-700 my-8" />

        {/* Footer Bottom */}
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 ToonDig. All rights reserved.
          </p>
          <div className="mt-4 sm:mt-0">
            <Link
              to="/terms"
              className="text-gray-400 text-sm hover:text-purple-400 mx-2"
            >
              Terms of Service
            </Link>
            <Link
              to="/privacy"
              className="text-gray-400 text-sm hover:text-purple-400 mx-2"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
