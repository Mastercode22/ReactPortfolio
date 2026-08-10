import { apiFetch } from './api';
export const getCertifications = () => apiFetch('/certifications');
