'use client'

import React, { useState } from "react";
import ProjectTitle from "../projectTitle";
import GridView from "../_GridView";
import TableView from "../_TableView";
import NewTaskPopup from '@/components/NewTaskPopup/index';
import { useFetchAllTasksQuery } from '@/features/api';
import LoadingSpinner from "@/components/LoadingSpinner";

const Project = ({ params }: { params: Promise<{ id: string }> }) => {
  const [currentTab, setCurrentTab] = useState("Grid");
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);

  const resolvedParams = React.use(params);
  const { id } = resolvedParams;

  const { data, isLoading, error } = useFetchAllTasksQuery({ projectId: id });

  if (isLoading) return <LoadingSpinner />;
  if (error) return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <p className="text-red-500 text-lg font-medium">An error occurred while fetching tasks</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <NewTaskPopup
        isOpen={showNewTaskModal}
        onClose={() => setShowNewTaskModal(false)}
        id={id}
      />

      {/* Project Title */}
      <ProjectTitle currentTab={currentTab} setCurrentTab={setCurrentTab} projectId={id} />

      {/* Content */}
      <div className="p-6">
        {currentTab === "Grid" && (
          <GridView setShowNewTaskModal={setShowNewTaskModal} tasks={data?.data.tasks || []} />
        )}
        {currentTab === "Table" && (
          <TableView setShowNewTaskModal={setShowNewTaskModal} tasks={data?.data.tasks || []} />
        )}
      </div>
    </div>
  );
};

export default Project;