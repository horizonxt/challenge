import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isOpen: false,
    isLoading: false,
    isError: false
};

const modalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
        openModal: state => {
            state.isOpen = true;
            state.isLoading = false;
            state.isError = false;
        },
        closeModal: state => {
            state.isOpen = false;
            state.isLoading = false;
            state.isError = false;
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setError: (state, action) => {
            state.isError = action.payload;
        }
    }
});

export const { openModal, closeModal, setLoading, setError } = modalSlice.actions;
export default modalSlice.reducer;
