'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Project } from '@/features/api';
import { usePathname } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/Redux/store';
import { RootState } from '@/Redux/store';
import Link from 'next/link';
import {
  Briefcase,
  ChevronDown,
  ChevronUp,
  Home,
  LockIcon,
  LucideIcon,
  Search,

  User,
  Users,
  XIcon,
} from 'lucide-react';
import { toggleSidebarView } from '@/features/status/statusSlice';
import { useFetchAllProjectsQuery } from '@/features/api';
import { addProjects } from '@/features/data/dataSlice';

const Sidebar = () => {
  const dispatch = useAppDispatch();
  const { isSidebarCollapsed } = useAppSelector((state: RootState) => state.global);
  const {userInfo} = useAppSelector((state: RootState) => state.user)
  const [showProjects, setShowProjects] = useState(false);
  const { data: projects, isLoading, isError } = useFetchAllProjectsQuery();

  useEffect(()=>{
    if(projects){
      dispatch(addProjects(projects)) 
    }
  }, [projects, dispatch])

  return (
    <div
      className={`fixed inset-y-0 left-0 z-40 flex flex-col bg-white shadow-lg transition-all duration-300 ease-in-out ${
        isSidebarCollapsed ? 'w-0' : 'w-72'
      } overflow-hidden`}
    >
      {/* Top Logo */}
      <div className="flex items-center justify-between h-16 px-6 bg-blue-500 shadow-md">
        <h2 className="text-xl font-bold text-white tracking-tight">Project Ease</h2>
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
          src={userInfo?.profileAvatarUrl || "/default-avatar.png"}
          width={40}
          height={40}
          alt={userInfo?.userName || ""}
          className="rounded-full bg-slate-800 p-1"
        />
        <div>
          <h3 className="text-md font-semibold text-gray-800">{userInfo?.userName}</h3>
          <div className="flex items-center gap-1 mt-1">
            <LockIcon className="h-3 w-3 text-gray-500" />
            <span className="text-xs text-gray-500">{userInfo?.emailId}</span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
        {/* Main Links */}
        <SidePanelLinks icon={Home} label="Home" href="/home" />
        <SidePanelLinks icon={Search} label="Search" href="/search" />
        <SidePanelLinks icon={User} label="Profile" href="/user" />
        <SidePanelLinks icon={Users} label="Team" href="/teams" />

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