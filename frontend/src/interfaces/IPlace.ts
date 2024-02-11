export interface IPlace {
    id: string;
    attributes: {
        name: string;
        address: string;
    };
    relationships: {
        restaurants: {
            data: {
                id: string;
                type: string;
            }[];
        };
    };
}
