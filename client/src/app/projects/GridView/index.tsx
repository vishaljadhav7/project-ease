'use client'

import React from 'react'
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Task as TaskType } from '@/state/api';
import { EllipsisVertical, MessageSquareMore, Plus } from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";
import { useFetchAllTasksQuery , useUpdateTaskMutation} from '@/state/api';

type GridProps = {
  id: string;
  setShowNewTaskModal : (isOpen: boolean) => void;
};

type ColumnType = {
  id: string;
  status : string;
}

const taskStatus : ColumnType[] = [
  {id : "b-1s#*#" , status : "To_Do" },
  {id : "g-6z#&_" , status : "In_Progress" },
  {id : "j-3s#+^)" , status : "Under_Review" },
  {id : "*&lfd-e3" , status : "Completed" }
]

export default function GridView({id , setShowNewTaskModal}: GridProps) {

  const { data, isLoading, error}  = useFetchAllTasksQuery({ projectId: Number(id) });


  const [updateTask] = useUpdateTaskMutation();

  const moveTask = (taskId: number, toStatus: string) => {
    updateTask({ taskId, status: toStatus });
  };

 
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred while fetching tasks</div>;

  return (
    <DndProvider backend={HTML5Backend}>      
      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 xl:grid-cols-4 ">
        {data && taskStatus.map((column) => (
          <TaskPanel
           key={column.id}
           status={column.status}
           tasks={data?.data.tasks  || []}
           moveTask={moveTask}
           setShowNewTaskModal={setShowNewTaskModal}
          />
        ))}
      </div>
    </DndProvider>
  )
}



type TaskPanelProps = {
  status : string;
  tasks : TaskType[];
  moveTask : (taskId : number, status : string) => void;
  setShowNewTaskModal : (isOpen : boolean) => void
}

const TaskPanel = ({status, tasks, moveTask, setShowNewTaskModal} : TaskPanelProps) => {
 
  const [{isOver}, drop] = useDrop(()=> ({
    accept : "task",
    drop : (item : {id : number}) => moveTask(item.id, status),
    collect : (monitor) => ({
      isOver : !!monitor.isOver()
    })
  }))

  const tasksCount = tasks.filter((task) => task.status === status).length;
 
  const statusColor: any = {
    "To_Do": "#2563EB",
    "In_Progress": "#059669",
    "Under_Review": "#D97706",
    "Completed": "#859669",    
  };


  return (
    <div
     ref={(instance) => {drop(instance)}}
     className={`sl:py-4 rounded-lg py-2 xl:px-2 ${isOver ? "bg-blue-200 ": ""}`}
    >
     <div className='mb-3 flex w-full '>
      <div className={`w-full bg-[${statusColor[status]}] rounded-s-lg`} style={{ backgroundColor: statusColor[status] }}>
        <div className="flex w-full items-center justify-between rounded-e-lg px-5 py-4">
          <h3 className="flex items-center text-lg font-semibold">
            {status}{" "}
            <span
              className="ml-2 inline-block rounded-full bg-white p-1  text-center text-sm leading-none text-black"
              style={{ width: "1.5rem", height: "1.5rem" }}
            >
              {tasksCount}
            </span>
          </h3>

          <div className="flex items-center gap-1">
            <button className="flex h-6 w-5 items-center justify-center text-white font-bold">
              <EllipsisVertical size={26} />
            </button>

            <button
              className="flex h-6 w-6 items-center justify-center rounded bg-white text-black "
              onClick={() => setShowNewTaskModal(true)}
            >
              <Plus size={16} />
            </button>
          </div>
         </div>
        </div>
      </div>

     {tasks.
      filter((task) => task.status === status)
      .map((task) => (
        <Task key={task.id} task={task} />
      ))}
    </div>
  );
};


type TaskProps = {
  task: TaskType;
};


// TASK Component

