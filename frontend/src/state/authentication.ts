import { createSlice } from '@reduxjs/toolkit';

export interface AuthenticationState {
}

const initialState: AuthenticationState = {
};

export const authenticationSlice = createSlice({
    name: 'authentication',
    initialState,
    reducers: {
        resetToDefault: () => initialState,
    },
});

export const { resetToDefault } = authenticationSlice.actions;

export default authenticationSlice.reducer;
