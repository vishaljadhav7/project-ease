
'use client';

import React, { useState, useRef } from 'react';
import { DndProvider, useDrag, useDrop, DropTargetMonitor, DragSourceMonitor } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Task as TaskType } from '@/features/api';
import { EllipsisVertical, MessageSquareMore, Plus } from 'lucide-react';
import { format } from 'date-fns';
import Image from 'next/image';
import { useUpdateTaskMutation } from '@/features/api';
import EditTaskPopup from '@/components/EditTaskPopup';
import LoadingSpinner from '@/components/LoadingSpinner';

type GridProps = {
  setShowNewTaskModal: (isOpen: boolean) => void;
  tasks: TaskType[];
};

type ColumnType = {
  id: string;
  status: string;
};

const taskStatus: ColumnType[] = [
  { id: 'b-1s#*#', status: 'To_Do' },
  { id: 'g-6z#&_', status: 'In_Progress' },
  { id: 'j-3s#+^)', status: 'Under_Review' },
  { id: '*&lfd-e3', status: 'Completed' },
];

export default function GridView({ setShowNewTaskModal, tasks }: GridProps) {
  const [updateTask, { isLoading }] = useUpdateTaskMutation();

  const moveTask = (taskId: string, toStatus: string) => {
    updateTask({ taskId, status: toStatus });
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2 xl:grid-cols-4 bg-gray-100 min-h-screen">
        {tasks &&
          taskStatus.map((column) => (
            <TaskPanel
              key={column.id}
              status={column.status}
              tasks={tasks || []}
              moveTask={moveTask}
              setShowNewTaskModal={setShowNewTaskModal}
            />
          ))}
      </div>
    </DndProvider>
  );
}

type TaskPanelProps = {
  status: string;
  tasks: TaskType[];
  moveTask: (taskId: string, status: string) => void;
  setShowNewTaskModal: (isOpen: boolean) => void;
};

