import { apiFetch } from './api';
export const getProjects = (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/projects${query ? `?${query}` : ''}`);
};
export const getProjectBySlug = (slug) => apiFetch(`/projects/${slug}`);
