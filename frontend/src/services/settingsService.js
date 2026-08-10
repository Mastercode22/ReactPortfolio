import { apiFetch } from './api';
export const getSettings = () => apiFetch('/settings');
