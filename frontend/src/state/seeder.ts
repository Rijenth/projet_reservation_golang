import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface SeederState {
    adminUsername: string;
    customerUsername: string;
    ownerUsername: string;
}

const initialState: SeederState = {
    adminUsername: '',
    customerUsername: '',
    ownerUsername: '',
};

export const seederSlice = createSlice({
    name: 'seeder',
    initialState,
    reducers: {
        resetToDefault: () => initialState,
        setSeeder: (state, action: PayloadAction<SeederState>) => {
            return {
                ...state,
                ...action.payload,
            };
        },
    },
});

export const { resetToDefault } = seederSlice.actions;

export default seederSlice.reducer;
