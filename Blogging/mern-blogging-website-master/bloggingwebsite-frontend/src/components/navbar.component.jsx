import React, { useState, useEffect, useCallback, useContext } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import fulllogo from "../imgs/full-logo.png";
import logo from "../imgs/logo.png";
import { UserContext } from "../App";
import "../index.css";
import { Search } from "lucide-react"; // Import Search
import { motion, AnimatePresence } from "framer-motion";
import axios from 'axios';

// Utility function (assuming this is available or you can define it)
const removeFromSession = (key) => {
    if (typeof window !== 'undefined') {
        sessionStorage.removeItem(key);
    }
};

// Define AnimationWrapper component here, or in a separate file and import it
const AnimationWrapper = ({ children, className, ...props }) => {
    return (
        <motion.div
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    );
};

const UserNavigationPanel = () => {
    const { userAuth, setUserAuth } = useContext(UserContext);
    const navigate = useNavigate();

    const signOutUser = () => {
        removeFromSession("user");
        setUserAuth({ access_token: null, username: null, profile_img: null }); // Clear user data
        navigate('/'); // Redirect to home or login page
    };

    if (!userAuth) {
        return null; // Or some loading/error state
    }

    return (
        <AnimationWrapper
            className="absolute right-0 z-50"
            transition={{ duration: 0.2 }}
        >
            <div className="bg-white absolute right-0 border border-grey w-60 duration-200">

                <Link to="/editor" className="flex gap-2 link md:hidden pl-8 py-4" >
                    <i className="fi fi-rr-file-edit"></i>
                    <p>Write</p>
                </Link>
                {/* <Link to={`/user/${userAuth.username}`} className="link pl-8 py-4">
                    Profile
                </Link>
                <Link to="/dashboard/blogs" className="link pl-8 py-4">
                    Dashboard
                </Link> */}
                <Link to="/setting" className="link pl-8 py-4">
                    Settings
                </Link>
                <span className="absolute border-t border-grey  w-[100%]">

                </span>
                <button className="text-left p-4 hover:bg-grey w-full pl-8 py-4"
                    onClick={signOutUser}>
                    <h1 className="font-bold text-xl mg-1">
                        Sign Out
                        <p className="text-dark-grey">@{userAuth.username}</p>
                    </h1>

                </button>

            </div>
        </AnimationWrapper>
    );
};

