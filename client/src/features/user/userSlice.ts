import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../api";

interface userData {
 isAuthenticated : boolean,
 userInfo : User | undefined
}

const initialState : userData = {
 isAuthenticated : false,
  userInfo : undefined
};

const userSlice = createSlice({
    name : "user",
    initialState,
    reducers : {
        addUser : (state, action : PayloadAction<User>) => {
            state.isAuthenticated = true;
            state.userInfo = action.payload;
        },
        removeUser: (state) => {
            state.isAuthenticated  = false;
            state.userInfo = undefined;
        }
    } 
})

export const {addUser, removeUser} = userSlice.actions;

export default userSlice.reducer;



