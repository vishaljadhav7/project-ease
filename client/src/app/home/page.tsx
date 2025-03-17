'use client'

import React, { useState } from "react";
import Header from "@/components/Header";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { useAppSelector } from "@/Redux/store";
import { dataGridClassNames } from "@/lib/utils";
import { Priority, Project, Task, useFetchAllTasksOfUserQuery } from "@/features/api";
import NewProjectPopup from "@/components/NewProjectPopup";
import LoadingSpinner from "@/components/LoadingSpinner";

const taskColumns: GridColDef[] = [
  { field: "taskName", headerName: "Title", width: 200 },
  { field: "status", headerName: "Status", width: 120 },
  { field: "priority", headerName: "Priority", width: 120 },
  { field: "dueDate", headerName: "Due Date", width: 130 },
];

const COLORS = ["#34D399", "#FBBF24", "#60A5FA", "#F87171"]; // Softer, modern colors

const Home = () => {
  const projects = useAppSelector((store) => store.data.allProjects);
  const user = useAppSelector((store) => store.user.userInfo);
  
    
  const [isModalNewProjectOpen, setIsModalNewProjectOpen] = useState<boolean>(false);
  
  const { data  , isLoading: tasksLoading, isError: tasksError } = useFetchAllTasksOfUserQuery({ userId : user?.id as string });

  if (tasksLoading) return <LoadingSpinner/>;
  if (tasksError) return <div className="p-8 text-center text-red-500 text-lg">Error loading data</div>;
 
  // No Projects Case
  if ( user?.isAdmin && (!projects || projects.length === 0)) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
        <NewProjectPopup
          isOpen={isModalNewProjectOpen}
          onClose={() => setIsModalNewProjectOpen(false)}
        />
        <Header name="Welcome to Project Management" />
        <div className="text-center max-w-lg bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">No Projects Yet!</h2>
          <p className="text-gray-600 mb-6 text-lg">
            Start by creating your first project to organize tasks and track progress.
          </p>
          <button
            onClick={() => setIsModalNewProjectOpen(true)}
            className="bg-teal-500 text-white px-6 py-3 rounded-lg hover:bg-teal-600 transition-all duration-200 font-medium"
          >
            Create New Project
          </button>
        </div>
      </div>
    );
  }

  // Set default project



  const tasks = data || [];

  // No Tasks Case

  if (tasks.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <Header name="Project Management Dashboard" />
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-8 text-center">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">No Tasks Found</h3>
          <p className="text-gray-600 mb-6 text-lg">
            Add tasks to your projects to get started!
          </p>
        </div>
      </div>
    );
  }

  // Data for Charts
  const priorityCount = tasks.reduce((acc: Record<string, number>, task: Task) => {
    acc[task.priority as Priority] = (acc[task.priority as Priority] || 0) + 1;
    return acc;
  }, {});

  const taskDistribution = Object.keys(priorityCount).map((key) => ({
    name: key,
    value: priorityCount[key],
  }));

  const projectStatus = projects.reduce((acc: { name: string; value: number }[], project : Project) => {
    const status = project.endDate ? "Completed" : "Active";
    const existing = acc.find((item) => item.name === status);
    if (existing) existing.value += 1;
    else acc.push({ name: status, value: 1 });
    return acc;
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Header name="Project Management Dashboard" />
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Task Priorities Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Task Priorities</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={taskDistribution}>
                <XAxis dataKey="name" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #e5e7eb" }}
                />
                <Bar dataKey="value" fill="#34D399" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Project Status Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Project Status</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={projectStatus}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  labelLine={false}
                >
                  {projectStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: "14px", color: "#6B7280" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Tasks Table Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 md:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Your Tasks</h3>

            </div>

            <DataGrid
              rows={tasks}
              columns={taskColumns}
              className={`${dataGridClassNames} border-0`}
          
              disableColumnMenu
             
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;