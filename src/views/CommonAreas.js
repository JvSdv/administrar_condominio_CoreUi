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
	CImg,
	CSwitch,
	CInputCheckbox,
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import useApi from "src/services/api";

export default function Wall() {
	const api = useApi();

	let dias = [
		{ value: "0", label: "Segunda-feira" },
		{ value: "1", label: "Terça-feira" },
		{ value: "2", label: "Quarta-feira" },
		{ value: "3", label: "Quinta-feira" },
		{ value: "4", label: "Sexta-feira" },
		{ value: "5", label: "Sábado" },
		{ value: "6", label: "Domingo" },
	];

	//states
	const [list, setList] = React.useState([]);
	const [loading, setLoading] = React.useState(true);
	const [modalEdit, setModalEdit] = useState(false);
	const [modalAdd, setModalAdd] = useState(false);
	const [item, setItem] = React.useState({});
	const [loadingEdit, setLoadingEdit] = useState(false);
	const [diasSelecionados, setDiasSelecionados] = useState([]);

	//fields da tabela
	/* a resposta vem assim: {allowed: 1
	cover: "https://api.b7web.com.br/devcond/storage/4gm2AS0xchQstHNEvMkTwGuQjy2Epf08DV1RP0Iu.jpg"
	days: "5,6"
	end_time: "23:59"
	id: 14
	start_time: "08:00"
	title: "Churrasqueira (Finais de Semana)"} */
	const fields = [
		{ label: "Permitida", key: "allowed", filter: false },
		{ label: "Título", key: "title" },
		{ label: "Imagem", key: "cover", sorter: false, filter: false },
		{ label: "Dias de Funcionamento", key: "days", sorter: false },
		{ label: "Horário de início", key: "start_time", sorter: false },
		{ label: "Horário de fim", key: "end_time", sorter: false },
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
		console.log(diasSelecionados);
	}, [item]);

	useEffect(() => {
		const string = diasSelecionados.join(",");
		setItem({
			...item,
			days: string,
		});
	}, [diasSelecionados]);

	//funções
	function handleNewItem() {
		setItem({});
		setModalAdd(true);
	}

	function handleEditItem(item) {
		setDiasSelecionados(item.days.split(","));
		setItem(item);
		setModalEdit(true);
	}

	//pegar a lista de reservas //READ
	async function getList() {
		setLoading(true);
		let json = await api.getAreas();
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
			if (
				item.id &&
				item.allowed &&
				item.title &&
				item.days &&
				item.start_time &&
				item.end_time
			) {
				let data = {
					id: item.id,
					allowed: item.allowed,
					title: item.title,
					days: item.days,
					start_time: item.start_time,
					end_time: item.end_time,
				};
				if (item.cover) {
					//se for um link de imagem nao enviar o arquivo
					if (item.cover.indexOf("http") === -1) {
						data.cover = item.cover;
					}
				}
				setLoadingEdit(true);
				const json = await api.updateArea(item.id, data);
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
			if (
				item.allowed &&
				item.cover &&
				item.title &&
				item.days &&
				item.start_time &&
				item.end_time
			) {
				let data = {
					allowed: item.allowed,
					cover: item.cover,
					title: item.title,
					days: item.days,
					start_time: item.start_time,
					end_time: item.end_time,
				};
				setLoadingEdit(true);
				const json = await api.addArea(data);
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
			const json = await api.removeArea(id);
			if (json.error === "") {
				getList();
			} else {
				alert(json.error);
			}
		}
	}

	async function handleAllowedItem(id) {
		const json = await api.updateAreaAllowed(id);
		if (json.error === "") {
			getList();
		} else {
			alert(json.error);
		}
	}

	return (
		<>
			<CRow>
				<CCol>
					<h2>Áreas Comuns</h2>

					<CCard>
						<CCardHeader>
							<CButton
								color="primary"
								onClick={handleNewItem}
								//enquanto o array de units e areas estiver vazio, desabilitar o botão
							>
								<CIcon name="cil-check" /> Nova Área
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
										//cover colocar a imagem piquena
										cover: (item) => (
											<td className="my-auto">
												<CImg
													src={item.cover}
													alt="..."
													className="rounded"
													width="120px"
												/>
											</td>
										),
										allowed: (item) => (
											<td className="my-auto">
												<CSwitch
													color="success"
													checked={item.allowed === 1}
													onChange={() =>
														handleAllowedItem(item.id)
													}
												/>
											</td>
										),
										days: (item) => {
											let diasformatados = dias;
											let days = item.days.split(",");
											let daysList = [];
											days.forEach((day) => {
												diasformatados.forEach((dia) => {
													if (day === dia.value) {
														daysList.push(dia.label);
													}
												});
											});
											return <td>{daysList.join(", ")}</td>;
										},
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
					{modalEdit ? "Editar Reserva" : "Adicionar Reserva"}
				</CModalHeader>
				<CModalBody>
					<CForm>
						{/* item.title && item.cover[img] && item.days && item.start_time && item.end_time */}
						<CFormGroup>
							<CLabel htmlFor="title">Título</CLabel>
							<CInput
								type="text"
								id="title"
								name="title"
								placeholder="Título"
								value={item.title}
								onChange={(e) =>
									setItem({ ...item, title: e.target.value })
								}
							/>
						</CFormGroup>

						<CFormGroup>
							<CLabel htmlFor="allowed">Permitido</CLabel>
							<CSwitch
								className="d-block"
								color="success"
								checked={item.allowed === 1}
								onChange={() =>
									setItem({
										...item,
										allowed: item.allowed === 1 ? 0 : 1,
									})
								}
							/>
						</CFormGroup>

						<CFormGroup>
							<CLabel htmlFor="cover">Imagem</CLabel>
							<CInput
								type="file"
								id="cover"
								name="cover"
								onChange={(e) =>
									setItem({ ...item, cover: e.target.files[0] })
								}
							/>
						</CFormGroup>

						<CFormGroup>
							<CLabel htmlFor="modal-days">Dias de Funcionamento</CLabel>
							{/* (parameter) dia: {
									value: string;
									label: string;
								} */}
							{dias.map((dia) => (
								<div className="ml-4">
									<CInputCheckbox
										id="modal-days"
										name="modal-days"
										value={dia.value}
										checked={diasSelecionados.includes(dia.value)}
										onChange={() => {
											if (diasSelecionados.includes(dia.value)) {
												//se tiver remove
												setDiasSelecionados(
													diasSelecionados.filter(
														(day) => day !== dia.value
													)
												);
											} else {
												setDiasSelecionados([
													...diasSelecionados,
													dia.value,
												]);
											}
										}}
									/>
									<span>{dia.label}</span>
								</div>
							))}
						</CFormGroup>

						{/* <CInput
								type="text"
								id="days"
								name="days"
								placeholder="Dias"
								value={item.days}
								onChange={(e) =>
									setItem({ ...item, days: e.target.value })
								}
							/> */}

						<CFormGroup>
							<CLabel htmlFor="start_time">Início</CLabel>
							<CInput
								type="time"
								id="start_time"
								name="start_time"
								placeholder="Início"
								value={item.start_time}
								onChange={(e) =>
									setItem({ ...item, start_time: e.target.value })
								}
							/>
						</CFormGroup>

						<CFormGroup>
							<CLabel htmlFor="end_time">Fim</CLabel>
							<CInput
								type="time"
								id="end_time"
								name="end_time"
								placeholder="Fim"
								value={item.end_time}
								onChange={(e) =>
									setItem({ ...item, end_time: e.target.value })
								}
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
