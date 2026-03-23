import { FiScissors, FiMapPin, FiPhone, FiClock, FiMail } from "react-icons/fi";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const [policy, setPolicy] = useState("");
  const [error, setError] = useState("");

  const to12HourFormat = (timeStr) => {
    if (!timeStr) return "";

    // Extract HH and MM
    const [hh, mm] = timeStr.split(":");
    let hour = parseInt(hh, 10);

    const ampm = hour >= 12 ? "PM" : "AM";

    // Convert hour from 24h → 12h format
    hour = hour % 12 || 12; // 0 becomes 12

    return `${hour}:${mm} ${ampm}`;
  };

  const API_BASE_URL = "https://nvsalonbackend.dockyardsoftware.com/";
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}api/AdminAuth/GetSalonSettings`
        );
        if (response == null) {
          setError("Booking policy is empty");
          return;
        }
        const data = await response.json();
        setPolicy(data);
      } catch (error) {
        console.error("Error in fetching booking policy" + error);
        setError(error);
      }
    };
    fetchSettings();
  }, []);

  return (
    <footer className="bg-gray-900 py-12 px-6 border-t border-gray-800">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <FiScissors className="text-purple-500 text-2xl" />
            <span className="text-xl font-bold">Booking Policy</span>
          </div>
          {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
          <p className="text-gray-400">
            {policy.BookingPolicy ||
              "Professional beauty services with a personal touch. Book your perfect look today."}
          </p>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2">
            <li>
              <a
                href="/#"
                className="text-gray-400 hover:text-purple-400 transition"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="/#services"
                className="text-gray-400 hover:text-purple-400 transition"
              >
                Services
              </a>
            </li>
            <li>
              <Link
                to="/#stylist"
                className="text-gray-400 hover:text-purple-400 transition"
              >
                Stylists
              </Link>
            </li>
            <li>
              <Link
                to="/#gallery"
                className="text-gray-400 hover:text-purple-400 transition"
              >
                Gallery
              </Link>
            </li>
            {/* <li><a href="contact" className="text-gray-400 hover:text-purple-400 transition">Contact</a></li> */}
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
          <ul className="space-y-3 text-gray-400">
            <li className="flex items-center">
              <FiMapPin className="mr-3 text-purple-400" />
              123 Beauty St, Salon City
            </li>
            <li className="flex items-center">
              <FiPhone className="mr-3 text-purple-400" />
              (555) 123-4567
            </li>
            <li className="flex items-center">
              <FiMail className="mr-3 text-purple-400" />
              info@elegance.com
            </li>
            <li className="flex items-center">
              <FiClock className="mr-3 text-purple-400" />
              Mon–Sat:&nbsp;
              {error ? (
                <span className="text-red-400 text-sm">{error}</span>
              ) : (
                <>
                  {to12HourFormat(policy.OpeningTime)} –{" "}
                  {to12HourFormat(policy.ClosingTime)}
                </>
              )}
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
          <div className="flex space-x-4 mb-6">
            <a
              href="#"
              className="text-gray-400 hover:text-purple-400 transition"
            >
              <FaFacebook size={20} />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-purple-400 transition"
            >
              <FaInstagram size={20} />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-purple-400 transition"
            >
              <FaTwitter size={20} />
            </a>
          </div>

          <h4 className="text-lg font-semibold mt-6 mb-4">Newsletter</h4>
          <div className="flex">
            <input
              type="email"
              placeholder="Your email"
              className="bg-gray-800 text-white px-4 py-2 rounded-l-lg focus:outline-none w-full"
            />
            <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-r-lg">
              Join
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-gray-800 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} Elegance Salon. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
