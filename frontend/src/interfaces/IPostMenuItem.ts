export interface IPostMenuItem {
    data: {
        type: 'menu_items';
        attributes: {
            name: string;
            type: 'starter' | 'main' | 'dessert' | 'drink';
            price: number;
        };
    };
}
