import axios from 'axios';
import { BEERMAP_KEY } from '../api/APIKey';

const BrewServer = axios.create({
    baseURL: "https://beermapping.com/includes/dataradius.php"
})


BrewServer.interceptors.request.use(
    async(config) => {
        config.headers.Accept = 'application/json';
        return config;
    },
    (err) => {
        return Promise.reject(err);
    }
);

export const getMap = async (lat: any, lon: any, callback: any) => {
    const response = await BrewServer.get(
        `?lat=${lat}&lng=${lon}&radius=7.836078467420782`
    ).then()
    callback(response.data)
}


export default BrewServer;