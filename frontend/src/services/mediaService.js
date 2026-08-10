import { adminFetch } from './api';
export const getMedia = () => adminFetch('/media');
export const uploadMedia = (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return adminFetch('/admin/media', {
        method: 'POST',
        body: formData,
        headers: {} // Let browser set Content-Type boundary for FormData
    });
};
