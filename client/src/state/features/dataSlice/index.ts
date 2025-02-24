import { Project, Task, User } from "@/state/api";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface allData {
    allTasks : Task[],
    allProjects : Project[],
    allUsers : User[]
}

const initialState : allData = {
    allTasks : [],
    allProjects : [],
    allUsers : []
}

const dataSlice = createSlice({
    name : 'data',
    initialState,
    reducers : {
        addTasks : (state, action : PayloadAction<Task[]>) => {
            state.allTasks = action.payload
        },

        addProjects : (state, action : PayloadAction<Project[]>) => {
           state.allProjects = action.payload
        },

        addUsers : (state, action : PayloadAction<User[]>) =>{
            state.allUsers = action.payload
        } 
    }
})


export const {addTasks, addProjects, addUsers} = dataSlice.actions

export default dataSlice.reducer;

