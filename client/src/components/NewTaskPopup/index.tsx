'use client'

import { useState, FormEvent } from "react";
import PopUp from "../PopUp";
import { useCreateTaskMutation, Priority, Status } from "@/features/api";

// Define interfaces for type safety
interface TaskFormData {
  taskName: string;
  description: string;
  status: Status;
  priority: Priority;
  tags: string;
  startDate: Date;
  dueDate: Date;
  createdById: string;
  assignedToId: string;
  projectId: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  id: string ;
}

export default function NewTaskPopup({ isOpen, onClose, id }: Props): React.ReactNode {
  const [createTask, { isLoading }] = useCreateTaskMutation();

  const [formData, setFormData] = useState<TaskFormData>({
    taskName: "",
    description: "",
    status: Status.To_Do,
    priority: Priority.Backlog,
    tags: "",
    startDate: new Date(),
    dueDate: new Date(),
    createdById: "",
    assignedToId: "",
    projectId: id ,
  });

  const handleInputChange = (field: keyof TaskFormData, value: string | Date | Status | Priority | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Form validation
  const isFormValid = (): boolean => {
    return Boolean(
      formData.taskName.trim() &&
      formData.createdById  &&
      (id !== null || formData.projectId)
    );
  };


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormValid()) return;

    try {
      await createTask({
        ...formData,
        projectId: id ? id : formData.projectId,
        status: formData.status,
        priority: formData.priority,
      }).unwrap();
   
      setFormData({
        taskName: "",
        description: "",
        status: Status.To_Do,
        priority: Priority.Backlog,
        tags: "",
        startDate: new Date(),
        dueDate: new Date(),
        createdById: "",
        assignedToId: "",
        projectId: id ,
      });
      onClose();
    } catch (error) {
      console.error("Failed to create task:", error);
    
    }
  };

  const inputStyles = "w-full rounded border border-gray-300 p-2 shadow-sm";
  const selectStyles = "mb-4 block w-full rounded border border-gray-300 px-3 py-2";

  return (
    <PopUp isOpen={isOpen} onClose={onClose} name="Create New Task">
      <form
        className="mt-4 space-y-6 max-h-[80vh] overflow-y-auto p-4"
        style={{ maxWidth: "500px" }} 
        onSubmit={handleSubmit}
      >
        <div>
          <label htmlFor="taskName">Task Name</label>
          <input
            type="text"
            name="taskName"
            className={inputStyles}
            placeholder="Task Name"
            value={formData.taskName}
            onChange={(e) => handleInputChange("taskName", e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="description">Description</label>
          <textarea
            className={inputStyles}
            placeholder="Description"
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
          <select
            className={selectStyles}
            value={formData.status}
            onChange={(e) =>
              handleInputChange("status", Status[e.target.value as keyof typeof Status])
            }
          >
            <option value={Status.To_Do}>To Do</option>
            <option value={Status.In_Progress}>Work In Progress</option>
            <option value={Status.Under_Review}>Under Review</option>
            <option value={Status.Completed}>Completed</option>
          </select>
          <select
            className={selectStyles}
            value={formData.priority}
            onChange={(e) =>
              handleInputChange("priority", Priority[e.target.value as keyof typeof Priority])
            }
          >
            <option value={Priority.Urgent}>Urgent</option>
            <option value={Priority.High}>High</option>
            <option value={Priority.Medium}>Medium</option>
            <option value={Priority.Low}>Low</option>
            <option value={Priority.Backlog}>Backlog</option>
          </select>
        </div>

        <div>
          <label htmlFor="tags">Tags</label>
          <input
            type="text"
            id="tags"
            className={inputStyles}
            placeholder="Tags (comma separated)"
            value={formData.tags}
            onChange={(e) => handleInputChange("tags", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
          <input
            type="date"
            className={inputStyles}
            value={formData.startDate.toISOString().split("T")[0]}
            onChange={(e) => {
              const date = new Date(e.target.value);
              if (!isNaN(date.getTime())) handleInputChange("startDate", date);
            }}
          />
          <input
            type="date"
            className={inputStyles}
            value={formData.dueDate.toISOString().split("T")[0]}
            onChange={(e) => {
              const date = new Date(e.target.value);
              if (!isNaN(date.getTime())) handleInputChange("dueDate", date);
            }}
          />
        </div>

        <div>
          <label htmlFor="author">Author ID</label>
          <input
           type="text"
            className={inputStyles}
            placeholder="Author User ID"
            value={formData.createdById || ""}
            id="author"
            onChange={(e) => handleInputChange("createdById", (e.target.value))}
          />
        </div>

        <div>
          <label htmlFor="assignee">Assigned To ID</label>
          <input
            type="text"
            id="assignee"
            className={inputStyles}
            placeholder="Assigned User ID"
            value={formData.assignedToId || ""}
            onChange={(e) => handleInputChange("assignedToId", (e.target.value))}
          />
        </div>

        {id === null && (
          <div>
            <label htmlFor="projectId">Project ID</label>
            <input
              type="text"
              id="projectId"
              className={inputStyles}
              placeholder="Project ID"
              value={formData.projectId || ""}
              onChange={(e) => handleInputChange("projectId", (e.target.value))}
            />
          </div>
        )}

        <button
          type="submit"
          className={`focus-offset-2 mt-4 flex w-full justify-center rounded-md border border-transparent bg-blue-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
            !isFormValid() || isLoading ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={!isFormValid() || isLoading}
        >
          {isLoading ? "Creating..." : "Create Task"}
        </button>
      </form>
    </PopUp>
  );
}