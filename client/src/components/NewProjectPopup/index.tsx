'use client'
import { useState } from "react";
import PopUp from '@/components/PopUp/index' 
import { useCreateProjectMutation } from "@/features/api";

type Props = {
    isOpen: boolean;
    onClose: () => void;
  };


type type_name = Date;

interface ProjectInfoType {
    projectName : string;
    description : string;
    startDate : type_name;
    endDate : type_name;
 }  

export default function NewProjectPopup({isOpen, onClose}: Props) {
    const [createProject, { isLoading }] = useCreateProjectMutation();    

   const [projectInfo, setProjectInfo] = useState<ProjectInfoType>({
    projectName: '',
    description: '',
    startDate: new Date(),
    endDate: new Date(),
  })
    
   const handleSubmit = async () => {
    const {projectName, description, startDate, endDate} = projectInfo;
     if (!projectName || 
        !startDate || 
        !endDate || 
        !description) return;
       
      await createProject({
        projectName,
        description,
        startDate,
        endDate,
      });
    };

   const handleChange = (e ) => {  
       setProjectInfo(prev => ({...prev , [e.target.name] : [e.target.value]}))   
   } 

   const isFormValid = () => {
    return projectInfo.projectName && projectInfo.description && projectInfo.startDate && projectInfo.endDate;
  };
  const inputStyles =
  "w-full rounded border border-gray-300 p-2 shadow-sm ";

  return (
    <PopUp isOpen={isOpen} onClose={onClose} name="Create New Project"> 
       <form
        className="mt-4 space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
       >
        <input
          type="text"
          className={inputStyles}
          name = "projectName"
          placeholder="Project Name"
          value={projectInfo.projectName}
          onChange={handleChange}
        />

        <textarea
          className={inputStyles}
          name = "description"
          placeholder="Description"
          value={projectInfo.description}
          onChange={handleChange}
        />

         <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
          <input
            type="date"
            className={inputStyles}
            onChange={handleChange}
          />
          <input
            type="date"
            className={inputStyles}
            onChange={handleChange}
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
  )
}