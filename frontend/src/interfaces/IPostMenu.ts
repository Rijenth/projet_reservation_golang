export interface IPostMenu {
    data: {
        type: 'menus';
        attributes: {
            name: string;
        };
        relationships: {
            menu_items: {
                type: 'menu-items';
                id: string;
            }[];
        };
    };
}
