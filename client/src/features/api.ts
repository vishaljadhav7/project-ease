
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
    productOwnerUserId?: string;
    projectManagerUserId?: string;
  }
  

 export const api = createApi({
    reducerPath : "api",
    baseQuery: fetchBaseQuery({
      baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
      prepareHeaders: (headers, { getState }) => {
       
        const token = localStorage.getItem("token");
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }  
        headers.set("Content-Type", "application/json");

        return headers;
      },
    }),
    
    tagTypes: ["Projects", "Tasks", "Users", "Teams"],
    endpoints : (build) => ({

      fetchAllProjects : build.query<Project[], void>({
       query : () => "/projects",
       providesTags : ["Projects"],
       transformResponse : (data : {data : Project[]}) => data.data
      }),
       
      createProject : build.mutation<Project, Partial<Project>>({
       query : (project) => ({
           url : "/create-project",
           method : 'POST',
           body : project,
       }),
       invalidatesTags : ["Projects"],
      }),

      fetchAllTasks : build.query<Task[], {projectId : string}>({
        query : ({projectId}) => `tasks?projectId=${projectId}`,
        providesTags: (result, error, { projectId }) =>
          result
            ? [
                ...result.data.tasks.map(({ id }: { id: string }) => ({ type: "Tasks" as const, id })),
                { type: "Tasks" as const, id: `project-${projectId}` }, // Project-specific tag
              ]
            : [{ type: "Tasks" as const, id: `project-${projectId}` }],
       
       }),   

      fetchAllTasksOfUser : build.query<Task[], {userId : string}>({
         query : ({userId}) => `/tasks/user/${userId}`,
         transformResponse : (results : any) => {
          console.log(results)
          return results
         },
         providesTags : ((result, error, {userId}) => (
             result
             ? result?.data.map(({ id } : { id: string }) => ({ type: "Tasks", id }))
             : [{ type: "Tasks", id: userId }] 
         )),
       }),

      createTask : build.mutation<Task, Partial<Task>>({
        query : (task) => ({
         url : "/create-task",
         method : "POST",
         body : task
        }),     
        invalidatesTags: (result, error, task) => [
          { type: "Tasks" as const, id: `project-${task.projectId}` }, // Invalidate specific project
        ],
      }),

      updateTask : build.mutation<Task, {taskId : string, status : string}>({
          query : ({taskId, status}) => ({
            url : `/task/${taskId}/status`,
            method : "PATCH",
            body : {status},
          }),
          invalidatesTags : (results, error, {taskId}) => [ {type : "Tasks", id : taskId} ]
      }),   

      editTask: build.mutation<Task, { taskId: string; taskDetails: Partial<Task> }>({
        query: ({ taskId, taskDetails }) => ({
          url: `/edit-task/${taskId}`,
          method: "PATCH",
          body: taskDetails,
        }),
        transformResponse: (response: any) => {
          console.log( "(transformResponse from editTask rtk) ====>>>>" , response);
          return response
        },
        invalidatesTags: (result, error, { taskDetails }) => [
          { type: "Tasks" as const, id: `project-${taskDetails.projectId}` },
        ],
      }), 
      
      getUsers: build.query<User[], void>({
       query: () => "users",
       providesTags: ["Users"] ,
      }),
  
      getTeams: build.query<Team[], void>({
        query: () => "teams",
        providesTags: ["Teams"],
      }),

      search: build.query<SearchResults, string>({
        query: (query) => `search?query=${query}`,
      }),

      logout : build.mutation<void, void>({
        query : () => ({
          url : "/signout",
          method : "POST"
        })
      })
    })
 });
 
 export const { 
   useFetchAllProjectsQuery , 
   useCreateTaskMutation, 
   useCreateProjectMutation, 
   useFetchAllTasksQuery,
   useUpdateTaskMutation,
   useFetchAllTasksOfUserQuery,
   useGetTeamsQuery,
   useGetUsersQuery,
   useSearchQuery,
   useEditTaskMutation,
   useLogoutMutation
 } = api