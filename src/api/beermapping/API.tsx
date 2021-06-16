import axios from 'axios';

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
	const response = await BrewServer.get(`?lat=${lat}&lng=${lon}&radius=7.5`).then((res) => {
		if (res.data.count === 0) return [];
		const locations = res.data.locations;
		return locations.map((loc: any) => ({ ...loc, lat: Number(loc.lat), lon: Number(loc.lng) }));
	});
	return response;
};

export default BrewServer;
