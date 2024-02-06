export interface IPostCommand {
    data: {
        type: string;
        attributes: {
            description: string;
        };
        relationships: {
            menus: {
                type: 'menus';
                id: string;
            }[];
            user: {
                type: 'users';
                id: string;
            };
        };
    };
}
