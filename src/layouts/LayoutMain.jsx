import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";


export default function LayoutMain() {

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">

            <Navbar />

            <main className="flex-1 p-6">
                <Outlet />
            </main>

            <Footer />
        </div>

    );
}