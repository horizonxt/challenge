import { configureStore } from '@reduxjs/toolkit';

import modalSlice from '@/store/slice/modal';
import postTableSlice, { Article } from '@/store/slice/postTable';

export interface StoreState {
    modal: { isOpen: boolean; isLoading: boolean; isError: boolean };
    table: { data: Article[]; isLoadingTable: boolean; isError: boolean };
}

const store = configureStore({
    reducer: {
        modal: modalSlice,
        table: postTableSlice
    }
});

export default store;
