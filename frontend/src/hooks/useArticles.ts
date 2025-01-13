import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchArticles = async () => {
    const response = await axios.get(process.env.BACKEND_URL + '/articles');
    return response.data;
};

export const useArticles = () => {
    return useQuery({ queryKey: ['articles'], queryFn: fetchArticles, enabled: false });
};
