import { useClerk, useUser } from "@clerk/clerk-react";
import React from "react";
import { NavLink } from "react-router-dom";
import {
  Eraser,
  FileText,
  Hash,
  House,
  Image,
  Scissors,
  SquarePen,
  Users,
  LogOut,
} from "lucide-react";

const navItems = [
  { to: "/ai", label: "Dashboard", Icon: House },
  { to: "/ai/write-article", label: "Write Article", Icon: SquarePen },
  { to: "/ai/blog-titles", label: "Blog Titles", Icon: Hash },
  { to: "/ai/generate-images", label: "Generate Images", Icon: Image },
  {
    to: "/ai/remove-background",
    label: "Remove Background",
    Icon: Eraser,
    premium: true,
  },
  {
    to: "/ai/remove-object",
    label: "Remove Object",
    Icon: Scissors,
    premium: true,
  },
  { to: "/ai/review-resume", label: "Review Resume", Icon: FileText },
  { to: "/ai/community", label: "Community", Icon: Users },
];

const Sidebar = ({ sidebar, setSidebar }) => {
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();

  if (!user) return null;

  return (
    <div
      className={`w-60 bg-white border-r border-gray-200 flex flex-col justify-between items-center
      fixed sm:static top-14 bottom-0 left-0
      sm:translate-x-0
      ${sidebar ? "translate-x-0" : "-translate-x-full"}
      transition-all duration-300 ease-in-out z-50`}
    >
      <div className="my-7 w-full">
        <img
          src={user.imageUrl}
          alt="User Avatar"
          className="w-16 h-16 rounded-full mx-auto"
        />
        <h1 className="text-center mt-2 font-semibold text-gray-700">
          {user.fullName}
        </h1>

        <div className="px-6 mt-5 text-sm text-gray-600 font-medium">
          {navItems.map(({ to, label, Icon, premium }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/ai"}
              onClick={() => setSidebar(false)}
              className={({ isActive }) =>
                `px-3.5 py-2.5 flex items-center gap-3 rounded ${
                  isActive
                    ? "bg-gradient-to-r from-[#3C81F6] to-[#9234EA] text-white"
                    : "text-gray-700"
                }`
              }
            >
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          ))}
        </div>
      </div>

      <div className="w-full border-t border-gray-200 p-4 px-7 flex items-center justify-between">
        <div
          onClick={openUserProfile}
          className="flex gap-2 items-center cursor-pointer"
        >
          <img src={user.imageUrl} className="w-8 rounded-full" alt="" />
          <div>
            <h1 className="text-sm font-medium">{user.fullName}</h1>
            <p className="text-xs text-gray-500">
              plan details
            </p>
          </div>
        </div>
        <LogOut
          onClick={signOut}
          className="w-4.5 text-gray-400 hover:text-gray-700 transition cursor-pointer"
        />
      </div>
    </div>
  );
};

export default Sidebar;
