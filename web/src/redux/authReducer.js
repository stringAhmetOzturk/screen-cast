import {createSlice} from '@reduxjs/toolkit'

export const authSlice = createSlice({
    name:'auth',
    initialState:{
        user:null
    },
    reducers: {
        loginStart: (state,action) => {
            state.user = null
      },
        loginSuccess: (state,action) => {
            state.user = action.payload.user
        }
      }

})

export const {loginStart,loginSuccess} = authSlice.actions

export default authSlice.reducer

export const selectCurrentToken = (state) => state.auth.user