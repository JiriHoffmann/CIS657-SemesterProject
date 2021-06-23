import axios from 'axios';

export const BEERMAP_KEY = '5bef6e301d773664c6d807887acc7fb6';
const BrewServer = axios.create({
	baseURL: 'https://beermapping.com/includes/dataradius.php'
});

BrewServer.interceptors.request.use(
	async (config) => {
		config.headers.Accept = 'application/json';
		return config;
	},
	(err) => {
		return Promise.reject(err);
	}
);

export const fetchBeerLocations = async (lat: any, lon: any) => {
	return await BrewServer.get(`?lat=${lat}&lng=${lon}&radius=7.5`).then((res) => {
		if (res.data.count === 0) return [];
		const locations = res.data.locations;
		return locations.map((loc: any) => ({ ...loc, lat: Number(loc.lat), lon: Number(loc.lng) }));
	});
};

export const fetchBeerLocationImage = async (locID: string) => {
	return axios
		.get(`http://beermapping.com/webservice/locimage/${BEERMAP_KEY}/${locID}&s=json`)
		.then((res) => res.data[0]?.imageurl ?? null);
};

export default BrewServer;
