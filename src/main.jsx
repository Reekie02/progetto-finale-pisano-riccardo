import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { FavoritesProvider } from "./context/FavoritesContext.jsx";
import LayoutMain from "./layouts/LayoutMain.jsx";
import HomePage from "./pages/HomePage.jsx";
// import AboutPage from "./pages/AboutPage.jsx";
import GenreDetailPage from "./pages/GenreDetailPage.jsx";
import GameDetailPage from "./pages/GameDetailPage.jsx";
import GameChatPage from "./pages/GameChatPage.jsx";
import SearchPage from "./pages/SearchPage.jsx";
import AuthSignInPage from "./pages/AuthSignInPage.jsx";
import AuthSignUpPage from "./pages/AuthSignUpPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import FavoritesPage from "./pages/FavoritesPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import "./styles/global.css";
import ContactPage from "./pages/ContactPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LayoutMain />,
    children: [
      { index: true, element: <HomePage /> },
      // { path: "about", element: <AboutPage /> },
      { path: "genre/:genre", element: <GenreDetailPage /> },
      { path: "game/:id", element: <GameDetailPage /> },
      { path: "search", element: <SearchPage /> },
      { path: "auth/signin", element: <AuthSignInPage /> },
      { path: "auth/signup", element: <AuthSignUpPage /> },
      { path: "contact", element: <ContactPage /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: "profile", element: <ProfilePage /> },
          { path: "favorites", element: <FavoritesPage /> },
          { path: "game/:id/chat", element: <GameChatPage /> }, // 👈 per-gioco
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <FavoritesProvider>
        <RouterProvider router={router} />
      </FavoritesProvider>
    </AuthProvider>
  </React.StrictMode>
);