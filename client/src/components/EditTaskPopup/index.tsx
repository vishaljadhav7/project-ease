'use client'

import React, { useState, FormEvent } from "react";
import PopUp from '../PopUp';
import { useAppSelector } from "@/Redux/store";
import { Status, Priority, Task } from '@/features/api';
import { useEditTaskMutation } from '@/features/api';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  taskDetails: Task;
}

export default function EditTaskPopup({ isOpen, onClose, taskDetails }: Props) {
  const userId = useAppSelector((store) => store.user.userInfo?.id);

  const [editTask, { isLoading, error }] = useEditTaskMutation();
  const [formData, setFormData] = useState<Partial<Task>>({ ...taskDetails });
  const [formError, setFormError] = useState<string | null>(null);

  const inputStyles = "w-full rounded border border-gray-300 p-2 shadow-sm";
  const selectStyles = "mb-4 block w-full rounded border border-gray-300 px-3 py-2";

  const handleInputChange = (field: keyof Task, value: string | Date | Status | Priority) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const isFormValid = (): boolean => {
    return Boolean(formData.taskName && formData.projectId);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormValid()) {
      setFormError("Task name and project ID are required.");
      return;
    }

    // Filter to only send allowed fields
    const allowedFields = [
      "taskName", "description", "status", "priority", "tags",
      "startDate", "dueDate", "assignedToId", "projectId"
    ];
    const payload = Object.fromEntries(
      Object.entries(formData).filter(([key]) => allowedFields.includes(key))
    ) as Partial<Task>;

    try {
      console.log("Submitting:", { taskId: taskDetails.id, taskDetails: payload });
      await editTask({
        taskId: taskDetails.id,
        taskDetails: payload,
      }).unwrap();
      onClose(); // Close popup on success
    } catch (err) {
      console.error("Failed to edit task:", err);
      setFormError("Failed to update task. Please try again.");
    }
  };

  return (
    <PopUp isOpen={isOpen} onClose={onClose} name="Edit Task">
      <form
        className="mt-4 space-y-6 max-h-[80vh] overflow-y-auto p-4"
        style={{ maxWidth: "500px" }}
        onSubmit={handleSubmit}
      >
        {formError && <p className="text-red-500">{formError}</p>}

        <div>
          <label htmlFor="taskName">Task Name</label>
          <input
            type="text"
            name="taskName"
            className={inputStyles}
            placeholder="Task Name"
            value={formData.taskName || ""}
            onChange={(e) => handleInputChange("taskName", e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="description">Description</label>
          <textarea
            className={inputStyles}
            placeholder="Description"
            id="description"
            value={formData.description || ""}
            onChange={(e) => handleInputChange("description", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
          <select
            className={selectStyles}
            value={formData.status}
            onChange={(e) => handleInputChange("status", e.target.value as Status)}
          >
            {Object.values(Status).map((status) => (
              <option key={status} value={status}>{status.replace("_", " ")}</option>
            ))}
          </select>
          <select
            className={selectStyles}
            value={formData.priority}
            onChange={(e) => handleInputChange("priority", e.target.value as Priority)}
          >
            {Object.values(Priority).map((priority) => (
              <option key={priority} value={priority}>{priority}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="tags">Tags</label>
          <input
            type="text"
            id="tags"
            className={inputStyles}
            placeholder="Tags (comma separated)"
            value={formData.tags || ""}
            onChange={(e) => handleInputChange("tags", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
          <input
            type="date"
            className={inputStyles}
            //value={formData.startDate ? formData.startDate.toISOString().split("T")[0] : ""}
            onChange={(e) => {
              const date = new Date(e.target.value);
              if (!isNaN(date.getTime())) handleInputChange("startDate", date);
            }}
          />
          <input
            type="date"
            className={inputStyles}
          //  value={formData.dueDate ? formData.dueDate.toISOString().split("T")[0] : ""}
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
            value={userId || ""}
            id="author"
            disabled
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
            onChange={(e) => handleInputChange("assignedToId", e.target.value)}
          />
        </div>

        <button
          type="submit"
          className={`mt-4 w-full rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
            !isFormValid() || isLoading ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={!isFormValid() || isLoading}
        >
          {isLoading ? "Updating..." : "Update Task"}
        </button>
      </form>
    </PopUp>
  );
}