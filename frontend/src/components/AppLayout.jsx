import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { Fragment, useEffect } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Outlet, NavLink, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Battle", href: "/battle" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function AppLayout() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const handleLogoClick = (e) => {
    e.preventDefault();
    navigate("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const daifAscii = `
%c
██████╗  █████╗ ██╗███████╗
██╔══██╗██╔══██╗██║██╔════╝
██║  ██║███████║██║█████╗  
██║  ██║██╔══██║██║██╔══╝  
██████╔╝██║  ██║██║██║     
╚═════╝ ╚═╝  ╚═╝╚═╝╚═╝     
    `;
    console.log(daifAscii, "color: #6BCA6E; font-weight: bold; font-family: monospace;");
    console.log("%c> SYSTEM READY. WELCOME TO DAIF'S TERMINAL.", "color: #6BCA6E; font-family: monospace;");
  }, []);

  return (
    <div className="flex min-h-screen flex-col text-white selection:bg-[#6BCA6E] selection:text-black relative">
      {/* GLOBAL BACKGROUND (Restored) */}
      <div className="fixed inset-0 -z-50 h-full w-full bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-[size:20px_20px] pointer-events-none"></div>

      {/* NAVBAR */}
      <Disclosure
        as="nav"
        className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-md"
      >
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            {/* mobile menu button */}
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-[#6BCA6E]/10 hover:text-[#6BCA6E] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#6BCA6E]">
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open main menu</span>
                <Bars3Icon
                  aria-hidden="true"
                  className="block size-6 group-data-open:hidden"
                />
                <XMarkIcon
                  aria-hidden="true"
                  className="hidden size-6 group-data-open:block"
                />
              </DisclosureButton>
            </div>

            {/* logo + main links */}
            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
              <div
                className="flex shrink-0 items-center cursor-pointer"
                onClick={handleLogoClick}
              >
                {/* Logo "D" with pulse animation */}
                <div className="group relative flex h-10 w-10 items-center justify-center rounded-full border border-[#6BCA6E] bg-black shadow-[0_0_10px_rgba(107,202,110,0.5)] transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(107,202,110,0.8)]">
                  <span className="font-bold text-[#6BCA6E] text-xl group-hover:animate-pulse">D</span>
                </div>
              </div>
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex space-x-4 items-center h-full">
                  {navigation.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      className={({ isActive }) =>
                        classNames(
                          isActive
                            ? "bg-[#6BCA6E]/20 text-[#6BCA6E] border border-[#6BCA6E]/50"
                            : "text-gray-300 hover:bg-white/5 hover:text-[#6BCA6E]",
                          "rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200"
                        )
                      }
                    >
                      {item.name}
                    </NavLink>
                  ))}
                </div>
              </div>
            </div>

            {/* right side: auth + notifications + profile */}
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              <Link
                to="/posts/new"
                className="hidden sm:inline-flex items-center justify-center rounded bg-[#6BCA6E] px-4 py-2 text-sm font-semibold text-black shadow-sm transition-transform hover:scale-105 hover:bg-[#5abc5d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6BCA6E]"
              >
                New Post
              </Link>

              {user ? (
                // Profile dropdown when logged in
                <Menu as="div" className="relative ml-3">
                  <MenuButton className="relative flex items-center justify-center rounded-full p-2 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">Open user menu</span>
                    {/* User icon */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                      />
                    </svg>
                  </MenuButton>

                  <MenuItems
                    transition
                    className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-black border border-gray-800 py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                  >
                    <MenuItem>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-300 data-[focus]:bg-white/5 data-[focus]:text-white data-[focus]:outline-none"
                      >
                        Profile
                      </Link>
                    </MenuItem>
                    <MenuItem>
                      <button
                        onClick={() => dispatch(logout())}
                        className="block w-full px-4 py-2 text-left text-sm text-red-400 data-[focus]:bg-white/5 data-[focus]:outline-none"
                      >
                        Logout
                      </button>
                    </MenuItem>
                  </MenuItems>
                </Menu>
              ) : (
                // Login / Register when not logged in
                <div className="ml-3 flex gap-4 text-sm">
                  <Link
                    to="/login"
                    className="text-gray-300 hover:text-[#6BCA6E] transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="text-gray-300 hover:text-[#6BCA6E] transition-colors"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* mobile links */}
        <DisclosurePanel className="sm:hidden border-t border-gray-800 bg-black">
          <div className="space-y-1 px-2 pt-2 pb-3">
            {navigation.map((item) => (
              <DisclosureButton
                key={item.name}
                as={Link}
                to={item.href}
                className={({ isActive }) =>
                  classNames(
                    isActive
                      ? "bg-[#6BCA6E]/10 text-[#6BCA6E]"
                      : "text-gray-300 hover:bg-white/5 hover:text-white",
                    "block rounded-md px-3 py-2 text-base font-medium"
                  )
                }
              >
                {item.name}
              </DisclosureButton>
            ))}
            <DisclosureButton
              as={Link}
              to="/posts/new"
              className="block w-full text-center mt-4 rounded bg-[#6BCA6E] px-3 py-2 text-base font-medium text-black hover:bg-[#5abc5d]"
            >
              New Post
            </DisclosureButton>
          </div>
        </DisclosurePanel>
      </Disclosure>

      {/* PAGE CONTENT */}
      <main className="relative z-10 flex-grow p-6 min-h-screen">
        <Outlet />
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/10 bg-black py-6">
        <div className="mx-auto max-w-7xl px-4 flex flex-col items-center justify-center gap-2">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 flex items-center justify-center rounded-full border border-[#6BCA6E] text-[#6BCA6E] font-bold text-xs">D</div>
            <span className="text-lg font-bold tracking-wider text-white">Blog Battle</span>
          </div>

          <div className="text-gray-600 text-xs">
            &copy; 2025 Blog Battle. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