const Navbar = () => {
    const [searchBoxVisibility, setSearchBoxVisibility] = useState(false);
    const { userAuth, setUserAuth } = useContext(UserContext);  // Destructure setUserAuth
    const [userNavPanel, setUserNavPanel] = useState(false);
    const [prevScrollPos, setPrevScrollPos] = useState(0);
    const [visible, setVisible] = useState(true);
    const [showFullLogo, setShowFullLogo] = useState(true);
    const [fadeFullLogo, setFadeFullLogo] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const navigate = useNavigate();
    const [avatarUrl, setAvatarUrl] = useState(null); // State for avatar URL


    useEffect(() => {
        if (userAuth?.profile_img) {
            setAvatarUrl(userAuth.profile_img);
        }
    }, [userAuth?.profile_img]);

    const handleUserNavPanel = () => {
        setUserNavPanel((currentVal) => !currentVal);
    };

    const handleBlur = () => {
        setTimeout(() => {
            setUserNavPanel(false);
        }, 200);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setFadeFullLogo(false);
            setTimeout(() => {
                setShowFullLogo(false);
            }, 500);
        }, 4000);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollPos = window.pageYOffset;

            // Only show Navbar if scrolling up
            if (currentScrollPos < prevScrollPos) {
                setVisible(true); // Scrolling up: show Navbar
            } else {
                setVisible(false); // Scrolling down: hide Navbar
            }

            setPrevScrollPos(currentScrollPos);
        };

        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, [prevScrollPos]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    //Debounce Function
    const debounce = useCallback(
        (func, delay) => {
            let timeoutId;
            return (...args) => {
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }
                timeoutId = setTimeout(() => {
                    func(...args);
                }, delay);
            };
        },
        []
    );

    const fetchSearchResults = useCallback(
        debounce((query) => {
            if (!query) {
                setSearchResults([]);
                return;
            }
            axios
                .get(`${import.meta.env.VITE_SERVER_DOMAIN}/search?query=${query}`) //  search endpoint on your server
                .then((response) => {
                    setSearchResults(response.data.results); // Adjust based on your server response
                })
                .catch((error) => {
                    console.error("Search error:", error);
                    setSearchResults([]);
                });
        }, 300),
        []
    );

    useEffect(() => {
        fetchSearchResults(searchQuery);
    }, [searchQuery, fetchSearchResults]);

    const handleSearchSelect = (userId) => {
        navigate(`/user/${userId}`); //  user profile page
        setSearchQuery('');             // Clear the query
        setSearchResults([]);           // Clear results
    };

    return (
        <>
            <nav
                className={`navbar bg-[#2d3d4c] rounded-full mt-1.5 mb-0 p-6 transition-transform duration-300 ease-in-out ${
                    visible ? "translate-y-0" : "-translate-y-full"
                    }`}
                style={{
                    opacity: 0.89,
                    position: "fixed", // Keep it fixed at the top
                    top: 0,
                    left: 0,
                    width: "100%",
                    zIndex: 1000, // Ensure it's on top
                    minHeight: "6.4rem" // Add a minimum height to ensure it doesn't shrink

                }}
            >
                <Link to="/" className="flex-none w-17 rounded-full">
                    {showFullLogo ? (
                        <img
                            src={fulllogo}
                            className={`w-full h-14 transition-opacity duration-500 ${
                                fadeFullLogo ? "opacity-100" : "opacity-0"
                                }`}
                            alt="full logo"
                        />
                    ) : (
                        <img src={logo} className="w-full h-14" alt="logo" />
                    )}
                </Link>

                <div
                    className={
                        "absolute bg-[#2d3d4c] wfull left-0 top-full mt-1.5 rounded-full border-b border-grey py-2 px-[1vw] md:border-0 md:block md:relative md:inset-0 md:p-0 md:w-auto md:show " +
                        (searchBoxVisibility ? "show" : "hide")
                    }
                >
                    <div className="relative ">
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="w-full md:w-auto pr-10 bg-grey p-4 pl-6 pr-[12%] md:pr-6 rounded-full placeholder:text-dark-grey md:pl-12"
                        />
                        <Search className="absolute right-3 top-3.5 h-6 w-6 text-gray-500" />
                        <AnimatePresence>
                            {searchQuery && searchResults.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute z-10 w-full mt-2 bg-white border border-black rounded-md shadow-lg"
                                >
                                    {searchResults.map((user) => (
                                        <div
                                            key={user.user_id}
                                            className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                                            onClick={() => handleSearchSelect(user.user_id)}
                                        >
                                            {/* Display a default avatar if profile_picture is not available */}
                                            {user.profile_picture ? (
                                                <img
                                                    src={user.profile_picture}
                                                    alt={user.username}
                                                    className="mr-2 h-8 w-8 rounded-full"
                                                />
                                            ) : (
                                                <div className="mr-2 h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                                                    {/* Display the first two letters of the username as a fallback */}
                                                    {user.username.substring(0, 2)}
                                                </div>
                                            )}
                                            <span>{user.username}</span>
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                        {searchQuery && searchResults.length === 0 && (
                            <div className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-md shadow-lg">
                                <div className="p-2 text-gray-500">No users found.</div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-3 md:gap-6 ml-auto">
                    <button
                        className="md:hidden bg-grey w-12 h-12 rounded-full flex items-center justify-center"
                        onClick={() => setSearchBoxVisibility((currentVal) => !currentVal)}
                    >
                        <i className="fi fi-rr-search text-xl"></i>
                    </button>
                    <Link to="/editor" className=" bg-[#2ecc40] py-3 pr-7 rounded-full hidden md:flex gap-5 link">
                        <i className="fi fi-rr-file-edit"></i>
                        <p>Write</p>
                    </Link>
                    {userAuth?.access_token ? (
                        <>
                            <Link to="/dashborad/notification">
                                <button className="w-12 h-12 rounded-full bg-[#ffffff] relative hover:bg-white/50">
                                    <i className="fi fi-rr-bell text-2xl block mt-1"></i>
                                </button>
                            </Link>
                            <div className="relative" onClick={handleUserNavPanel} onBlur={handleBlur}>
                                <button className="w-12 h-12 mt-1">
                                    {/* Display a default avatar if profile_img is not available */}
                                    {avatarUrl ? (
                                        <img
                                            src={avatarUrl}
                                            className="w-full h-full object-cover rounded-full"
                                            alt="profile"
                                        />
                                    ) : (
                                        <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center">
                                            {/* Display the first two letters of the username as a fallback */}
                                            {userAuth?.username?.substring(0, 2)}
                                        </div>
                                    )}
                                </button>
                                {userNavPanel ? <UserNavigationPanel /> : null}
                            </div>
                        </>
                    ) : (
                        <>
                            <Link className="btn-light py-3 " to="/signin">
                                Sign In
                            </Link>
                            <Link className="btn-light py-3 hidden md:block " to="/signup">
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </nav>
            <Outlet />
        </>
    );
};

export default Navbar;
