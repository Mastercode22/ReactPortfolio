import { apiFetch, adminFetch } from './api';

export const getContact = () => apiFetch('/contact');

export const submitMessage = (data) => apiFetch('/messages', {
    method: 'POST',
    body: JSON.stringify(data)
});

export const postContactMessage = submitMessage;

// Admin CMS Message Services
export const getMessages = (status = 'all', search = '') => {
    let query = `/admin/messages?status=${encodeURIComponent(status)}`;
    if (search) query += `&search=${encodeURIComponent(search)}`;
    return adminFetch(query);
};

export const getMessageDetails = (id) => adminFetch(`/admin/messages/${id}`);

export const markMessageRead = (id, isRead = true) => adminFetch(`/admin/messages/${id}/read`, {
    method: 'PATCH',
    body: JSON.stringify({ is_read: isRead })
});

export const updateMessageStatus = (id, status) => adminFetch(`/admin/messages/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
});

export const deleteMessage = (id) => adminFetch(`/admin/messages/${id}`, {
    method: 'DELETE'
});

export const getMessageStats = () => adminFetch('/admin/messages/stats');

export const sendReply = (id, body) => adminFetch(`/admin/messages/${id}/reply`, {
    method: 'POST',
    body: JSON.stringify({ body }),
});

export const getReplies = (id) => adminFetch(`/admin/messages/${id}/replies`);

export const logVisitorReply = (id, body) => adminFetch(`/admin/messages/${id}/replies/visitor`, {
    method: 'POST',
    body: JSON.stringify({ body }),
});
