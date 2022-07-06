import { createSlice } from '@reduxjs/toolkit';

let initialStateValue = {
    level: 0
}

export const levelSlice = createSlice({
    name: "level",
    initialState: { value: initialStateValue },
    reducers: {
        setLevel(state, action){
            state.level= action.payload.data
        }
    }
})

export default levelSlice.reducer;