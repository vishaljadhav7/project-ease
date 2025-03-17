import React, { useState } from 'react';
import NewProjectPopup from '@/components/NewProjectPopup/index';
import { Grid3x3, Table } from 'lucide-react';
import { useAppSelector } from '@/Redux/store';

type Props = {
  currentTab: string;
  setCurrentTab: (currentTab: string) => void;
  projectId: string;
};

export default function ProjectTitle({ currentTab, setCurrentTab, projectId }: Props) {
  const [isModalNewProjectOpen, setIsModalNewProjectOpen] = useState<boolean>(false);
  const user = useAppSelector(store => store.user.userInfo)
 
 
  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      {/* New Project Modal */}
      {user?.isAdmin && 
       <NewProjectPopup
        isOpen={isModalNewProjectOpen}
        onClose={() => setIsModalNewProjectOpen(false)}
      />}

      {/* Header Section */}
      <div className="px-6 py-6">

       <div className="mb-6 flex w-full items-center justify-between px-6">
        <h1 className="text-2xl text-gray-800 font-semibold tracking-tight">
         Product Design Development
        </h1>
        {user?.isAdmin &&<button
         className="flex items-center gap-2 rounded-lg bg-teal-500 px-4 py-2 text-white font-medium shadow-md hover:bg-teal-600 transition-all duration-200 ease-in-out"
         onClick={() => setIsModalNewProjectOpen(true)}
         >
          <span>New Project</span>
         </button> }
       </div>
        <p className="text-sm text-gray-500">Project ID: {projectId}</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 px-6 py-3 border-t border-gray-200 bg-gray-50">
        <TabLink
          name="Grid"
          icon={<Grid3x3 className="h-5 w-5" />}
          setCurrentTab={setCurrentTab}
          currentTab={currentTab}
        />
        <TabLink
          name="Table"
          icon={<Table className="h-5 w-5" />}
          setCurrentTab={setCurrentTab}
          currentTab={currentTab}
        />
      </div>
    </div>
  );
}

type TabLinkProps = {
  name: string;
  icon: React.ReactNode;
  setCurrentTab: (currentTab: string) => void;
  currentTab: string;
};

const TabLink = ({ name, icon, setCurrentTab, currentTab }: TabLinkProps) => {
  const isActive = currentTab === name;

  return (
    <button
      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ease-in-out ${
        isActive
          ? 'bg-teal-100 text-teal-700 shadow-sm'
          : 'text-gray-600 hover:text-teal-600 hover:bg-gray-100'
      }`}
      onClick={() => setCurrentTab(name)}
    >
      {icon}
      <span>{name}</span>
    </button>
  );
};