// src/components/layout/FeminineLayout.tsx
import React, { type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";

interface FeminineLayoutProps {
  children: ReactNode;
  showBackButton?: boolean;
  backUrl?: string;
  title?: string;
}

const FeminineLayout: React.FC<FeminineLayoutProps> = ({
  children,
  showBackButton = true,
  backUrl = "/",
  title,
}) => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <div className="min-h-screen min-w-[98vw] bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50">
      {/* Decorative elements */}
      <div className="fixed top-0 left-0 w-32 h-32 bg-pink-100 rounded-br-full opacity-40" />
      <div className="fixed top-10 right-10 w-24 h-24 bg-purple-100 rounded-full opacity-30" />
      <div className="fixed bottom-0 right-0 w-64 h-64 bg-pink-100 rounded-tl-full opacity-40" />

      <div className="container mx-auto px-4 py-6 relative z-10">
        <header className="mb-8 flex justify-between items-center">
          <Link to="/" className="flex items-center">
            {/* <img src={'/react.svg'} alt="Photobooth App" className="h-12" /> */}
            <span className="ml-3 text-2xl font-bold text-pink-600 tracking-tight">
              Cute Photobooth
            </span>
          </Link>

          {showBackButton && !isHomePage && (
            <Link
              to={backUrl}
              className="flex items-center px-4 py-2 bg-white text-pink-600 rounded-full shadow-md hover:bg-pink-50 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Back
            </Link>
          )}
        </header>

        {title && (
          <h1 className="text-3xl font-bold text-pink-600 mb-6 text-center">
            {title}
          </h1>
        )}

        {children}

        <footer className="mt-12 text-center text-pink-400 text-sm">
          <p>© {new Date().getFullYear()} Teknokreasi</p>
        </footer>
      </div>
    </div>
  );
};

export default FeminineLayout;
