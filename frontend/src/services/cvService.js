import { apiFetch, API_BASE } from './api';
export const getCvInfo = () => apiFetch('/cv/info');
export const downloadCv = () => {
    window.location.href = `${API_BASE}/cv/download`;
};
