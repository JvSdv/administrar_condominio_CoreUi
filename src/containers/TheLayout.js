import { CModal } from "@coreui/react";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import useApi from "../services/api";
import { TheContent, TheSidebar, TheFooter } from "./index";

/* export default () => {
	return {
        getToken: async () => {
            return localStorage.getItem("token");
        },
        validateToken: async (token) => {
            let token = localStorage.getItem("token");
            if (token) {
                let json = await request("get", "/auth/validate", {}, token);
                return json;
            }
        },
		login: (email, password) => {
            let json = await request("post", "/auth/login", { email, password });
            return json;
        },
	};
}; dentro de minha api */

const TheLayout = () => {
	const api = useApi();
	const history = useHistory();

	const [loading, setLoading] = useState(true);
	//const [token, setToken] = useState(null);
	const [loadTime, setLoadTime] = useState(10);

	//enquanto o loading estiver true, aumentar o loadTime em 1 segundo, e quando o loading for false, zerar o loadTime para 0 e vamos usar esse numero para criar uma progress bar
	if (loadTime > 0) {
		if (loading) {
			setTimeout(() => {
				setLoadTime(loadTime + 10);
			}, 1000);
		} else {
			setLoadTime(0);
		}
	}

	useEffect(() => {
		checkLogin();
	}, []);

	//checar o login
	async function checkLogin() {
		let token = await api.getToken();
		if (token) {
			let json = await api.validateToken();
			if (json.error === "") {
				setLoading(false);
			} else {
				setLoading(false);
				alert(json.error);
				//limpar o token
				localStorage.removeItem("token");
				history.push("/login");
			}
		} else {
			setLoading(false);
			history.push("/login");
		}
	}

	return (
		<div className="c-app c-default-layout">
			{!loading && (
				<>
					<TheSidebar />
					<div className="c-wrapper">
						{/* <TheHeader/> */}
						<div className="c-body">
							<TheContent />
						</div>
						<TheFooter />
					</div>
				</>
			)}
			{loading && (
				<CModal
					show={loadTime > 10}
					onClose={() => setLoading(false)}
					size="sm"
					centered
					backdrop="static"
					keyboard={false}
					className="text-center"
				>
					<div className="c-modal-header">
						<h4 className="c-modal-title h1">Carregando...</h4>
					</div>
					<div className="c-modal-body">
						{/* //fazer uma progress bar */}
						<div className="progress mx-2 mt-1 mb-3">
							<div
								className="progress-bar progress-bar-striped progress-bar-animated"
								role="progressbar"
								style={{ width: `${loadTime}%` }}
								aria-valuenow={loadTime}
								aria-valuemin="0"
								aria-valuemax="100"
							></div>
						</div>
					</div>
				</CModal>
			)}
		</div>
	);
};

export default TheLayout;
