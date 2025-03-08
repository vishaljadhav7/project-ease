import React, { useState } from 'react';
import Header from '@/components/Header';
import NewProjectPopup from '@/components/NewProjectPopup/index';
import { Filter, Grid3x3, PlusSquare, Share2, Table } from 'lucide-react';

type Props = {
  currentTab: string;
  setCurrentTab: (currentTab: string) => void;
};

export default function ProjectTitle({ currentTab, setCurrentTab }: Props) {
  const [isModalNewProjectOpen, setIsModalNewProjectOpen] = useState<boolean>(false);

  return (
    <div className="bg-gradient-to-br from-gray-100 to-gray-200 shadow-sm">
      {/* New Project Modal */}
      <NewProjectPopup
        isOpen={isModalNewProjectOpen}
        onClose={() => setIsModalNewProjectOpen(false)}
      />

      {/* Header Section */}
      <div className="px-6 py-6 lg:py-8">
        <Header
          name="Product Design Development"
          buttonComponent={
            <button
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white font-semibold shadow-md hover:bg-blue-700 transition-all duration-200 ease-in-out transform hover:scale-105"
              onClick={() => setIsModalNewProjectOpen(true)}
            >
              <PlusSquare className="h-5 w-5" />
              <span>New Boards</span>
            </button>
          }
        />
      </div>

      {/* Tabs and Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-y border-gray-300 px-6 py-3 bg-white shadow-inner">
        {/* Tabs */}
        <div className="flex items-center gap-4">
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

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            className="p-2 rounded-full text-gray-500 hover:text-blue-600 hover:bg-gray-100 transition-colors duration-200"
            aria-label="Filter"
          >
            <Filter className="h-5 w-5" />
          </button>
          <button
            className="p-2 rounded-full text-gray-500 hover:text-blue-600 hover:bg-gray-100 transition-colors duration-200"
            aria-label="Share"
          >
            <Share2 className="h-5 w-5" />
          </button>
          <div className="relative">
            <input
              type="text"
              placeholder="Search Tasks..."
              className="w-full md:w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
            <Grid3x3 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>
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
          ? 'text-blue-600 bg-blue-100 shadow-sm font-semibold'
          : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100'
      }`}
      onClick={() => setCurrentTab(name)}
    >
      {icon}
      <span>{name}</span>
    </button>
  );
};