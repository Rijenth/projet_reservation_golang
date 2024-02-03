import { createSlice } from '@reduxjs/toolkit';

export interface AuthenticationState {
    authenticated: boolean;
}

const initialState: AuthenticationState = {
    authenticated: false,
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
