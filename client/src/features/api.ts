
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
    profileAvatarUrl?: string;
    teamId?: string;
    isAdmin : boolean
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
  }
  
  export interface SearchResults {
    tasks?: Task[];
    projects?: Project[];
    users?: User[];
  }
  
  export interface Team {
    teamId: string;
    teamName: string;
    projectManagerUserId: string;
  }
  

 export const api = createApi({
    reducerPath : "api",
    baseQuery: fetchBaseQuery({
      baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
      credentials : "include",
      prepareHeaders: (headers) => {
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

      fetchAllTasks: build.query<Task[], { projectId: string }>({
        query: ({ projectId }) => `tasks?projectId=${projectId}`,
        transformResponse: (res: { data: { tasks: Task[] } }) => {
          console.log('Raw response:', res);
          return res.data.tasks;
        },
        providesTags: (result, error, { projectId }) => {
         // console.log('Transformed result:', result, typeof result);
          return result
            ? [
                ...result.map(({ id }) => ({ type: 'Tasks' as const, id })),
                { type: 'Tasks' as const, id: `project-${projectId}` },
              ]
            : [{ type: 'Tasks' as const, id: `project-${projectId}` }];
        },
      }),

      fetchAllTasksOfUser : build.query({
         query : ({userId}) => `/tasks/user/${userId}`,
         transformResponse : (results : {data : Task[]}) => results.data,
        
       }),

       createTask: build.mutation<Task, Partial<Task> & { projectId: string }>({
        query: (task) => ({
          url: '/create-task',
          method: 'POST',
          body: task,
        }),
        invalidatesTags: (result, error, task) => {
          // console.log('task, result from createTask RTK:', task, result);
          return [
            { type: 'Tasks' as const, id: `project-${task.projectId}` },
            { type: 'Tasks' as const, id: task.createdById || task.assignedToId || 'unknown' },
          ];
        },
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
        invalidatesTags: (result, error, { taskDetails }) => [
          { type: "Tasks" as const, id: `project-${taskDetails.projectId}` },
        ],
      }), 
      
      getUsers: build.query<User[], void>({
       query: () => "users",
       providesTags: ["Users"] ,
      }),
  
      getTeams: build.query({
        query: () => "teams",
        transformResponse: (response: {data : Team[]}) => {
          return response.data
        },
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