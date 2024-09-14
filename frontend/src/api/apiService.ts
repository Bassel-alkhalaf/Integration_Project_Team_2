import axios from 'axios';

// Define a function to fetch data from the backend API
const fetchAPI = async () => {
    try {
        const response = await axios.get('http://localhost:5001/api');
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching data from API:', error);
        throw error;
    }
};

export default fetchAPI;
