import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getMe } from "../services/api";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
      
        const res = await getMe();
        setUser(res.data);
      } catch (err) {
        setError("Failed to fetch profile.");
        console.error("Failed to fetch profile:", err);
        
        setUser({ name: "Guest", email: "guest@example.com" });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);


  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    
    loading ? (
      <nav className="bg-gray-950 text-white border-b border-gray-800 relative">
        <div className="flex items-center px-4 py-3">
          <h1 className="font-bold text-lg whitespace-nowrap">DevDashboard</h1>
          <div className="hidden md:flex gap-10 text-sm ml-auto mr-10 text-gray-300">
            <Link className="hover:text-white" to="/dashboard">Dashboard</Link>
            <Link className="hover:text-white" to="/projects">Projects</Link>
            <Link className="hover:text-white" to="/githubvisualizer">GitHub</Link>
          </div>
          <div className="flex items-center gap-3 ml-4 relative">
            <button className="md:hidden text-xl" onClick={() => setMobileOpen(!mobileOpen)}>☰</button>
            <div className="w-9 h-9 rounded-full bg-gray-700 animate-pulse"></div> {/* Placeholder for avatar */}
          </div>
        </div>
      </nav>
    ) : (
    <nav className="bg-gray-950 text-white border-b border-gray-800 relative">
      <div className="flex items-center px-4 py-3">

    
        <h1 className="font-bold text-lg whitespace-nowrap">
          DevDashboard
        </h1>

        
        <div className="hidden md:flex gap-10 text-sm ml-auto mr-10 text-gray-300">
          <Link className="hover:text-white" to="/dashboard">
            Dashboard
          </Link>
          <Link className="hover:text-white" to="/projects">
            Projects
          </Link>
          <Link className="hover:text-white" to="/githubvisualizer">
            GitHub
          </Link>
        </div>

        
        <div className="flex items-center gap-3 ml-4 relative">

        
          <button
            className="md:hidden text-xl"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            ☰
          </button>


          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center font-bold"
          >
            {user?.name.charAt(0) || 'G'}
          </button>

    
          {profileOpen && (
            <div className="absolute right-0 top-12 w-52 bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-50">

              <div className="p-3 border-b border-gray-700">
                <p className="text-sm font-semibold">{user?.name || 'Guest'}</p>
                <p className="text-xs text-gray-400">{user?.email || 'guest@example.com'}</p>
              </div>

              <button
                onClick={logout}
                className="w-full text-left px-3 py-2 text-red-400 hover:bg-gray-800"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

    
      {mobileOpen && (
        <div className="md:hidden px-4 pb-3 flex flex-col gap-2 text-sm text-gray-300 border-t border-gray-800">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/projects">Projects</Link>
          <Link to="/githubvisualizer">GitHub</Link>
        </div>
      )}
    </nav>
    )
  );
}