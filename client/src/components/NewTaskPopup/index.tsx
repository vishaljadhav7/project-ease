'use client'

import PopUp from "../PopUp";
import { useCreateTaskMutation, Priority, Status} from "@/features/api";
import { useState } from "react";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    id?: string | null;
  };

export default function NewTaskPopup({ isOpen, onClose, id = null }: Props) : React.ReactNode {
    const [createTask, { isLoading }] = useCreateTaskMutation();

    const [description, setDescription] = useState<string>("");
    const [status, setStatus] = useState<Status>(Status['To_Do']);
    const [priority, setPriority] = useState<Priority>(Priority['Backlog']);
    const [tags, setTags] = useState<string>("");
    const [startDate, setStartDate] = useState<Date>(new Date);
    const [dueDate, setDueDate] = useState<Date>(new Date);
    const [ taskName, setTaskName] = useState<string>("");

    const [createdById, setCreatedById] = useState<number>(0);
    const [assignedToId, setAssignedToId] = useState<number>(0);
    const [projectId, setProjectId] = useState<number>(0);




    const handleSubmit = async () => {

        if(!taskName || createdById > 0 || assignedToId > 0 || projectId  > 0) return;

        await createTask({
            taskName, priority, status : Status['To_Do'] , startDate, dueDate, assignedToId, createdById, projectId : Number(id),
        })
    }

      const isFormValid = () => {
        return taskName && createdById && !(id !== null || projectId);
      };

      const selectStyles =
       "mb-4 block w-full rounded border border-gray-300 px-3 py-2 dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";
   
      const inputStyles =
      "w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white     dark:focus:outline-none";
  
  
  return (
    <PopUp isOpen={isOpen} onClose={onClose} name="Create New Task">
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
          placeholder="Task Name"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
        />
        <textarea
          className={inputStyles}
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
          <select
            className={selectStyles}
            value={status}
            onChange={(e) =>
              setStatus(Status[e.target.value as keyof typeof Status])
            }
          >
            <option value="">Select Status</option>
            <option value={Status.To_Do}>To Do</option>
            <option value={Status.In_Progress}>Work In Progress</option>
            <option value={Status.Under_Review}>Under Review</option>
            <option value={Status.Completed}>Completed</option>
          </select>
          <select
            className={selectStyles}
            value={priority}
            onChange={(e) =>
              setPriority(Priority[e.target.value as keyof typeof Priority])
            }
          >
            <option value="">Select Priority</option>
            <option value={Priority.Urgent}>Urgent</option>
            <option value={Priority.High}>High</option>
            <option value={Priority.Medium}>Medium</option>
            <option value={Priority.Low}>Low</option>
            <option value={Priority.Backlog}>Backlog</option>
          </select>
        </div>
        <input
          type="text"
          className={inputStyles}
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
          <input
            type="date"
            className={inputStyles}
            onChange={(e) => setStartDate(new Date(e.target.value))}
          />
          <input
            type="date"
            className={inputStyles}
            onChange={(e) => setDueDate(new Date(e.target.value))}
          />
        </div>
        <input
          type="text"
          className={inputStyles}
          placeholder="Author User ID"
          value={createdById}
          onChange={(e) => setCreatedById(Number(e.target.value))}
        />
        <input
          type="text"
          className={inputStyles}
          placeholder="Assigned User ID"
          value={assignedToId}
          onChange={(e) => setAssignedToId(Number(e.target.value))}
        />
        {id === null && (
          <input
            type="text"
            className={inputStyles}
            placeholder="ProjectId"
            value={projectId}
            onChange={(e) => setProjectId(Number(e.target.value))}
          />
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
  )
}