import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface User {
    id: number;
    firstName: string;
    lastName: string;
    username: string;
    role: 'admin' | 'customer' | 'owner' | '';
}

export interface AuthenticationState {
    authenticated: boolean;
    token: string;
    user?: User;
}

const initialState: AuthenticationState = {
    authenticated: false,
    token: '',
    user: {
        id: 0,
        firstName: '',
        lastName: '',
        username: '',
        role: '',
    },
};

export const authenticationSlice = createSlice({
    name: 'authentication',
    initialState,
    reducers: {
        resetToDefault: () => initialState,
        setAuthenticated: (
            state,
            action: PayloadAction<AuthenticationState>
        ) => {
            return {
                ...state,
                ...action.payload,
            };
        },
    },
});

export const { resetToDefault, setAuthenticated } = authenticationSlice.actions;

export default authenticationSlice.reducer;
