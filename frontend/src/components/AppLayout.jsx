import { Outlet, Link } from "react-router-dom";

export default function AppLayout() {
  return (
    <div>
      {/* Navbar */}
      <nav className="bg-black text-white p-4 flex gap-4">
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
      </nav>

      {/* Page Content */}
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}
