const baseUrl = "https://api.b7web.com.br/devcond/api/admin";

const request = async (method, endpoint, params, token = null) => {
	method = method.toLowerCase();
	let fullUrl = baseUrl + endpoint;
	let body = null;
	switch (method) {
		case "get":
			let queryString = new URLSearchParams(params).toString();
			fullUrl += "?" + queryString;
			break;
		case "post":
			body = JSON.stringify(params);
			break;
		case "put":
			body = JSON.stringify(params);
			break;
		case "delete":
			body = JSON.stringify(params);
			break;
		default:
			break;
	}
	let headers = {
		"Content-Type": "application/json",
	};
	if (token) {
		headers["Authorization"] = "Bearer " + token;
	}
	const req = await fetch(fullUrl, {
		method,
		headers,
		body,
	});
	let json = await req.json();
	return json;
};
function getToken() {
	return localStorage.getItem("token");
}

export default () => {
	return {
		getToken: async () => {
			return localStorage.getItem("token");
		},
		validateToken: async () => {
			let token = getToken();
			let json = await request("post", "/auth/validate", {}, token);
			console.log(json);
			return json;
		},
		login: async (email, password) => {
			let json = await request("post", "/auth/login", { email, password });
			return json;
		},
		logout: async () => {
			let token = localStorage.getItem("token");
			let json = await request("post", "/auth/logout", {}, token);
			localStorage.removeItem("token");
			return json;
		},
		getWall: async () => {
			let token = getToken();
			let json = await request("get", "/walls", {}, token);
			return json;
		},
		updateWall: async (id, params) => {
			let token = getToken();
			let json = await request("put", `/wall/${id}`, params, token);
			return json;
		},
		addWall: async (params) => {
			let token = getToken();
			let json = await request("post", "/walls", params, token);
			return json;
		},
		removeWall: async (id) => {
			let token = getToken();
			let json = await request("delete", `/wall/${id}`, {}, token);
			return json;
		},
		getDocuments: async () => {
			let token = getToken();
			let json = await request("get", "/docs", {}, token);
			return json;
		},

		addDocument: async (params) => {
			let token = getToken();
			let formData = new FormData();
			formData.append("title", params.title);
			if (params.file) {
				formData.append("file", params.file);
			}
			let req = await fetch(baseUrl + "/docs", {
				method: "POST",
				headers: {
					Authorization: "Bearer " + token,
				},
				body: formData,
			});
			let json = await req.json();
			return json;
		},
		updateDocument: async (id, params) => {
			let token = getToken();
			let formData = new FormData();
			formData.append("title", params.title);
			if (params.file) {
				formData.append("file", params.file);
			}
			let req = await fetch(baseUrl + `/doc/${id}`, {
				method: "POST",
				headers: {
					Authorization: "Bearer " + token,
				},
				body: formData,
			});
			let json = await req.json();
			return json;
		},
		removeDocument: async (id) => {
			let token = getToken();
			let json = await request("delete", `/doc/${id}`, {}, token);
			return json;
		},
		getReservations: async () => {
			let token = getToken();
			let json = await request("get", "/reservations", {}, token);
			return json;
		},

		// updateReservation(id, params);, addReservation(params);, removeReservation(id);
		updateReservation: async (id, params) => {
			let token = getToken();
			let json = await request("put", `/reservation/${id}`, params, token);
			return json;
		},
		addReservation: async (params) => {
			let token = getToken();
			let json = await request("post", "/reservations", params, token);
			return json;
		},
		removeReservation: async (id) => {
			let token = getToken();
			let json = await request("delete", `/reservation/${id}`, {}, token);
			return json;
		},
		//api.getWarnings()
		getWarnings: async () => {
			let token = getToken();
			let json = await request("get", "/warnings", {}, token);
			return json;
		},
		//api.updateWarning(id);
		updateWarning: async (id) => {
			let token = getToken();
			let json = await request("put", `/warning/${id}`, {}, token);
			return json;
		},
		//api.getFoundAndLost()
		getFoundAndLost: async () => {
			let token = getToken();
			let json = await request("get", "/foundandlost", {}, token);
			return json;
		},
		//api.updateFoundAndLost(id);
		updateFoundAndLost: async (id) => {
			let token = getToken();
			let json = await request("put", `/foundandlost/${id}`, {}, token);
			return json;
		},
		//getUsers()
		getUsers: async () => {
			let token = getToken();
			let json = await request("get", "/users", {}, token);
			return json;
		},
		//api.addUser(params);
		addUser: async (params) => {
			let token = getToken();
			let json = await request("post", "/users", params, token);
			return json;
		},
		//api.updateUser(id, params);
		updateUser: async (id, params) => {
			let token = getToken();
			let json = await request("put", `/user/${id}`, params, token);
			return json;
		},
		//api.removeUser(id);
		removeUser: async (id) => {
			let token = getToken();
			let json = await request("delete", `/user/${id}`, {}, token);
			return json;
		},
		//let json = await api.getAreas();
		getAreas: async () => {
			let token = getToken();
			let json = await request("get", "/areas", {}, token);
			return json;
		},
		//api.addArea(params);
		addArea: async (params) => {
			let token = getToken();
			let formData = new FormData();
			//adicionar tudo que está no params para o formData
			for (let key in params) {
				formData.append(key, params[key]);
			}
			let req = await fetch(baseUrl + "/areas", {
				method: "POST",
				headers: {
					Authorization: "Bearer " + token,
				},
				body: formData,
			});
			let json = await req.json();
			return json;
		},
		//api.updateArea(id, params);
		updateArea: async (id, params) => {
			let token = getToken();
			let formData = new FormData();
			//adicionar tudo que está no params para o formData
			for (let key in params) {
				formData.append(key, params[key]);
			}
			let req = await fetch(baseUrl + `/area/${id}`, {
				method: "POST",
				headers: {
					Authorization: "Bearer " + token,
				},
				body: formData,
			});
			let json = await req.json();
			return json;
		},
		updateAreaAllowed: async (id) => {
			let token = getToken();
			let json = await request("put", `/area/${id}/allowed`, {}, token);
			return json;
		},
		//api.removeArea(id);
		removeArea: async (id) => {
			let token = getToken();
			let json = await request("delete", `/area/${id}`, {}, token);
			return json;
		},
		// api.getUnits();
		getUnits: async () => {
			let token = getToken();
			let json = await request("get", "/units", {}, token);
			return json;
		},
		// api.addUnit(params);
		addUnit: async (params) => {
			let token = getToken();
			let json = await request("post", "/units", params, token);
			return json;
		},
		// api.updateUnit(id, params);
		updateUnit: async (id, params) => {
			let token = getToken();
			let json = await request("put", `/unit/${id}`, params, token);
			return json;
		},
		// api.removeUnit(id);
		removeUnit: async (id) => {
			let token = getToken();
			let json = await request("delete", `/unit/${id}`, {}, token);
			return json;
		},
		searchUser: async (query) => {
			let token = getToken();
			let json = await request("get", "/users/search", { q: query }, token);
			return json;
		},
		//get profile
	};
};
