'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Project } from '@/features/api';
import { usePathname } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/Redux/store';
import { RootState } from '@/Redux/store';
import Link from 'next/link';
import {
  AlertCircle,
  AlertOctagon,
  AlertTriangle,
  Briefcase,
  ChevronDown,
  ChevronUp,
  Home,
  Layers3,
  LockIcon,
  LucideIcon,
  Search,
  Settings,
  ShieldAlert,
  User,
  Users,
  XIcon,
} from 'lucide-react';
import { toggleSidebarView } from '@/features/status/statusSlice';
import { useFetchAllProjectsQuery } from '@/features/api';

const Sidebar = () => {
  const dispatch = useAppDispatch();
  const { isSidebarCollapsed } = useAppSelector((state: RootState) => state.global);
  const [showProjects, setShowProjects] = useState(false);
  const [showPriority, setShowPriority] = useState(false);
  const { data: projects, isLoading, isError } = useFetchAllProjectsQuery();
  const pathname = usePathname();

  return (
    <div
      className={`fixed inset-y-0 left-0 z-40 flex flex-col bg-white shadow-lg transition-all duration-300 ease-in-out ${
        isSidebarCollapsed ? 'w-0' : 'w-72'
      } overflow-hidden`}
    >
      {/* Top Logo */}
      <div className="flex items-center justify-between h-16 px-6 bg-gradient-to-r from-orange-400 to-orange-500 shadow-md">
        <h2 className="text-xl font-bold text-white tracking-tight">ProjectBox</h2>
        {!isSidebarCollapsed && (
          <button
            onClick={() => dispatch(toggleSidebarView(true))}
            className="p-2 rounded-full text-white hover:bg-orange-600 transition-colors duration-200"
          >
            <XIcon className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Team Section */}
      <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-200 bg-gray-50">
        <Image
          src="/vercel.svg"
          width={40}
          height={40}
          alt="Team Logo"
          className="rounded-full bg-slate-800 p-1"
        />
        <div>
          <h3 className="text-md font-semibold text-gray-800">ABC Team</h3>
          <div className="flex items-center gap-1 mt-1">
            <LockIcon className="h-3 w-3 text-gray-500" />
            <span className="text-xs text-gray-500">Private</span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
        {/* Main Links */}
        <SidePanelLinks icon={Home} label="Home" href="/home" />
        <SidePanelLinks icon={Search} label="Search" href="/search" />
        <SidePanelLinks icon={User} label="Profile" href="/user" />
        <SidePanelLinks icon={Users} label="Team" href="/users" />

        {/* Projects Section */}
        <button
          onClick={() => setShowProjects((prev) => !prev)}
          className="flex w-full items-center justify-between px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
        >
          <span className="font-medium">Projects</span>
          {showProjects ? (
            <ChevronUp className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          )}
        </button>
        {showProjects && (
          <div className="pl-4 space-y-1">
            {isLoading && (
              <span className="text-sm text-gray-500 px-4">Loading...</span>
            )}
            {isError && (
              <span className="text-sm text-red-500 px-4">Error loading projects</span>
            )}
            {projects?.map((project: Project) => (
              <SidePanelLinks
                key={project.id}
                icon={Briefcase}
                label={project.projectName}
                href={`/projects/${project.id}`}
              />
            ))}
          </div>
        )}

        {/* Priority Section */}
        <button
          onClick={() => setShowPriority((prev) => !prev)}
          className="flex w-full items-center justify-between px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
        >
          <span className="font-medium">Priority</span>
          {showPriority ? (
            <ChevronUp className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          )}
        </button>
        {showPriority && (
          <div className="pl-4 space-y-1">
            <SidePanelLinks icon={AlertCircle} label="Urgent" href="/priority/urgent" />
            <SidePanelLinks icon={ShieldAlert} label="High" href="/priority/high" />
            <SidePanelLinks icon={AlertTriangle} label="Medium" href="/priority/medium" />
            <SidePanelLinks icon={AlertOctagon} label="Low" href="/priority/low" />
            <SidePanelLinks icon={Layers3} label="Backlog" href="/priority/backlog" />
          </div>
        )}
      </div>

      {/* Settings Link (Optional Footer) */}
      <div className="border-t border-gray-200 p-4">
        <SidePanelLinks icon={Settings} label="Settings" href="/settings" />
      </div>
    </div>
  );
};

interface SidePanelLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
}

const SidePanelLinks = ({ href, icon: Icon, label }: SidePanelLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === href || (pathname === '/' && href === '/dashboard');

  return (
    <Link href={href} className="block w-full">
      <div
        className={`relative flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ${
          isActive
            ? 'bg-blue-100 text-blue-700 font-semibold shadow-sm'
            : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
        }`}
      >
        {isActive && (
          <div className="absolute left-0 top-0 h-full w-1 bg-blue-500 rounded-r-md" />
        )}
        <Icon className="h-5 w-5" />
        <span className="text-sm font-medium">{label}</span>
      </div>
    </Link>
  );
};

export default Sidebar;