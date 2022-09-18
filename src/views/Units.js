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

let timer;

export default function Wall() {
	const api = useApi();

	//states
	const [list, setList] = React.useState([]);
	const [loading, setLoading] = React.useState(true);
	const [modalEdit, setModalEdit] = useState(false);
	const [modalAdd, setModalAdd] = useState(false);
	const [item, setItem] = React.useState({});
	const [loadingEdit, setLoadingEdit] = useState(false);
	//campo para a busca
	const [OwnerSearchField, setOwnerSearchField] = React.useState("");
	//campo para a lista de usuários
	const [modalOwnerList, setModalOwnerList] = React.useState([]);
	// aqui vamos salvar um objeto de proprietario com o nome e o id e depois vamos salvar no item
	//armazenamos no proprio item essa variavel
	//const [modalOwnerField, setModalOwnerField] = React.useState(null);

	//fields da tabela
	/* a resposta vem assim: {id: 150, title: 'teste 1', body: 'teste 01', datecreated: '28/06/2022 16:09'} */
	const fields = [
		{ label: "Unidade", key: "name", sorter: false },
		{ label: "Proprietário", key: "name_owner" },
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
	//quando ownwerSearchField mudar, esperar um segundo e depois buscar
	useEffect(() => {
		if (OwnerSearchField !== "") {
			//enquanto a pessoa estiver digitando, não buscar
			clearTimeout(timer);
			timer = setTimeout(() => {
				getOwnerList();
			}, 1000);
		}
		setModalOwnerList([]);
	}, [OwnerSearchField]);

	//funções
	function handleNewItem() {
		setItem({
			name: "",
			name_owner: "",
			id_owner: "",
		});
		setModalAdd(true);
	}

	function handleEditItem(item) {
		setItem(item);
		setModalEdit(true);
	}

	function selectModalOwnerField(id) {
		let Owner = modalOwnerList.find((item) => item.id === parseInt(id));
		let OwnerData = { id: Owner.id, name: Owner.name };
		//setItem({ ...item, owner: OwnerData });
		//se item tiver owner deixar null o campo de item.id_owner
		if (item.id_owner) {
			setItem({ ...item, id_owner: null, owner: OwnerData });
		} else {
			setItem({ ...item, owner: OwnerData });
		}
		setOwnerSearchField("");
	}

	//pegar a lista de reservas //READ
	async function getList() {
		setLoading(true);
		let json = await api.getUnits();
		if (json.error === "") {
			setList(json.list);
			console.log(json.list);
			setLoading(false);
		} else {
			setLoading(false);
			alert(json.error);
		}
	}

	//pegar a lista de donos //READ
	async function getOwnerList() {
		let json = await api.searchUser(OwnerSearchField);
		if (json.error === "") {
			setModalOwnerList(json.list);
		} else {
			alert(json.error);
		}
	}

	//editar um aviso e adicionar um novo aviso //UPDATE //CREATE
	async function editAviso(item) {
		if (modalEdit) {
			if (item.id && item.name) {
				let data = {
					name: item.name,
				};
				if (item.owner) {
					data.id_owner = item.owner.id;
				} else {
					if (item.id_owner !== null) {
						data.id_owner = item.id_owner;
					} else {
						return alert("Por favor, selecione um proprietário");
					}
				}
				setLoadingEdit(true);
				const json = await api.updateUnit(item.id, data);
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
			if (item.name && item.owner) {
				let data = {
					name: item.name,
					id_owner: item.owner.id,
				};
				setLoadingEdit(true);
				const json = await api.addUnit(data);
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
			const json = await api.removeUnit(id);
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
					<h2>Unidades</h2>

					<CCard>
						<CCardHeader>
							<CButton
								color="primary"
								onClick={handleNewItem}
								//enquanto o array de units e areas estiver vazio, desabilitar o botão
							>
								<CIcon name="cil-check" /> Nova Unidade
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
										name_owner: (item) => (
											<td>{item.name_owner ?? "Não definido"}</td>
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
					{modalEdit ? "Editar Unidade" : "Adicionar Unidade"}
				</CModalHeader>
				<CModalBody>
					<CForm>
						{/*  */}
						<CFormGroup>
							<CLabel htmlFor="modal-name">Nome da unidade</CLabel>
							<CInput
								type="text"
								id="modal-name"
								name="name"
								value={item.name}
								onChange={(e) => {
									setItem({ ...item, name: e.target.value });
								}}
							/>
						</CFormGroup>

						<CFormGroup>
							<CLabel htmlFor="modal-owner">
								Proprietário (nome ou cpf ou e-mail)
							</CLabel>
							<CInput
								type="text"
								id="modal-owner"
								value={OwnerSearchField}
								onChange={(e) => {
									setOwnerSearchField(e.target.value);
								}}
							/>
							{modalOwnerList.length > 0 && (
								<CSelect
									sizeHtml={5}
									id="modal-owner-select"
									onChange={(e) => {
										selectModalOwnerField(e.target.value);
									}}
								>
									{modalOwnerList.map((owner) => (
										<option key={owner.id} value={owner.id}>
											{owner.name}
										</option>
									))}
								</CSelect>
							)}

							{item.owner && (
								<>
									<br />
									<CButton
										color="danger"
										onClick={() => setItem({ ...item, owner: null })}
									>
										Remover proprietário:{" "}
										{item.owner.name ?? "Não definido"}
									</CButton>
								</>
							)}
							{item.id_owner && (
								<>
									<br />
									<CButton
										color="danger"
										onClick={() =>
											setItem({ ...item, id_owner: null })
										}
									>
										Remover proprietário:{" "}
										{item.name_owner
											? item.name_owner
											: item.id_owner}
									</CButton>
								</>
							)}
						</CFormGroup>
						{/*  */}
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
