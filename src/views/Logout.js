import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import useApi from "src/services/api";

export default () => {
	const history = useHistory();
	const api = useApi();

	//logout
	useEffect(() => {
		doLogout();
	}, []);

	async function doLogout() {
		await api.logout();
		history.push("/login");
	}

	return null;
};
