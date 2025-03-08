'use client';

import React from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Task as TaskType } from '@/features/api';
import { EllipsisVertical, MessageSquareMore, Plus } from 'lucide-react';
import { format } from 'date-fns';
import Image from 'next/image';
import { useFetchAllTasksQuery, useUpdateTaskMutation } from '@/features/api';

type GridProps = {
  id: string;
  setShowNewTaskModal: (isOpen: boolean) => void;
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

export default function GridView({ id, setShowNewTaskModal }: GridProps) {
  const { data, isLoading, error } = useFetchAllTasksQuery({ projectId: id });
  const [updateTask] = useUpdateTaskMutation();

  const moveTask = (taskId: string, toStatus: string) => {
    updateTask({ taskId, status: toStatus });
  };

  if (isLoading) return <div className="p-4 text-gray-500">Loading...</div>;
  if (error)
    return <div className="p-4 text-red-500">An error occurred while fetching tasks</div>;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2 xl:grid-cols-4 bg-gray-50 min-h-screen">
        {data &&
          taskStatus.map((column) => (
            <TaskPanel
              key={column.id}
              status={column.status}
              tasks={data?.data.tasks || []}
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
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'task',
    drop: (item: { id: number }) => moveTask(item.id, status),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const tasksCount = tasks.filter((task) => task.status === status).length;

  const statusColors: Record<string, string> = {
    To_Do: '#2563EB', // Blue
    In_Progress: '#059669', // Green
    Under_Review: '#D97706', // Amber
    Completed: '#859669', // Olive
  };

  return (
    <div
      ref={drop}
      className={`rounded-xl shadow-md bg-white p-4 transition-all duration-200 ${
        isOver ? 'bg-blue-50 shadow-lg' : ''
      }`}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between p-3 rounded-t-lg"
        style={{ backgroundColor: statusColors[status] }}
      >
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          {status.replace('_', ' ')}
          <span
            className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white text-black text-sm font-medium"
          >
            {tasksCount}
          </span>
        </h3>
        <div className="flex items-center gap-2">
          <button className="text-white hover:text-gray-200 transition-colors">
            <EllipsisVertical size={20} />
          </button>
          <button
            className="p-1 bg-white rounded-full text-black hover:bg-gray-200 transition-colors"
            onClick={() => setShowNewTaskModal(true)}
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Tasks */}
      <div className="mt-4 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
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
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'task',
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const taskTagsSplit = task.tags ? task.tags.split(',') : [];
  const formattedStartDate = task.startDate ? format(new Date(task.startDate), 'P') : '';
  const formattedDueDate = task.dueDate ? format(new Date(task.dueDate), 'P') : '';
  const numberOfComments = (task.userComments && task.userComments.length) || 0;

  const PriorityTag = ({ priority }: { priority: TaskType['priority'] }) => (
    <div
      className={`rounded-full px-2 py-1 text-xs font-medium ${
        priority === 'Urgent'
          ? 'bg-red-100 text-red-700'
          : priority === 'High'
          ? 'bg-yellow-100 text-yellow-700'
          : priority === 'Medium'
          ? 'bg-green-100 text-green-700'
          : priority === 'Low'
          ? 'bg-blue-100 text-blue-700'
          : 'bg-gray-100 text-gray-700'
      }`}
    >
      {priority}
    </div>
  );

  return (
    <div
      ref={drag}
      className={`rounded-lg bg-white shadow-md p-4 transition-all duration-200 ${
        isDragging ? 'opacity-50 scale-95' : 'opacity-100 hover:shadow-lg'
      }`}
    >
      {/* Task Attachment */}
      {task.attachments && task.attachments.length > 0 && (
        <Image
          src={task.attachments[0].fileUrl}
          alt={task.attachments[0].fileName}
          width={400}
          height={200}
          className="w-full h-32 object-cover rounded-t-md mb-3"
        />
      )}

      {/* Task Content */}
      <div className="space-y-3">
        {/* Tags and Priority */}
        <div className="flex items-start justify-between">
          <div className="flex flex-wrap gap-2">
            {task.priority && <PriorityTag priority={task.priority} />}
            {taskTagsSplit.map((tag) => (
              <span
                key={tag}
                className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
          <button className="text-gray-500 hover:text-gray-700 transition-colors">
            <EllipsisVertical size={20} />
          </button>
        </div>

        {/* Task Name and Points */}
        <div className="flex justify-between items-center">
          <h4 className="text-md font-semibold text-gray-800">{task.taskName}</h4>
          {typeof task.points === 'number' && (
            <span className="text-xs font-medium text-gray-500">{task.points} pts</span>
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
          <div className="flex -space-x-2">
            {task.assignedTo && (
              <Image
                src={task.assignedTo.profileAvatarUrl || '/default-avatar.png'}
                alt={task.assignedTo.userName}
                width={32}
                height={32}
                className="h-8 w-8 rounded-full border-2 border-white object-cover"
              />
            )}
            {task.createdTask && (
              <Image
                src={task.createdTask.profileAvatarUrl || '/default-avatar.png'}
                alt={task.createdTask.userName}
                width={32}
                height={32}
                className="h-8 w-8 rounded-full border-2 border-white object-cover"
              />
            )}
          </div>
          <div className="flex items-center text-gray-500">
            <MessageSquareMore size={18} />
            <span className="ml-1 text-sm">{numberOfComments}</span>
          </div>
        </div>
      </div>
    </div>
  );
};