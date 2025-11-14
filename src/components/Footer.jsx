import React from 'react'
import { Link } from 'react-router-dom'
import { Instagram, Linkedin, Twitter } from 'lucide-react';

const Footer = () => {
    return (
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
        </footer>
    )
}

export default Footer