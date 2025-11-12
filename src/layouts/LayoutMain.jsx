import { Outlet, Link, useNavigate } from "react-router-dom";
import SearchForm from "../components/SearchForm.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useState } from "react";
import '../styles/navbar.css'
import { Instagram, Linkedin, Twitter } from 'lucide-react';


export default function LayoutMain() {
    const { user, initializing, signOut, username } = useAuth();
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
            <header className="bg-[#151515] text-white p-4 px-4
                   flex md:flex-row
                   items-center gap-3
                   justify-between uppercase">
                <div className="flex items-center gap-6">
                    <h1 className="text-xl font-bold absolute left-10 top-5 md:static">
                        <Link to={'/'}>A·KAI</Link>
                    </h1>
                </div>


                <SearchForm />

                <div className="flex items-center gap-4">

                    {initializing ? (
                        <span className="text-sm opacity-80">...</span>
                    ) : user ? (
                        <div className="hidden md:flex items-center gap-5">
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
                                {username && username[0].toUpperCase()}
                            </Link>

                        </div>
                    ) : (
                        <div className="hidden md:flex items-center gap-2">
                            <Link to="/auth/signup" className="border border-green-700 px-3 py-1 rounded  text-sm">Sign Up</Link>
                            <Link to="/auth/signin" className="bg-green-700 text-white px-3 py-1 rounded text-sm">Sign In</Link>
                        </div>
                    )}
                </div>




                <div className='flex gap-5 items-end lg:hidden z-9999 absolute right-10 top-6'>



                    <button
                        className={`${isOpen ? 'hamburger open z-999' : 'hamburger'}`}
                        onClick={() => setIsOpen(!isOpen)}
                    >

                        <span className='ham-line'></span>
                        <span className='ham-line'></span>
                        <span className='ham-line'></span>
                        <span className='ham-line'></span>

                    </button>

                    <div className={`${isOpen && ' bg-[#eee] absolute right-5 top-1 rounded-lg ham-animation p-5 pt-10 flex items-center'}`}>

                        {/* <ul className={`${!isOpen ? 'hidden' : 'flex flex-col my-14 px-3 gap-7 h-full w-full'}`}> */}
                        <ul className={`${!isOpen ? 'hidden' : 'flex flex-col justify-between h-auto w-[200px] border rounded-lg p-5 bg-[#151515]'}`}>
                            {!user && (
                                <>
                                    <Link to="/auth/signup" className="border border-green-700 px-3 py-1 rounded text-[.7rem] w-22">Sign Up</Link>
                                    <Link to="/auth/signin" className="bg-green-700 text-white px-3 py-1 rounded text-[.7rem] w-22 mt-4">Sign In</Link>
                                </>
                            )}
                            {user && (
                                <div className="flex justify-between">

                                    <div className="text-[#eee] font-black flex flex-col gap-5 items-center h-auto w-[170px]">

                                        <Link
                                            to="/favorites"
                                            className="text-[.7rem] w-full mt-2 flex"
                                        >
                                            Favorites ⭐️
                                        </Link>

                                        <Link
                                            to="/"
                                            className="text-[.7rem] w-full "
                                        >
                                            Home 🏠
                                        </Link>
                                        <Link
                                            to="/contact"
                                            className="text-[.7rem] w-full "
                                        >
                                            Contatti 📞
                                        </Link>
                                    </div>

                                    <div className=" flex flex-col gap-3 ">

                                        <div className="flex flex-col items-center">
                                            <Link
                                                to="/profile"
                                                className='cursor-pointer rounded-full bg-custom w-7 h-7 flex justify-center items-center font-bold text-lg'
                                            >
                                                {username && username[0].toUpperCase()}
                                            </Link>
                                            <p className=" text-[.7rem] text-[#666]">Profile</p>
                                        </div>

                                        <div className="flex flex-col items-center">
                                            <div className=' flex flex-col gap-3'>
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

            <main className="flex-1 p-6">
                <Outlet />
            </main>


            <footer className="bg-[#151515] text-white">

                <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">

                    {/* Logo e descrizione */}
                    <div>
                        <h2 className="text-2xl font-bold tracking-wide mb-3 text-green-500">
                            A·KAI
                        </h2>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            Esplora, scopri e condividi la tua passione per i videogiochi.
                            Unisciti alla community e trova i titoli che amerai di più.
                        </p>
                    </div>

                    {/* Link utili */}
                    <div>
                        <h3 className="text-lg font-semibold mb-3 text-green-400">
                            Naviga
                        </h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link
                                    to="/"
                                    className="hover:text-green-300 transition-colors duration-200"
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/favorites"
                                    className="hover:text-green-300 transition-colors duration-200"
                                >
                                    Preferiti
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/contact"
                                    className="hover:text-green-300 transition-colors duration-200"
                                >
                                    Contatti
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Social o community */}
                    <div>
                        <h3 className="text-lg font-semibold mb-3 text-green-400">
                            Seguimi su
                        </h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a
                                    href="https://www.instagram.com/reekie02/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-green-300 transition-colors duration-200"
                                >
                                    <Instagram />
                                </a>
                            </li>

                            <li>
                                <a
                                    href="https://www.linkedin.com/in/riccardo-pisano-junior-frontend-developer/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-green-300 transition-colors duration-200"
                                >
                                    <Linkedin />
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>


                <div className="border-t border-green-500/20"></div>

                {/* Copyright */}
                <div className="text-center text-xs text-gray-400 py-4">
                    © {new Date().getFullYear()} A·KAI · Tutti i diritti riservati
                </div>
            </footer>       </div>
    );
}