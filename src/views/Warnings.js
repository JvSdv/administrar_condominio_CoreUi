import {
	CRow,
	CCol,
	CCard,
	CCardBody,
	CButton,
	CDataTable,
	CSwitch,
} from "@coreui/react";
import React, { useEffect } from "react";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import useApi from "src/services/api";

export default function Wall() {
	const api = useApi();

	//states
	const [list, setList] = React.useState([]);
	const [loading, setLoading] = React.useState(true);
	const [item, setItem] = React.useState([]);
	const [photoList, setPhotoList] = React.useState([]);
	const [activeIndex, setActiveIndex] = React.useState(0);

	//fields da tabela
	/* a resposta vem assim: {id: 150, title: 'teste 1', body: 'teste 01', datecreated: '28/06/2022 16:09'} */
	const fields = [
		{ label: "Resolvido", key: "status", filter: false },
		{ label: "Unidade", key: "name_unit" },
		{ label: "Título", key: "title" },
		{ label: "Fotos", key: "photos", filter: false, sorter: false },
		{ label: "Data", key: "datecreated" },
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

	//pegar a lista de Ocorrências //READ
	async function getList() {
		setLoading(true);
		let json = await api.getWarnings();
		if (json.error === "") {
			setList(json.list);
			console.log(json.list);
			setLoading(false);
		} else {
			setLoading(false);
			alert(json.error);
		}
	}

	//editar ocorrência //UPDATE
	async function handleSwitchClick(item) {
		setLoading(true);
		let json = await api.updateWarning(item.id);
		setLoading(false);
		if (json.error === "") {
			getList();
		} else {
			alert(json.error);
		}
	}

	//abrir o modal de edição
	function showLightbox(photos) {
		setPhotoList(photos);
		setActiveIndex(0);
	}

	return (
		<>
			<CRow>
				<CCol>
					<h2>Ocorrências</h2>

					<CCard>
						<CCardBody>
							<CDataTable
								items={list}
								fields={fields}
								hover
								loading={loading}
								noItemsViewSlot={" No items found."}
								sorter={true}
								columnFilter
								striped
								bordered
								pagination
								itemsPerPage={5}
								//actions tem que ter dois botões, um para editar e outro para excluir
								scopedSlots={{
									datecreated: (item) => (
										<td>{item.datecreated_formatted}</td>
									),
									//photos vai vir um array de fotos e abrir as fotos clicando no botão
									photos: (item) => (
										<td>
											{item.photos.length > 0 && (
												<CButton
													color="success"
													onClick={() => showLightbox(item.photos)}
												>
													({item.photos.length})Foto
													{item.photos.length > 1 ? "s" : ""}
												</CButton>
											)}
										</td>
									),
									//status vai ser um switch para mudar o status
									status: (item) => (
										<td>
											<CSwitch
												//v
												color="success"
												checked={item.status === "RESOLVED"}
												onChange={() => {
													setItem(item);
													handleSwitchClick(item);
												}}
											/>
										</td>
									),
								}}
							/>
						</CCardBody>
					</CCard>
				</CCol>
			</CRow>

			{photoList.length > 0 && (
				<Lightbox
					onCloseRequest={() => setPhotoList([])}
					mainSrc={photoList[activeIndex]}
					nextSrc={photoList[(activeIndex + 1) % photoList.length]}
					prevSrc={
						photoList[
							(activeIndex + photoList.length - 1) % photoList.length
						]
					}
					onMovePrevRequest={() =>
						setActiveIndex(
							(activeIndex + photoList.length - 1) % photoList.length
						)
					}
					onMoveNextRequest={() =>
						setActiveIndex((activeIndex + 1) % photoList.length)
					}
				/>
			)}
		</>
	);
}
