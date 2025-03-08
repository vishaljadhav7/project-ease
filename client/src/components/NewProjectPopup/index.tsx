'use client'

import { useState, FormEvent } from "react";
import PopUp from '@/components/PopUp/index';
import { useCreateProjectMutation } from "@/features/api";
interface ProjectFormData {
  projectName: string;
  description: string;
  startDate: Date;
  endDate: Date;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewProjectPopup({ isOpen, onClose }: Props) {
  const [createProject, { isLoading }] = useCreateProjectMutation();

 
  const [formData, setFormData] = useState<ProjectFormData>({
    projectName: "",
    description: "",
    startDate: new Date(),
    endDate: new Date(),
  });


  const isFormValid = (): boolean => {
    return Boolean(
      formData.projectName.trim() &&
      formData.description.trim() &&
      formData.startDate instanceof Date &&
      !isNaN(formData.startDate.getTime()) &&
      formData.endDate instanceof Date &&
      !isNaN(formData.endDate.getTime())
    );
  };


  const handleInputChange = (
    field: keyof ProjectFormData,
    value: string | Date
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!isFormValid()) return;

    try {
      await createProject(formData).unwrap();
    
      setFormData({
        projectName: "",
        description: "",
        startDate: new Date(),
        endDate: new Date(),
      });
      onClose(); 
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  const inputStyles = "w-full rounded border border-gray-300 p-2 shadow-sm";

  return (
    <PopUp isOpen={isOpen} onClose={onClose} name="Create New Project">
      <form className="mt-4 space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="projectName">Project Name</label>
          <input
            type="text"
            className={inputStyles}
            name="projectName"
            id="projectName"
            placeholder="Project Name"
            value={formData.projectName}
            onChange={(e) => handleInputChange('projectName', e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="description">Description</label>
          <textarea
            className={inputStyles}
            name="description"
            id="description"
            placeholder="Description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
          <input
            type="date"
            className={inputStyles}
            value={formData.startDate.toISOString().split('T')[0]}
            onChange={(e) => {
              const date = new Date(e.target.value);
              if (!isNaN(date.getTime())) {
                handleInputChange('startDate', date);
              }
            }}
          />
          <input
            type="date"
            className={inputStyles}
            value={formData.endDate.toISOString().split('T')[0]}
            onChange={(e) => {
              const date = new Date(e.target.value);
              if (!isNaN(date.getTime())) {
                handleInputChange('endDate', date);
              }
            }}
          />
        </div>

        <button
          type="submit"
          className={`focus-offset-2 mt-4 flex w-full justify-center rounded-md border border-transparent bg-blue-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
            !isFormValid() || isLoading ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={!isFormValid() || isLoading}
        >
          {isLoading ? "Creating..." : "Create Project"}
        </button>
      </form>
    </PopUp>
  );
}