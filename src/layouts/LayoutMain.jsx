import { Outlet, Link, useNavigate } from "react-router-dom";
import SearchForm from "../components/SearchForm.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useState } from "react";
import '../styles/navbar.css'

export default function LayoutMain() {
    const { user, initializing, signOut, profileUsername } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut();
            navigate("/");
        } catch (e) {
            console.error(e);
        }
    };

    const [isOpen, setIsOpen] = useState(false)
    // const [isOpen2, setIsOpen2] = useState(false)

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-[#151515] text-white p-4 px-10 flex flex-col lg:flex-row items-center gap-3 lg:gap-4 justify-between uppercase">
                <div className="flex items-center gap-6">
                    <h1 className="text-xl font-bold absolute left-10 top-8 lg:static">
                        <Link to={'/'}>A·KAI</Link>
                    </h1>

                </div>


                <SearchForm />

                <div className="flex items-center gap-4">

                    {initializing ? (
                        <span className="text-sm opacity-80">...</span>
                    ) : user ? (
                        <div className="hidden lg:flex items-center gap-5">
                            <Link
                                to="/favorites"
                                className="text-sm"
                            >
                                Favorites
                            </Link>

                            <Link
                                to="/profile"
                                className='cursor-pointer rounded-full bg-custom w-10 h-10 flex justify-center items-center font-bold text-2xl'
                            >
                                {profileUsername && profileUsername[0].toUpperCase()}
                            </Link>

                        </div>
                    ) : (
                        <div className="hidden lg:flex items-center gap-2">
                            <Link to="/auth/signup" className="border border-green-700 px-3 py-1 rounded  text-sm">Sign Up</Link>
                            <Link to="/auth/signin" className="bg-green-700 text-white px-3 py-1 rounded text-sm">Sign In</Link>
                        </div>
                    )}
                </div>




                <div className='flex gap-5 items-end lg:hidden z-9999 absolute right-10 top-8'>



                    <button
                        className={`${isOpen ? 'hamburger open z-999' : 'hamburger'}`}
                        onClick={() => setIsOpen(!isOpen)}
                    >

                        <span className='ham-line'></span>
                        <span className='ham-line'></span>
                        <span className='ham-line'></span>
                        <span className='ham-line'></span>

                    </button>

                    <div className={`${isOpen && 'h-[170px] bg-[#eee] w-[280px] absolute right-8 top-1 rounded-lg ham-animation pl-5'}`}>

                        <ul className={`${!isOpen ? 'hidden' : 'flex flex-col my-14 px-3 gap-7 h-full w-full'}`}>
                            {!user && (
                                <>
                                    <Link to="/auth/signup" className="border text-[#151515] border-green-700 px-3 py-1 rounded text-sm w-22">Sign Up</Link>
                                    <Link to="/auth/signin" className="bg-green-700 text-white px-3 py-1 rounded text-sm w-22">Sign In</Link>
                                </>
                            )}
                            {user && (
                                <div className="flex justify-between">

                                    <div className="text-[#242424] font-black flex flex-col gap-5 items-center">

                                        <Link
                                            to="/favorites"
                                            className="text-sm w-full mt-2 "
                                        >
                                            Favorites ⭐︎
                                        </Link>

                                        <Link
                                            to="/"
                                            className="text-sm w-full "
                                        >
                                            Home 🏠
                                        </Link>
                                    </div>

                                    <div className=" flex flex-col gap-6 ">

                                        <div className="flex flex-col items-center">
                                            <Link
                                                to="/profile"
                                                className='cursor-pointer rounded-full bg-custom w-10 h-10 flex justify-center items-center font-bold text-2xl'
                                            >
                                                {profileUsername && profileUsername[0].toUpperCase()}
                                            </Link>
                                            <p className=" text-sm text-[#666]">Profile</p>
                                        </div>

                                        <div className="flex flex-col items-center">
                                            <div className=' flex flex-col gap-3'>
                                                {/* <Link to={'/auth/account'} className="text-md italic text-gray-900 opacity-90">
                                            {profileUsername}
                                        </Link> */}
                                                <button
                                                    onClick={handleLogout}
                                                    className="bg-red-600 text-white cursor-pointer rounded-full bg-custom2 w-10 h-10 flex justify-center items-center font-bold text-2xl"
                                                >
                                                    <i className="bi bi-box-arrow-right"></i>
                                                </button>
                                            </div>
                                            <p className="text-[#666] text-sm">Logout</p>
                                        </div>

                                    </div>



                                </div>
                            )}
                        </ul>




                    </div>
                </div>
            </header>

            <main className="flex-1 p-6">
                <Outlet />
            </main>

            {/* <footer className="bg-green-700 text-white text-center p-3 text-sm">
                © 2025 A·KAI
            </footer> */}
            <footer className=" bg-[#151515] text-white ">
                <div className="max-w-5xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* Logo + nome */}
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-xl tracking-wide">A·KAI</span>

                    </div>

                    {/* Link footer */}
                    <div className="flex gap-6 text-sm">
                        <Link
                            to={"/"}
                            className="hover:text-green-200 transition-colors"
                        >
                            Home
                        </Link>

                        <Link
                            to={"/contact"}
                            className="hover:text-green-200 transition-colors"
                        >
                            Contact
                        </Link>
                    </div>
                </div>


                <div className="border-t border-green-500/30 text-center py-3 text-xs text-green-100">
                    © {new Date().getFullYear()} A·KAI · All rights reserved
                </div>
            </footer>
        </div>
    );
}