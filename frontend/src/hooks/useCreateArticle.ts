// hooks/useCreateArticle.ts
import { Article } from '@/store/slice/postTable';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export interface ArticleCreate {
    name: string;
    description: string;
}

const createArticle = async (newArticle: ArticleCreate): Promise<Article> => {
    const response = await axios.post(`${process.env.BACKEND_URL}/articles/`, newArticle);
    return response.data;
};

export const useCreateArticle = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createArticle,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['articles'] });
        }
    });
};
