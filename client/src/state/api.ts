import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { url } from "inspector";

export interface Project {
  id: number;
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
  id?: number;
  userName : string;
  emailId: string;
  password: string;
  profileAvatarUrl?: string;
  teamId?: number;
}

export interface uploadedFiles {
  id: number;
  fileUrl: string;
  fileName: string;
  taskId: number;
  uploadedById: number;
}

export interface UserComments{
  id: number;
  comment : string;
  commentById : number;
  commentOnTaskId : number;
}

export interface Task {
  id: number;
  taskName: string;
  description?: string;
  status?: Status;
  priority?: Priority;
  tags?: string;
  startDate?: Date;
  dueDate?: Date;
  points?: string;
  projectId: number;
  createdById?: number;
  assignedToId?: number;

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
  teamId: number;
  teamName: string;
  productOwnerUserId?: number;
  projectManagerUserId?: number;
}

export const api = createApi({
    baseQuery : fetchBaseQuery({baseUrl : process.env.NEXT_PUBLIC_API_BASE_URL}),
    reducerPath : "api",
    tagTypes : ["Projects", "Tasks"],
    endpoints : (build) => ({
      fetchAllProjects : build.query<Project[], void>({
        query : () => "/projects",
        providesTags : ["Projects"]
      }),
      createProject : build.mutation<Project, Partial<Project>>({
        query : (project) => ({
          url : "/create-project",
          method : "POST",
          body : project
        })
      }),
      fetchAllTasks : build.query<Task[], {projectId : number}>({
        query : ({projectId}) => `tasks?projectId=${projectId}`,
        providesTags : (result) => result ? 
        result.map(({id}) => ({type : "Tasks" as const, id})) : [{type : "Tasks" as const}]
      }),
      createTask : build.mutation<Task, Partial<Task>>({
        query : (task) => ({
         url : "/create-task",
        method : "POST",
        body : task
       }),
       invalidatesTags : ["Tasks"], 
      }),
      updateTask : build.mutation<Task, {taskId : number, status : string}>({
        query : ({taskId, status}) => ({
          url : `/task/${taskId}/status`,
          method : "PATCH",
          body : {status} 
        }),
         invalidatesTags : (results, error, {taskId}) => [
           {type : "Tasks", id : taskId} 
         ],
      }),
      fetchAllTasksOfUser : build.query<Task[], {userId: number}>({
        query : ({userId}) => `/tasks/user/${userId}`,
        // providesTags : (result, error, userId) =>
        //   result
        //     ? result.map(({ id }) => ({ type: "Tasks", id }))
        //     : [{ type: "Tasks", id: userId }], 
      }),
      getUsers: build.query<User[], void>({
        query: () => "users",
        // providesTags: ["Users"] ,
      }),
      getTeams: build.query<Team[], void>({
        query: () => "teams",
        // providesTags: ["Teams"],
      }),
      search: build.query<SearchResults, string>({
        query: (query) => `search?query=${query}`,
      }),
    }),
})

export const { 
  useFetchAllProjectsQuery , 
  useCreateTaskMutation, 
  useCreateProjectMutation, 
  useFetchAllTasksQuery,
  useUpdateTaskMutation,
  useFetchAllTasksOfUserQuery,
  useGetTeamsQuery,
  useGetUsersQuery,
  useSearchQuery
} = api