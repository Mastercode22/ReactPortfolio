import { apiFetch } from './api';
export const getContact = () => apiFetch('/contact');
export const submitMessage = (data) => apiFetch('/contact/message', {
    method: 'POST',
    body: JSON.stringify(data)
});
export const postContactMessage = submitMessage;
