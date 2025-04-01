import { Link, NavLink } from "react-router-dom";
import { ModeToggle } from "../Theme/ModeToggle";
import { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { googleLogout } from "@react-oauth/google";
import { FaUserAlt } from "react-icons/fa";
import { useAuth } from "@/Context/AuthContext";
import { IoAddCircle } from "react-icons/io5";
import { FaSuitcase } from "react-icons/fa";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 1024);
  const [scrolled, setScrolled] = useState(false);
  const { user, setUser } = useAuth();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth < 1024);
    const handleScroll = () => setScrolled(window.scrollY > 20);

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`w-full font-serif sticky top-0 z-20 transition-all duration-300 ${
        scrolled
          ? "shadow-lg backdrop-blur-md bg-background/90 border-b border-neutral-200 dark:border-neutral-800"
          : "bg-background border-b-2 border-neutral-600"
      }`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/10 to-indigo-50/10 dark:from-blue-950/20 dark:to-indigo-950/20 z-0"></div>
      <nav className="container px-2 lg:px-6 py-2 relative z-10">
        <div className="flex flex-wrap justify-between items-center mx-auto">
          <Link
            to="/"
            className="flex items-center gap-2 group"
            onClick={closeMenu}
          >
            <div className="overflow-hidden rounded-lg transition-all shadow-md hover:shadow-xl">
              <img
                src="/travelMate.png"
                className="h-14 rounded-lg transform transition duration-300 group-hover:scale-105"
                alt="TravelMate Logo"
              />
            </div>
            {/* <span className="font-bold text-xl hidden md:block text-blue-700 dark:text-customGreen opacity-0 md:opacity-100 transition-opacity">
              TravelMate
            </span> */}
          </Link>

          <button
            onClick={toggleMenu}
            className="lg:hidden p-2 rounded-md focus:outline focus:ring-2 focus:ring-offset-1 focus:ring-blue-700 dark:focus:ring-customGreen dark:text-customGreen text-blue-700 hover:bg-blue-100 dark:hover:bg-customGreen/10 transition-colors"
            aria-label="Toggle navigation menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16m-7 6h7" />
              )}
            </svg>
          </button>

          <div
            className={`${
              isOpen ? "block" : "hidden"
            } w-full lg:flex lg:w-auto lg:items-center transition-all duration-300 ease-in-out`}
          >
            <ul className="flex flex-col mt-4 lg:mt-0 font-medium lg:flex-row lg:space-x-6 lg:ml-auto text-right">
              {user ? (
                <>
                  <li className="mb-2 lg:mb-0">
                    <NavLink
                      to="/my-trips"
                      className={({ isActive }) =>
                        `flex items-center gap-2 py-2 px-3 rounded-md transition-all duration-200 ${
                          isActive
                            ? "bg-blue-100 dark:bg-customGreen/20 text-blue-700 dark:text-customGreen font-bold"
                            : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`
                      }
                      onClick={closeMenu}
                    >
                      {({ isActive }) => (
                        <>
                          <FaSuitcase
                            className={
                              isActive
                                ? "text-blue-700 dark:text-customGreen"
                                : "text-gray-500 dark:text-gray-400"
                            }
                          />
                          <span>My Trips</span>
                        </>
                      )}
                    </NavLink>
                  </li>
                  <li className="mb-2 lg:mb-0">
                    <NavLink
                      to="/create-trip"
                      className={({ isActive }) =>
                        `flex items-center gap-2 py-2 px-3 rounded-md transition-all duration-200 ${
                          isActive
                            ? "bg-blue-100 dark:bg-customGreen/20 text-blue-700 dark:text-customGreen font-bold"
                            : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`
                      }
                      onClick={closeMenu}
                    >
                      {({ isActive }) => (
                        <>
                          <IoAddCircle
                            className={`text-lg ${
                              isActive
                                ? "text-blue-700 dark:text-customGreen"
                                : "text-gray-500 dark:text-gray-400"
                            }`}
                          />
                          <span>Create Trip</span>
                        </>
                      )}
                    </NavLink>
                  </li>
                  <li className="mb-2 lg:mb-0 lg:ml-2">
                    <Popover>
                      <PopoverTrigger className="flex items-center justify-end lg:justify-center">
                        <div className="rounded-full p-1 hover:ring-2 hover:ring-blue-300 dark:hover:ring-customGreen/40 transition-all">
                          {user.picture ? (
                            <img
                              src={user.picture}
                              alt="User profile"
                              className="h-9 w-9 rounded-full object-cover shadow-sm hover:shadow-md transition-shadow"
                            />
                          ) : (
                            <div className="h-9 w-9 rounded-full bg-blue-100 dark:bg-gray-700 flex items-center justify-center shadow-sm hover:shadow-md transition-shadow">
                              <FaUserAlt className="h-4 w-4 text-blue-700 dark:text-customGreen" />
                            </div>
                          )}
                        </div>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-48 p-0 overflow-hidden"
                        side={isSmallScreen ? "left" : "bottom"}
                        sideOffset={10}
                      >
                        <div className="p-3 bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700">
                          <p className="text-sm font-medium truncate">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {user.email}
                          </p>
                        </div>
                        <div className="p-2">
                          <Link
                            to="/"
                            onClick={() => {
                              googleLogout();
                              setUser(null);
                              closeMenu();
                            }}
                            className="flex items-center gap-2 w-full p-2 text-sm text-left text-red-600 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414l-5-5H3zm10 2.414L15.414 7H13V5.414z"
                                clipRule="evenodd"
                              />
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span>Logout</span>
                          </Link>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </li>
                </>
              ) : null}
              <li className="flex justify-end lg:justify-center items-center">
                <div className="mr-2 lg:mr-0">
                  <ModeToggle />
                </div>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
