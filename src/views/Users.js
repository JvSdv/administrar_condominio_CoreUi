import CIcon from "@coreui/icons-react";
import {
	CRow,
	CCol,
	CCard,
	CCardHeader,
	CCardBody,
	CButton,
	CModal,
	CModalHeader,
	CModalBody,
	CModalFooter,
	CForm,
	CDataTable,
	CButtonGroup,
	CInput,
	CLabel,
	CFormGroup,
	CTextarea,
	CSelect,
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import useApi from "src/services/api";

export default function Wall() {
	const api = useApi();

	//states
	const [list, setList] = React.useState([]);
	const [loading, setLoading] = React.useState(true);
	const [modalEdit, setModalEdit] = useState(false);
	const [modalAdd, setModalAdd] = useState(false);
	const [item, setItem] = React.useState({});
	const [loadingEdit, setLoadingEdit] = useState(false);

	//fields da tabela
	/* a resposta vem assim: {id: 150, title: 'teste 1', body: 'teste 01', datecreated: '28/06/2022 16:09'} */
	const fields = [
		{ label: "Nome", key: "name" },
		{ label: "Email", key: "email" },
		{ label: "CPF", key: "cpf" },
		{
			label: "Ações",
			key: "actions",
			_style: { width: "20%" },
			sorter: false,
			filter: false,
		},
	];

	//quando carregar a tela carregar a lista de avisos
	useEffect(() => {
		getList();
	}, []);
	//verificar o item
	useEffect(() => {
		console.log(item);
	}, [item]);

	//funções
	function handleNewItem() {
		setItem({ id: 0, name: "", email: "", cpf: "" });
		setModalAdd(true);
	}

	function handleEditItem(item) {
		setItem(item);
		setModalEdit(true);
	}

	//pegar a lista de Usuários //READ
	async function getList() {
		setLoading(true);
		let json = await api.getUsers();
		if (json.error === "") {
			setList(json.list);
			console.log(json.list);
			setLoading(false);
		} else {
			setLoading(false);
			alert(json.error);
		}
	}

	//editar um usuario e adicionar um novo usuario //UPDATE //CREATE
	async function editAviso(item) {
		if (modalEdit) {
			if (item.id && item.name && item.email && item.cpf) {
				let data = {
					name: item.name,
					email: item.email,
					cpf: item.cpf,
				};
				if (item.password) {
					if (item.password === item.password2) {
						data.password = item.password;
					} else {
						alert("As senhas não conferem");
						return;
					}
				}
				setLoadingEdit(true);
				const json = await api.updateUser(item.id, data);
				if (json.error === "") {
					setLoadingEdit(false);
					setModalEdit(false);
					getList();
				} else {
					setLoadingEdit(false);
					alert(json.error);
				}
			} else {
				alert("Preencha todos os campos");
			}
		}
		if (modalAdd) {
			if (item.name && item.email && item.cpf && item.password) {
				let data = {
					name: item.name,
					email: item.email,
					cpf: item.cpf,
				};
				if (item.password === item.password2) {
					data.password = item.password;
				} else {
					alert("As senhas não conferem");
					return;
				}
				setLoadingEdit(true);
				const json = await api.addUser(data);
				if (json.error === "") {
					setLoadingEdit(false);
					setModalAdd(false);
					getList();
				} else {
					setLoadingEdit(false);
					alert(json.error);
				}
			} else {
				alert("Preencha todos os campos");
			}
		}
	}
	//excluir um aviso //DELETE
	async function handleRemoveItem(id) {
		//perguntar se deseja excluir
		if (window.confirm("Deseja excluir?")) {
			const json = await api.removeUser(id);
			if (json.error === "") {
				getList();
			} else {
				alert(json.error);
			}
		}
	}

	return (
		<>
			<CRow>
				<CCol>
					<h2>Usuários</h2>

					<CCard>
						<CCardHeader>
							<CButton
								color="primary"
								onClick={() => handleNewItem()}

								//enquanto o array de units e areas estiver vazio, desabilitar o botão
							>
								<CIcon name="cil-check" /> Novo Usuário
							</CButton>
						</CCardHeader>
						<CCardBody>
							{loading && (
								<div className="text-center">
									<div
										className="spinner-border text-primary"
										role="status"
									>
										<span className="sr-only">Loading...</span>
									</div>
								</div>
							)}
							{!loading && (
								/* a resposta vem assim: {id: 150, title: 'teste 1', body: 'teste 01', datecreated: '28/06/2022 16:09'} */
								<CDataTable
									items={list}
									fields={fields}
									hover
									noItemsViewSlot={" No items found."}
									sorter={true}
									columnFilter
									striped
									bordered
									pagination
									itemsPerPage={5}
									//actions tem que ter dois botões, um para editar e outro para excluir
									scopedSlots={{
										reservation_date: (item) => (
											<td>{item.reservation_date_formatted}</td>
										),
										actions: (item) => (
											<td>
												<CButtonGroup>
													<CButton
														color="info"
														onClick={() => {
															handleEditItem(item);
														}}
													>
														Editar
														<CIcon name="cil-pencil" />
													</CButton>

													<CButton
														color="danger"
														onClick={() => {
															//aqui já fazemos direto a exclusão já para api
															handleRemoveItem(item.id);
														}}
													>
														Excluir
														<CIcon name="cil-trash" />
													</CButton>
												</CButtonGroup>
											</td>
										),
									}}
								/>
							)}
						</CCardBody>
					</CCard>
				</CCol>
			</CRow>

			<CModal
				show={modalEdit || modalAdd}
				onClose={() => setModalEdit(false) | setModalAdd(false)}
			>
				<CModalHeader closeButton>
					{modalEdit ? "Editar Usuário" : "Adicionar Usuário"}
				</CModalHeader>
				<CModalBody>
					<CForm>
						<CFormGroup>
							<CLabel htmlFor="name">Nome</CLabel>
							<CInput
								type="text"
								id="name"
								name="name"
								value={item.name}
								onChange={(e) => {
									setItem({ ...item, name: e.target.value });
								}}
							/>

							<CLabel htmlFor="email">Email</CLabel>
							<CInput
								type="email"
								id="email"
								name="email"
								value={item.email}
								onChange={(e) => {
									setItem({ ...item, email: e.target.value });
								}}
							/>

							<CLabel htmlFor="cpf">CPF</CLabel>
							<CInput
								type="text"
								id="cpf"
								name="cpf"
								value={item.cpf}
								onChange={(e) => {
									setItem({ ...item, cpf: e.target.value });
								}}
							/>
						</CFormGroup>

						<CFormGroup>
							<CLabel htmlFor="password">Senha</CLabel>
							<CInput
								type="password"
								id="password"
								name="password"
								value={item.password}
								onChange={(e) => {
									setItem({ ...item, password: e.target.value });
								}}
							/>
						</CFormGroup>

						<CFormGroup>
							<CLabel htmlFor="confirm">Confirmar Senha</CLabel>
							<CInput
								type="password"
								id="confirm"
								name="confirm"
								value={item.password2}
								onChange={(e) => {
									setItem({ ...item, password2: e.target.value });
								}}
							/>
						</CFormGroup>
					</CForm>
				</CModalBody>
				<CModalFooter>
					<CButton
						color="primary"
						disabled={loadingEdit}
						onClick={() => editAviso(item)}
					>
						{loadingEdit ? "Salvando..." : "Salvar"}
					</CButton>
					<CButton
						color="secondary"
						onClick={() => setModalEdit(false) | setModalAdd(false)}
					>
						Cancelar
					</CButton>
				</CModalFooter>
			</CModal>
		</>
	);
}
