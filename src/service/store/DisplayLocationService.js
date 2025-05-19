import axios from '../axiosInstance';
import { handleRequest } from '../axiosInstance';

export const fetchDisplayLocations = () =>
    handleRequest(() =>
        axios.get('/api/display-location').then((res) => res.data)
    );

export const saveDisplayLocations = (locations) =>
    handleRequest(() =>
        axios.post('/api/display-location/bulk', locations).then((res) => res.data)
    );