const TaskPanel = ({ status, tasks, moveTask, setShowNewTaskModal }: TaskPanelProps) => {
  const dropRef = useRef<HTMLDivElement>(null); // Standard ref for the DOM element

  const [{ isOver }, drop] = useDrop({
    accept: 'task',
    drop: (item: { id: string }) => moveTask(item.id, status),
    collect: (monitor: DropTargetMonitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  // Connect the drop target to the DOM ref
  drop(dropRef);

  const tasksCount = tasks.filter((task) => task.status === status).length;

  const statusColors: Record<string, string> = {
    To_Do: '#3B82F6',
    In_Progress: '#10B981',
    Under_Review: '#F59E0B',
    Completed: '#6B7280',
  };

  return (
    <div
      ref={dropRef} // Use the standard ref here
      className={`rounded-xl bg-white shadow-sm border border-gray-200 p-4 transition-all duration-300 ${
        isOver ? 'bg-gray-50 shadow-md' : ''
      }`}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between p-2 rounded-md mb-4"
        style={{ backgroundColor: `${statusColors[status]}10` }}
      >
        <h3 className="text-md font-semibold text-gray-800 flex items-center gap-2">
          {status.replace('_', ' ')}
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-200 text-gray-700 text-xs font-medium">
            {tasksCount}
          </span>
        </h3>
        <div className="flex items-center gap-2">
          <button
            className="p-1 bg-white rounded-md text-gray-700 hover:bg-gray-100 transition-colors shadow-sm"
            onClick={() => setShowNewTaskModal(true)}
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Tasks */}
      <div className="mt-2 space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
        {tasks
          .filter((task) => task.status === status)
          .map((task) => (
            <Task key={task.id} task={task} />
          ))}
      </div>
    </div>
  );
};

type TaskProps = {
  task: TaskType;
};

const Task = ({ task }: TaskProps) => {
  const [taskControls, setTaskControls] = useState<boolean>(false);
  const [showEditTask, setShowEditTask] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null); // Standard ref for the DOM element

  const [{ isDragging }, drag] = useDrag({
    type: 'task',
    item: { id: task.id },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  // Connect the drag source to the DOM ref
  drag(dragRef);

  const taskTagsSplit = task.tags ? task.tags.split(',') : [];
  const formattedStartDate = task.startDate ? format(new Date(task.startDate), 'MMM dd') : '';
  const formattedDueDate = task.dueDate ? format(new Date(task.dueDate), 'MMM dd') : '';
  const numberOfComments = (task.userComments && task.userComments.length) || 0;

  const PriorityTag = ({ priority }: { priority: TaskType['priority'] }) => (
    <div
      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
        priority === 'Urgent'
          ? 'bg-red-100 text-red-600'
          : priority === 'High'
          ? 'bg-yellow-100 text-yellow-600'
          : priority === 'Medium'
          ? 'bg-green-100 text-green-600'
          : priority === 'Low'
          ? 'bg-blue-100 text-blue-600'
          : 'bg-gray-100 text-gray-600'
      }`}
    >
      {priority}
    </div>
  );

  return (
    <div
      ref={dragRef} // Use the standard ref here
      className={`relative rounded-md bg-white border border-gray-200 p-3 transition-all duration-300 ${
        isDragging ? 'opacity-50 scale-95' : 'opacity-100 hover:shadow-md'
      }`}
    >
      <EditTaskPopup
        isOpen={showEditTask}
        onClose={() => setShowEditTask(false)}
        taskDetails={task}
      />

      {taskControls && (
        <ul className="absolute top-8 right-2 z-40 p-2 bg-white border border-gray-200 rounded-md shadow-md w-28">
          <li
            onClick={() => setShowEditTask(true)}
            className="p-1 text-sm text-gray-700 hover:bg-gray-100 rounded cursor-pointer"
          >
            Edit
          </li>
          <li className="p-1 text-sm text-gray-700 hover:bg-gray-100 rounded cursor-pointer">
            Delete
          </li>
        </ul>
      )}

      {/* Task Content */}
      <div className="space-y-2">
        {/* Tags and Priority */}
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            {task.priority && <PriorityTag priority={task.priority} />}
            {taskTagsSplit.map((tag) => (
              <span
                key={tag}
                className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
          <button
            onClick={() => setTaskControls((prev) => !prev)}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <EllipsisVertical size={18} />
          </button>
        </div>

        {/* Task Name and Points */}
        <div className="flex justify-between items-center">
          <h4 className="text-sm font-semibold text-gray-800">{task.taskName}</h4>
          {typeof task.points === 'number' && (
            <span className="text-xs text-gray-500">{task.points} pts</span>
          )}
        </div>

        {/* Dates */}
        <div className="text-xs text-gray-500">
          {formattedStartDate && formattedDueDate ? (
            <span>
              {formattedStartDate} - {formattedDueDate}
            </span>
          ) : (
            formattedStartDate || formattedDueDate
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2">{task.description}</p>

        {/* Divider */}
        <div className="border-t border-gray-200" />

        {/* Assignees and Comments */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {task.assignedTo && (
              <div className="flex items-center gap-1">
                <Image
                  src={task.assignedTo.profileAvatarUrl || '/default-avatar.png'}
                  alt={task.assignedTo.userName}
                  width={24}
                  height={24}
                  className="h-6 w-6 rounded-full border border-gray-200 object-cover"
                />
                <span className="text-xs text-gray-700">{task.assignedTo.userName}</span>
              </div>
            )}
            {task.createdTask && (
              <div className="flex items-center gap-1">
                <Image
                  src={task.createdTask.profileAvatarUrl || '/default-avatar.png'}
                  alt={task.createdTask.userName}
                  width={24}
                  height={24}
                  className="h-6 w-6 rounded-full border border-gray-200 object-cover"
                />
                <span className="text-xs text-gray-700">{task.createdTask.userName}</span>
              </div>
            )}
          </div>
          <div className="flex items-center text-gray-500">
            <MessageSquareMore size={16} />
            <span className="ml-1 text-xs">{numberOfComments}</span>
          </div>
        </div>
      </div>
    </div>
  );
};