import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useFavorites } from "../context/FavoritesContext.jsx";
import SearchForm from "../components/SearchForm.jsx";
import icon from "../assets/favicon-02.png";
import "../styles/navbar.css";

const Navbar = () => {
    const navigate = useNavigate();
    const mobileMenuRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);

    const { user, initializing, signOut, username } = useAuth();
    const { favorites } = useFavorites();
    const favCount = favorites?.length ?? 0;

    const handleLogout = async () => {
        try {
            await signOut();
            navigate("/");
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header
            className="bg-[#151515] text-white p-4 px-4
                   flex md:flex-row
                   items-center gap-3
                   justify-between uppercase"
        >
            <div className="flex items-center gap-6">
                <h1 className="text-xl font-bold absolute left-10 top-5 md:static">
                    <Link to={"/"}>A·KAI</Link>
                </h1>
            </div>

            <SearchForm />

            <div className="flex items-center gap-4">
                {initializing ? (
                    <span className="text-sm opacity-80">...</span>
                ) : user ? (
                    <div className="hidden md:flex items-center gap-5">
                        {/* LINK FAVORITES + BADGE */}
                        <Link to="/favorites" className="relative text-sm z-10 py-1 px-2 rounded-lg">
                            Favorites
                            {favCount > 0 && (
                                <span
                                    className="absolute -top-2 -right-3
                             inline-flex items-center justify-center
                             text-[10px] font-semibold
                             rounded-full bg-green-500 text-white
                             w-5 h-5 border border-[#151515] z-[-1]"
                                >
                                    {favCount}
                                </span>
                            )}
                        </Link>

                        <Link
                            to="/profile"
                            className={`cursor-pointer flex justify-center items-center font-bold text-2xl ${username ? "bg-custom rounded-full w-10 h-10" : "w-13 h-13"
                                }`}
                        >
                            {(username && username[0].toUpperCase()) || <img src={icon} />}
                        </Link>
                    </div>
                ) : (
                    <div className="hidden md:flex items-center gap-2">
                        <Link
                            to="/auth/signup"
                            className="border border-green-700 px-3 py-1 rounded  text-sm"
                        >
                            Sign Up
                        </Link>
                        <Link
                            to="/auth/signin"
                            className="bg-green-700 text-white px-3 py-1 rounded text-sm"
                        >
                            Sign In
                        </Link>
                    </div>
                )}
            </div>

            {/* MOBILE MENU */}
            <div
                ref={mobileMenuRef}
                className="flex gap-5 items-end lg:hidden z-9999 absolute right-10 top-6"
            >
                <button
                    className={`${isOpen ? "hamburger open z-999" : "hamburger"}`}
                    onClick={() => setIsOpen((prev) => !prev)}
                >
                    <span className="ham-line"></span>
                    <span className="ham-line"></span>
                    <span className="ham-line"></span>
                    <span className="ham-line"></span>
                </button>

                <div
                    className={`${isOpen &&
                        " bg-[#eee] absolute right-5 top-1 rounded-lg ham-animation p-5 pt-10 flex items-center"
                        }`}
                >
                    <ul
                        className={`${!isOpen
                            ? "hidden"
                            : "flex flex-col justify-between h-auto w-[200px] border rounded-lg p-5 bg-[#151515]"
                            }`}
                    >
                        {!user && (
                            <>
                                <Link
                                    to="/auth/signup"
                                    className="border border-green-700 px-3 py-1 rounded text-[.7rem] w-22"
                                >
                                    Sign Up
                                </Link>
                                <Link
                                    to="/auth/signin"
                                    className="bg-green-700 text-white px-3 py-1 rounded text-[.7rem] w-22 mt-4"
                                >
                                    Sign In
                                </Link>
                            </>
                        )}

                        {user && (
                            <div className="flex justify-between">
                                <div className="text-[#eee] font-black flex flex-col gap-5 items-center h-auto w-[170px]">
                                    <Link
                                        to="/favorites"
                                        className="relative text-[.7rem] w-full mt-2 flex items-center gap-2"
                                    >
                                        Favorites ⭐️
                                    </Link>

                                    <Link to="/" className="text-[.7rem] w-full ">
                                        Home 🏠
                                    </Link>
                                    <Link to="/contact" className="text-[.7rem] w-full ">
                                        Contatti 📞
                                    </Link>
                                </div>

                                <div className=" flex flex-col gap-3 ">
                                    <div className="flex flex-col items-center">
                                        <Link
                                            to="/profile"
                                            className={`cursor-pointer flex justify-center items-center font-bold text-lg ${username
                                                ? "bg-custom rounded-full w-7 h-7"
                                                : "w-9 h-9"
                                                }`}
                                        >
                                            {(username && username[0].toUpperCase()) || (
                                                <img src={icon} />
                                            )}
                                        </Link>
                                        <p className=" text-[.7rem] text-[#666]">Profile</p>
                                    </div>

                                    <div className="flex flex-col items-center">
                                        <div className=" flex flex-col gap-3">
                                            <button
                                                onClick={handleLogout}
                                                className="bg-red-600 text-white cursor-pointer rounded-full bg-custom2 w-7 h-7 flex justify-center items-center font-bold text-lg"
                                            >
                                                <i className="bi bi-box-arrow-right"></i>
                                            </button>
                                        </div>
                                        <p className="text-[#666] text-[.7rem]">Logout</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </ul>
                </div>
            </div>
        </header>
    );
};

export default Navbar;