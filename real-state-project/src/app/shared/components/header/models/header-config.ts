export const headerConfig = {
  "logoSrc": "assets/svg/TuHogar_Logo.svg",
  "phoneImgSrc": 'assets/svg/telefono.svg',
  "addressImgSrc": 'assets/svg/direccion.svg',
  "mailImgSrc": 'assets/svg/Mail.svg',
  "menuItems": [{
    label: "DÓNDE MUDARME",
    desplegable: true,
    items: [
      {
        label: "Huelva",
        path: "/huelva",
        desplegable: false
      },
      {
        label: "Punta Umbría",
        path: "/punta-umbria",
        desplegable: false
      },
      {
        label: "El Portil",
        path: "/el-portil",
        desplegable: false
      },
      {
        label: "El Rompido",
        path: "/el-rompido",
        desplegable: false
      },
    ]
  },
  {
    label: "BUSCAR INMUEBLES",
    desplegable: false,
    link: "viviendas",
  },
  {
    label: "VENDE TU VIVIENDA",
    desplegable: false,
    link: "vende-tu-vivienda"
  },
]
}

