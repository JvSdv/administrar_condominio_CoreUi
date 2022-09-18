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
	const [UnitList, setUnitList] = React.useState([]);
	const [AreaList, setAreaList] = React.useState([]);

	//fields da tabela
	/* a resposta vem assim: {id: 150, title: 'teste 1', body: 'teste 01', datecreated: '28/06/2022 16:09'} */
	const fields = [
		{ label: "Unidade", key: "name_unit", sorter: false },
		{ label: "Área", key: "name_area" },
		{ label: "Data da reserva", key: "reservation_date" },
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
		getUnitList();
		getAreaList();
	}, []);
	//verificar o item
	useEffect(() => {
		console.log(item);
	}, [item]);

	//funções
	function handleNewItem() {
		setItem({});
		setModalAdd(true);
	}

	function handleEditItem(item) {
		setItem(item);
		setModalEdit(true);
	}

	//pegar a lista de reservas //READ
	async function getList() {
		setLoading(true);
		let json = await api.getReservations();
		if (json.error === "") {
			setList(json.list);
			console.log(json.list);
			setLoading(false);
		} else {
			setLoading(false);
			alert(json.error);
		}
	}

	//pegar a lista de unidades //READ
	async function getUnitList() {
		let json = await api.getUnits();
		if (json.error === "") {
			setUnitList(json.list);
			console.log(json.list);
		}
	}

	//pegar a lista de áreas //READ
	async function getAreaList() {
		let json = await api.getAreas();
		if (json.error === "") {
			setAreaList(json.list);
			console.log(json.list);
		}
	}

	//editar um aviso e adicionar um novo aviso //UPDATE //CREATE
	async function editAviso(item) {
		if (modalEdit) {
			if (item.id && item.id_unit && item.id_area && item.reservation_date) {
				let data = {
					id_unit: item.id_unit,
					id_area: item.id_area,
					reservation_date: item.reservation_date,
				};
				setLoadingEdit(true);
				const json = await api.updateReservation(item.id, data);
				if (json.error === "") {
					console.log(json);
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
			if (item.id_unit && item.id_area && item.reservation_date) {
				let data = {
					id_unit: item.id_unit,
					id_area: item.id_area,
					reservation_date: item.reservation_date,
				};
				setLoadingEdit(true);
				const json = await api.addReservation(data);
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
			const json = await api.removeReservation(id);
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
					<h2>Reservas</h2>

					<CCard>
						<CCardHeader>
							<CButton
								color="primary"
								onClick={handleNewItem}
								//enquanto o array de units e areas estiver vazio, desabilitar o botão
								disabled={
									UnitList.length === 0 || AreaList.length === 0
								}
							>
								<CIcon name="cil-check" /> Nova Reserva
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
														disabled={
															UnitList.length === 0 ||
															AreaList.length === 0
														}
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
					{modalEdit ? "Editar Reserva" : "Adicionar Reserva"}
				</CModalHeader>
				<CModalBody>
					<CForm>
						{/* exibir um select dos APT DISPONIVEIS */}
						<CFormGroup>
							<CLabel htmlFor="modal-unit">Unidade</CLabel>
							<CSelect
								id="modal-unit"
								custom
								onChange={(e) => {
									setItem({ ...item, id_unit: e.target.value });
								}}
							>
								<option value="">Selecione</option>
								{UnitList.map((unit) => (
									<option
										key={unit.id}
										value={unit.id}
										selected={item.id_unit === unit.id}
									>
										{unit.name}
									</option>
								))}
							</CSelect>
						</CFormGroup>
						{/* exibir um select das AREA DISPONIVEIS */}
						<CFormGroup>
							<CLabel htmlFor="modal-area">Área</CLabel>
							<CSelect
								id="modal-area"
								custom
								onChange={(e) => {
									setItem({ ...item, id_area: e.target.value });
								}}
							>
								<option value="">Selecione</option>
								{AreaList.map((area) => (
									<option
										key={area.id}
										value={area.id}
										selected={item.id_area === area.id}
									>
										{area.title}
									</option>
								))}
							</CSelect>
						</CFormGroup>

						<CFormGroup>
							<CLabel htmlFor="modal-date">Data de reserva</CLabel>
							<CInput
								type="text"
								id="modal-date"
								name="modal-date"
								value={item.reservation_date}
								onChange={(e) => {
									setItem({
										...item,
										reservation_date: e.target.value,
									});
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
