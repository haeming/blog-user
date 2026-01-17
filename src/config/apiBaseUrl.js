let baseURL = '';

if (process.env.NODE_ENV === 'production') {
    baseURL = 'https://blogadminapi.haemstory.com';
} else if (window.location.hostname === 'localhost') {
    baseURL = 'http://localhost:8080';
} else {
    const currentIP = window.location.hostname;
    baseURL = `http://${currentIP}:8080`;
}

export default baseURL;