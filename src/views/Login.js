import React from "react";
import { Link, useHistory } from "react-router-dom";
import {
	CAlert,
	CButton,
	CCard,
	CCardBody,
	CCardGroup,
	CCol,
	CContainer,
	CForm,
	CInput,
	CInputGroup,
	CInputGroupPrepend,
	CInputGroupText,
	CRow,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import useApi from "src/services/api";

/* login: async (email, password) => {
			let json = await request("post", "/auth/login", { email, password });
			return json;
		}, */

const Login = () => {
	const api = useApi();
	const history = useHistory();

	const [email, setEmail] = React.useState("suporte@b7web.com.br");
	const [password, setPassword] = React.useState("1234");
	const [error, setError] = React.useState("");
	const [loading, setLoading] = React.useState(false);

	const handleSubmit = (e) => {
		e.preventDefault();
		if (email === "" || password === "") {
			setError("Preencha todos os campos");
		} else {
			setLoading(true);
			api.login(email, password).then((json) => {
				setLoading(false);
				if (json.error === "") {
					localStorage.setItem("token", json.token);
					history.push("/");
				} else {
					setError(json.error);
				}
			});
		}
	};

	return (
		<div className="c-app c-default-layout flex-row align-items-center">
			<CContainer>
				<CRow className="justify-content-center">
					<CCol md="5">
						<CCardGroup>
							<CCard className="p-4">
								<CCardBody>
									<CForm onSubmit={handleSubmit}>
										<h1>Login</h1>
										<p className="text-muted">
											Utilizamos o mesmo usuário para consumir a API
											de administração, pode conferir e até alterar
											os dados
										</p>

										{error && (
											<CAlert color="danger"> {error} </CAlert>
										)}

										<CInputGroup className="mb-3">
											<CInputGroupPrepend>
												<CInputGroupText>
													<CIcon name="cil-user" />
												</CInputGroupText>
											</CInputGroupPrepend>
											<CInput
												disabled={loading}
												type="text"
												placeholder="E-mail"
												autoComplete="email"
												value={email}
												onChange={(e) => setEmail(e.target.value)}
											/>
										</CInputGroup>

										<CInputGroup className="mb-4">
											<CInputGroupPrepend>
												<CInputGroupText>
													<CIcon name="cil-lock-locked" />
												</CInputGroupText>
											</CInputGroupPrepend>
											<CInput
												disabled={loading}
												type="password"
												placeholder="Senha"
												autoComplete="current-password"
												value={password}
												onChange={(e) =>
													setPassword(e.target.value)
												}
											/>
										</CInputGroup>

										<CRow>
											<CCol xs="6">
												<CButton
													color="primary"
													className="px-4"
													type="submit"
													disabled={loading}
												>
													{loading ? "Carregando..." : "Entrar"}
												</CButton>
											</CCol>
										</CRow>
									</CForm>
									{/*  */}
								</CCardBody>
							</CCard>
						</CCardGroup>
					</CCol>
				</CRow>
			</CContainer>
		</div>
	);
};

export default Login;