const Task = ({task} : TaskProps) => {

   const [{isDragging}, drag] = useDrag(() => ({
     type : "task",
     item : {id : task.id},
     collect : (monitor : any) => ({
      isDragging : !!monitor.isDragging(),
     })
   }));

   const taskTagsSplit = task.tags ? task.tags.split(",") : [];
  
   const formattedStartDate = task.startDate ? format(new Date(task.startDate), "P") : "";
  
   const formattedDueDate = task.dueDate ? format(new Date(task.dueDate), "P") : "";
  
    const numberOfComments = (task.userComments && task.userComments.length) || 0 
  
  const PriorityTag = ({ priority }: { priority: TaskType["priority"] }) => (
    <div className={`rounded-full px-2 py-1 text-xs font-semibold ${
        priority === "Urgent"
          ? "bg-red-200 text-red-700"
          : priority === "High"
            ? "bg-yellow-200 text-yellow-700"
            : priority === "Medium"
              ? "bg-green-200 text-green-700"
              : priority === "Low"
                ? "bg-blue-200 text-blue-700"
                : "bg-gray-200 text-gray-700" }`} >
      {priority}
    </div>
  );
  
  return (
    <div 
     ref={(instance) => {drag(instance)}}
     className={`mb-4 rounded-md bg-slate-200 shadow dark:bg-dark-secondary ${
      isDragging ? "opacity-50" : "opacity-100"
    }`}
    >
     {task.attachments && task.attachments.length > 0 && (
      <Image
        src={`"${task.attachments[0].fileUrl}"`}
        alt={task.attachments[0].fileName}
        width={400}
        height={200}
        className="h-auto w-full rounded-t-md"
      />
      )}

      <div className="p-4 md:p-6">

        {/* {tags, priority, EllipsisVertical button} */}
        <div className="flex items-start justify-between">

          <div className="flex flex-1 flex-wrap items-center gap-2">
            {task.priority && <PriorityTag priority={task.priority} />}

            <div className="flex gap-2">
              {taskTagsSplit.map((tag) => (
                <div
                  key={tag} className="rounded-full bg-blue-100 px-2 py-1 text-xs"> 
                  {" "} {tag}
                </div>
              ))}
            </div>       

          </div>

          <button className="flex h-6 w-4 flex-shrink-0 items-center justify-center ">
            <EllipsisVertical size={26} />
          </button>
        </div> 

         {/* {taskName and points}  */}
        <div className="my-3 flex justify-between items-center flex-wrap">
          <h4 className="text-md font-bold ">{task.taskName}</h4>
          {typeof task.points === "number" && (
            <div className="text-xs font-semibold ">
              {task.points} pts
            </div>
          )}
        </div>      

         {/* {description and date} */}
        <div className="text-xs text-gray-500 ">
          {formattedStartDate && <span>{formattedStartDate} - </span>}
          {formattedDueDate && <span>{formattedDueDate}</span>}
        </div>
        {/* {task description} */}
        <p className="text-sm text-gray-600 dark:text-neutral-500">
          {task.description}
        </p>

         {/* {bottom border} */}
        <div className="mt-4 border-t border-gray-200 dark:border-stroke-dark" />  

        {/* { user images & comments} */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex -space-x-[6px] overflow-hidden">
            {task.assignedTo && (
              <Image
                key={task.assignedTo.id}
                src={`${task.assignedTo?.profileAvatarUrl}`}
                alt={task.assignedTo.userName}
                width={30}
                height={30}
                className="h-8 w-8 rounded-full border-2 border-white object-cover"
              />
            )}
            {task.createdTask && (
              <Image
                key={task.createdTask.id}
                src={`${task.createdTask.profileAvatarUrl}`}
                alt={task.createdTask.userName}
                width={30}
                height={30}
                className="h-10 w-10 rounded-full border-2 border-white object-cover bg-rose-800 text-black"
              />
            )}
          </div>
          <div className="flex items-center text-gray-500">
            <MessageSquareMore size={20} />
            <span className="ml-1 text-sm text-black">
              {numberOfComments}
            </span>
          </div>
        </div>

      </div>
    </div>
  )

}