export interface IPostRestaurant {
    data: {
        type: 'restaurants';
        attributes: {
            name: string;
        };
        relationships: {
            user: {
                type: 'users';
                id: string;
            };
        };
    };
}
