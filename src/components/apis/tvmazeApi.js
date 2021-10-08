import axios from 'axios';

export class TvMazeApi {
	axiosClient = axios.create();
	request = null;

	Search = async (query) => {
		try {
			if (this.request) {
				this.request?.cancel('Operation canceled by the user.');
			}

			this.request = axios.CancelToken.source();

			let url = `http://api.tvmaze.com/search/shows?q=${query}`;

			let response = await this.axiosClient.get(url, { cancelToken: this.request?.token });

			this.request = null;

			return response.data;
		} catch (e) {
			return [];
		}
	}
}

export default TvMazeApi;