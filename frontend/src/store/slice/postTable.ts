import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Article {
    id: number;
    name: string;
    description: string;
    createdAt: string;
}

interface ArticleState {
    data: Article[];
    isLoadingTable: boolean;
    isError: boolean;
}

const initialState: ArticleState = {
    data: [],
    isLoadingTable: true,
    isError: false
};

const postTableSlice = createSlice({
    name: 'articles',
    initialState,
    reducers: {
        setArticles: (state, action: PayloadAction<Article[]>) => {
            state.data = action.payload;
        },
        setLoadingTable: (state, action: PayloadAction<boolean>) => {
            state.isLoadingTable = action.payload;
        },
        setError: (state, action: PayloadAction<boolean>) => {
            state.isError = action.payload;
        },
        addArticle: (state, action: PayloadAction<Article>) => {
            state.data = [action.payload, ...state.data];
        },
        removeArticle: (state, action: PayloadAction<number>) => {
            state.data = state.data.filter(article => article.id !== action.payload);
        }
    }
});

export const { setArticles, setLoadingTable, setError, addArticle, removeArticle } = postTableSlice.actions;
export default postTableSlice.reducer;
