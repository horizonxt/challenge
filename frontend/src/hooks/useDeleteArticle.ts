import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const deleteArticle = async (articleId: number): Promise<unknown> => {
    const response = await axios.delete(`${process.env.BACKEND_URL}/articles/${articleId}`);
    return response.data;
};

export const useDeleteArticle = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteArticle,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['articles'] });
        }
    });
};
