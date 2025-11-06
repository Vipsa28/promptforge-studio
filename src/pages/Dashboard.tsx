import { Outlet, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  //  Fetch user on load
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) navigate("/");
      else setUser(data.user);
    });
  }, []);

  //  Redirect if user visits /dashboard directly
  useEffect(() => {
    if (window.location.pathname === "/dashboard") {
      navigate("/dashboard/prompts");
    }
  }, [navigate]);

  //  Logout handler
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      {/*  Header */}
      <header className="flex flex-col sm:flex-row justify-between items-center px-6 sm:px-10 py-4 bg-white shadow-sm gap-3">
        <h1 className="text-2xl font-bold text-indigo-600 tracking-tight">
          PromptForge Studio
        </h1>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          {user && (
            <p className="text-gray-700 text-sm font-medium text-center sm:text-left">
              Logged in as{" "}
              <span className="font-semibold text-indigo-600">
                {user.email}
              </span>
            </p>
          )}
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition-all duration-200 w-full sm:w-auto"
          >
            Logout
          </button>
        </div>
      </header>

      {/*  Navigation Tabs */}
      <nav className="bg-indigo-50 border-t border-b border-indigo-100 py-3 shadow-inner">
        <div className="flex flex-wrap justify-center gap-4 sm:gap-8 text-sm font-medium px-4">
          <Link
            to="/dashboard/create"
            className="text-indigo-600 hover:text-indigo-800 transition-colors duration-150"
          >
            ➕ Create Prompt
          </Link>
          <Link
            to="/dashboard/prompts"
            className="text-indigo-600 hover:text-indigo-800 transition-colors duration-150"
          >
            📜 My Prompts
          </Link>
          <Link
            to="/dashboard/runner"
            className="text-indigo-600 hover:text-indigo-800 transition-colors duration-150"
          >
            ⚙️ AI Runner
          </Link>
          <Link
            to="/dashboard/compare"
            className="text-indigo-600 hover:text-indigo-800 transition-colors duration-150"
          >
            🧠 Compare Models
          </Link>
        </div>
      </nav>

      {/*  Page Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-10 max-w-6xl mx-auto w-full">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 min-h-[75vh]">
          <Outlet /> {/* Nested page renders here */}
        </div>
      </main>
    </div>
  );
}
