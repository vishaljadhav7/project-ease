import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Project {
  id: string;
  projectName: string;
  description?: string;  
  startDate?: Date;
  endDate?: Date; 
}
                             
export enum Priority {
  Urgent = "Urgent",
  High = "High",
  Medium = "Medium",
  Low = "Low",
  Backlog = "Backlog",
}

export enum Status {
  To_Do = "To_Do",
  In_Progress = "In_Progress",
  Under_Review = "Under_Review",
  Completed = "Completed",
}

export interface User {
  id?: string;
  userName : string;
  emailId: string;
  password: string;
  profileAvatarUrl?: string;
  teamId?: string;
}

export interface uploadedFiles {
  id: string;
  fileUrl: string;
  fileName: string;
  taskId: string;
  uploadedById: string;
}

export interface UserComments{
  id: string;
  comment : string;
  commentById : string;
  commentOnTaskId : string;
}

export interface Task {
  id: string;
  taskName: string;
  description?: string;
  status?: Status;
  priority?: Priority;
  tags?: string;
  startDate?: Date;
  dueDate?: Date;
  points?: string;
  projectId: string;
  createdById?: string;
  assignedToId?: string;

  createdTask?: User;
  assignedTo?: User;
  userComments?: UserComments[];
  attachments?: uploadedFiles[];
}

export interface SearchResults {
  tasks?: Task[];
  projects?: Project[];
  users?: User[];
}

export interface Team {
  teamId: string;
  teamName: string;
  // productOwnerUserId?: string;
  // projectManagerUserId?: string;
}

export const api = createApi({
    baseQuery : fetchBaseQuery({baseUrl : process.env.NEXT_PUBLIC_API_BASE_URL}),
    reducerPath : "api",
    tagTypes : [],
    endpoints : (build) => ({}),
})

export const { } = api