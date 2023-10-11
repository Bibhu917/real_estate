import {createSlice} from '@reduxjs/toolkit';
const initialState={
    currentUser:null,
    error:null,
    loading:false
}
const userSlice = createSlice({
    name:'user',
    initialState,
    reducers:{
        signInStart:(state)=>{
            state.loading=true;
        },
        signInSuccess:(state,action)=>{
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        signInFailure:(state,action)=>{
            state.error = action.payload,
            state.loading = false;
        },
        updateUserStart:(state)=>{
            state.loading=true;
        },
        updateUserSuccess:(state,action)=>{
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        updateUserFailure:(state,action)=>{
            state.error=action.payload;
            state.loading=false;
        },
        signOutUserStart:(state,action)=>{
            state.loading=true;
        },
        signOutUserFailure:(state,action)=>{
            state.loading=false;
            state.error = action.payload;
        },
        signOutUserSuccess:(state)=>{
            state.loading=false;
            state.currentUser=null;
            state.error=null;
        }
    }

});

export const {signInStart,signInSuccess,signInFailure,updateUserStart,updateUserSuccess,updateUserFailure,signOutUserStart,signOutUserSuccess,signOutUserFailure} = userSlice.actions
export default userSlice.reducer;