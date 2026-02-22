// src/utils/dateUtils.js

export const formatDate = (dateStr) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};