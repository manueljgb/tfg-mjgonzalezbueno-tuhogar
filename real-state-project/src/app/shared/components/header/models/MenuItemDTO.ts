
export interface MenuItemDTO {
    label: string;
    desplegable: boolean;
    link?: string;
    path?: string;
    items?: MenuItemDTO[];
}
