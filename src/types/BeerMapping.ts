export type BeerLocation = {
	city: string;
	country: string;
	gtotal: string;
	id: string;
	lat: number;
	lon: number;
	name: string;
	phone: string;
	state: string;
	status: string;
	street: string;
	total: string;
	url: string;
	zip: string;
};

export type UserLocation = {
	latitude: number;
	longitude: number;
	altitude: number | null;
	accuracy: number | null;
	altitudeAccuracy: number | null;
	heading: number | null;
	speed: number | null;
};
