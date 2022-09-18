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
		{ label: "Título", key: "title" },
		{
			label: "Data de Criação",
			key: "datecreated",
			_style: { width: "200px" },
		},
		{ label: "Ações", key: "actions", _style: { width: "20%" } },
	];

	//quando carregar a tela carregar a lista de avisos
	useEffect(() => {
		getList();
	}, []);

	//funções

	function handleNewItem() {
		setItem({
			id: 0,
			title: "",
			body: "",
			datecreated: "",
		});
		console.log(item);
		setModalAdd(true);
	}

	//pegar a lista de avisos //READ
	async function getList() {
		setLoading(true);
		let json = await api.getWall();
		if (json.error === "") {
			setList(json.list);
			console.log(json.list);
			setLoading(false);
		} else {
			setLoading(false);
			alert(json.error);
		}
	}

	//editar um aviso e adicionar um novo aviso //UPDATE //CREATE
	async function editAviso(item) {
		if (modalEdit) {
			if (item.title && item.body) {
				setLoadingEdit(true);
				const json = await api.updateWall(item.id, {
					title: item.title,
					body: item.body,
				});
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
			if (item.title && item.body) {
				setLoadingEdit(true);
				const json = await api.addWall({
					title: item.title,
					body: item.body,
				});
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
			const json = await api.removeWall(id);
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
					<h2>
						<CIcon
							name="cil-people"
							className="h2 mr-1"
							height={"20px"}
						/>
						Mural de Avisos
					</h2>

					<CCard>
						<CCardHeader>
							<CButton color="primary" onClick={handleNewItem}>
								<CIcon name="cil-check" /> Adicionar Aviso
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
									striped
									bordered
									pagination
									itemsPerPage={5}
									//actions tem que ter dois botões, um para editar e outro para excluir
									scopedSlots={{
										actions: (item) => (
											<td>
												<CButtonGroup>
													<CButton
														color="info"
														onClick={() => {
															setItem(item);
															setModalEdit(true);
														}}
													>
														Editar
														<CIcon name="cil-pencil" />
													</CButton>
													<CButton
														color="danger"
														onClick={() => {
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
					{modalEdit ? "Editar Aviso" : "Adicionar Aviso"}
				</CModalHeader>
				<CModalBody>
					<CForm>
						<CFormGroup>
							<CLabel htmlFor="title">Título</CLabel>
							<CInput
								type="text"
								id="title"
								name="title"
								value={item.title}
								onChange={(e) => {
									setItem({ ...item, title: e.target.value });
								}}
							/>
						</CFormGroup>
						<CFormGroup>
							<CLabel htmlFor="body">Texto</CLabel>
							<CTextarea
								id="body"
								name="body"
								value={item.body}
								onChange={(e) => {
									setItem({ ...item, body: e.target.value });
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
