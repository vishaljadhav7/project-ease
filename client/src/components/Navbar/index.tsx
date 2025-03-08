'use client';

import { Search, Settings, Menu } from 'lucide-react';
import Link from 'next/link';
import { RootState } from '@/Redux/store';
import { useAppDispatch, useAppSelector } from '@/Redux/store';
import { toggleSidebarView } from '@/features/status/statusSlice';

const Navbar = () => {
  const dispatch = useAppDispatch();
  const { isSidebarCollapsed } = useAppSelector((state: RootState) => state.global);

  return (
    <div className="flex items-center justify-between px-6 py-3 w-full bg-gradient-to-r from-gray-800 to-gray-900 shadow-lg">
      {/* Left Section: Menu Toggle and Search */}
      <div className="flex items-center gap-6">
        {isSidebarCollapsed && (
          <button
            onClick={() => dispatch(toggleSidebarView(false))}
            className="p-2 rounded-full text-gray-200 hover:bg-gray-700 hover:text-white transition-all duration-200"
            aria-label="Toggle Sidebar"
          >
            <Menu className="h-6 w-6" />
          </button>
        )}
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="search"
            placeholder="Search here..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>
      </div>

      {/* Right Section: Settings */}
      <div className="flex items-center gap-6">
        <Link
          href="/settings"
          className="p-2 rounded-full text-gray-200 hover:bg-gray-700 hover:text-white transition-all duration-200"
          aria-label="Settings"
        >
          <Settings className="h-6 w-6" />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;