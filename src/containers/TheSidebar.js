import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
	CCreateElement,
	CSidebar,
	CSidebarNav,
	CSidebarNavTitle,
	CSidebarMinimizer,
	CSidebarNavItem,
} from "@coreui/react";

// sidebar nav config
import navigation from "./_nav";

const TheSidebar = () => {
	const show = useSelector((state) => state.sidebarShow);

	return (
		<CSidebar
			show={show}
			style={{
				backgroundColor: "#0c0c0c",
			}}
		>
			<CSidebarNav>
				<img
					src="/homelogo.png"
					alt="logo"
					className="p-2 my-3 ml-auto mr-auto"
					width={"90%"}
				/>

				<CCreateElement
					items={navigation}
					components={{
						CSidebarNavItem,
						CSidebarNavTitle,
					}}
				/>
			</CSidebarNav>
			<CSidebarMinimizer className="c-d-md-down-none" />
		</CSidebar>
	);
};

export default React.memo(TheSidebar);
