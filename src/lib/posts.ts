import api from '../lib/api';

export const fetchPosts = async () => {
    const response = await api.get('/api/posts');
    return response.data;
};