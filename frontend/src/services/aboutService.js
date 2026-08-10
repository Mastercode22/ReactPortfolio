import { apiFetch } from './api';
export const getAbout = () => apiFetch('/about');
export const getAboutStats = () => apiFetch('/about/stats');
