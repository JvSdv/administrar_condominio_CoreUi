import React from "react";
import CIcon from "@coreui/icons-react";

const _nav = [
  {
    _tag: "CSidebarNavItem",
    name: "Painel Geral",
    to: "/dashboard",
    icon: <CIcon name="cil-speedometer" customClasses="c-sidebar-nav-icon" />,
    badge: {
      color: "info",
    },
  },
  //titulo 1
  {
    _tag: "CSidebarNavTitle",
    _children: ["Gestão"],
  },
  //avisos
  {
    _tag: "CSidebarNavItem",
    name: "Avisos",
    to: "/wall",
    icon: <CIcon name="cil-warning" customClasses="c-sidebar-nav-icon" />,
  },
  //documentos
  {
    _tag: "CSidebarNavItem",
    name: "Documentos",
    to: "/documents",
    icon: <CIcon name="cil-file" customClasses="c-sidebar-nav-icon" />,
  },
  //reservas
  {
    _tag: "CSidebarNavItem",
    name: "Reservas",
    to: "/reservations",
    icon: <CIcon name="cil-calendar" customClasses="c-sidebar-nav-icon" />,
  },
  //ocorrências
  {
    _tag: "CSidebarNavItem",
    name: "Ocorrências",
    to: "/warnings",
    icon: <CIcon name="cil-bell" customClasses="c-sidebar-nav-icon" />,
  },
  //achados e perdidos
  {
    _tag: "CSidebarNavItem",
    name: "Achados e Perdidos",
    to: "/found-and-lost",
    icon: <CIcon name="cil-lock-locked" customClasses="c-sidebar-nav-icon" />,
  },
  //titulo 2
  {
    _tag: "CSidebarNavTitle",
    _children: ["Dados"],
  },
  //usuários
  {
    _tag: "CSidebarNavItem",
    name: "Usuários",
    to: "/users",
    icon: <CIcon name="cil-people" customClasses="c-sidebar-nav-icon" />,
  },
  //unidades apartamentos
  {
    _tag: "CSidebarNavItem",
    name: "Unidades",
    to: "/units",
    icon: <CIcon name="cil-home" customClasses="c-sidebar-nav-icon" />,
  },
  //areas comuns
  {
    _tag: "CSidebarNavItem",
    name: "Áreas Comuns",
    to: "/common-areas",
    icon: <CIcon name="cil-paperclip" customClasses="c-sidebar-nav-icon" />,
  },
  //titulo 3
  {
    _tag: "CSidebarNavTitle",
    _children: ["Configurações"],
  },
  //meu perfil
  {
    _tag: "CSidebarNavItem",
    name: "Meu Perfil",
    to: "/profile",
    icon: <CIcon name="cil-user" customClasses="c-sidebar-nav-icon" />,
  },
  //sair
  {
    _tag: "CSidebarNavItem",
    name: "Sair",
    to: "/logout",
    icon: <CIcon name="cil-drop" customClasses="c-sidebar-nav-icon" />,
  },
];

export default _nav;
