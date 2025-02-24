'use client';

import Image from "next/image";
import { useState } from "react";
import { Project } from "@/state/api";
import { usePathname } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { RootState } from "@/app/redux";
import Link from "next/link";
import {AlertCircle,AlertOctagon,AlertTriangle,Briefcase,ChevronDown,ChevronUp,Home,Layers3,LockIcon,LucideIcon,Search,Settings,ShieldAlert,User,Users,XIcon} from "lucide-react";
import { toggleSidebarView } from "@/state/features/statusSlice";
import { useFetchAllProjectsQuery } from "@/state/api";

const Sidebar = () =>  {

  const dispatch = useAppDispatch();
  const {isSidebarCollapsed} = useAppSelector((state : RootState) => state.global);

  const [showProjects, setShowProjects] = useState(false);
  const [showPriority, setShowPriority] = useState(false);

  const {data : projects, isLoading, isError} = useFetchAllProjectsQuery()

  if(isLoading){

  }

  if(isError){

  }


  return (
    <div className={`fixed flex flex-col h-[100%] bg-white z-40 justify-between shadow-xl transition-all duration-100 overflow-y-auto ${isSidebarCollapsed ? "w-0" : "w-64"}  justify-start`}>
     {/* {top logo} */}
     <div className="flex flex-col h-[100%] justify-start">
        <div className="z-50 min-h-[56px] w-full flex items-center justify-center bg-orange-300">
          <h2 className="text-xl text-gray-800 font-semibold mr-28">Project Box</h2>

          {!isSidebarCollapsed && <button 
           onClick={()=> dispatch(toggleSidebarView(true))}
          className="py-3">
            <XIcon className="h-6 w-6 hover:text-gray-400"/>
          </button>}
        </div>
         {/* {team} */}        
         <div className="flex items-center gap-5 border-y-[1.5px] border-gray-200 px-8 py-4">
            <Image src='/vercel.svg' width={40} height={40} alt="logo" className="bg-slate-800"/>
            <div >
              <h2 className="text-md font-semibold text-gray-800">Abc Team</h2>
              <div className="mt-1 flex items-center gap-2">
                <LockIcon className="h-3 w-3 text-gray-600"/>
                <p className="text-xs text-gray-600">private</p>
              </div>
            </div> 
         </div>
         {/* {side panel links} */}

         <div className="z-10 w-full"> 
             <SidePanelLinks icon={Home} label="Home" href="/" />
             <SidePanelLinks icon={Briefcase} label="Timeline" href="/timeline" />
             <SidePanelLinks icon={Search} label="Search" href="/search" />
             <SidePanelLinks icon={Settings} label="Settings" href="/settings" />
             <SidePanelLinks icon={User} label="User" href="/user" />
             <SidePanelLinks icon={Users} label="Users" href="/users" />
         </div>

         <button
          onClick={() => setShowProjects((prev) => !prev)}
          className="flex w-full items-center justify-between px-8 py-3 text-gray-500"
        >
          <span className="">Projects</span>
          {showProjects ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </button>
         {showProjects && (
         projects &&  projects?.data.map((project : Project) => {
            return ( <SidePanelLinks
              key={project.id}
              icon={Briefcase}
              label={project.projectName}
              href={`/projects/${project.id}`}
            />)
          })
         )}

        <button
          onClick={() => setShowPriority((prev) => !prev)}
          className="flex w-full items-center justify-between px-8 py-3 text-gray-500"
        >
          <span className="">Priority</span>
          {showPriority ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </button>

        {showPriority && (
          <>
            <SidePanelLinks
              icon={AlertCircle}
              label="Urgent"
              href="/priority/urgent"
            />
            <SidePanelLinks
              icon={ShieldAlert}
              label="High"
              href="/priority/high"
            />
            <SidePanelLinks
              icon={AlertTriangle}
              label="Medium"
              href="/priority/medium"
            />
            <SidePanelLinks icon={AlertOctagon} label="Low" href="/priority/low" />
            <SidePanelLinks
              icon={Layers3}
              label="Backlog"
              href="/priority/backlog"
            />
          </>
        )}

  
     </div>    
    </div>
  )
}

interface SidePanelLinkProps{
  href : string;
  icon : LucideIcon;
  label : string;
  // isCollapsed : boolean;
}


const SidePanelLinks = ({
  href,
  icon : Icon,
  label,
  // isCollapsed
} : SidePanelLinkProps) => {
  const pathName = usePathname(); 
  const isActive = pathName === href || (pathName === "/" && href === "/dashboard");

  return (
    <Link href={href} className="w-full">
      <div className={`relative flex cursor-pointer items-center gap-3 transition-colors hover:bg-slate-100 ${isActive && "bg-gray-600 text-white"} px-3 py-2`}>
        {isActive && (
          <div className="absolute left-0 top-0 h-[100%] w-[5px] bg-blue-500"></div>
        )}
        <Icon className="h-6 w-6 text-gray-800"/>
        <span className="font-medium text-gray-800">{label}</span>
      </div>
    </Link>
  )

}


export default Sidebar;
