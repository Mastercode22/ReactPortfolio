import { apiFetch } from './api';
export const getHero = () => apiFetch('/hero');
