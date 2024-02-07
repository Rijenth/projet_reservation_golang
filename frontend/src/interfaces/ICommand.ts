export type CommandStatus = 'ongoing' | 'ready' | 'delivered';

export interface ICommand {
    id: string;
    attributes: {
        identificationNumber: string | null;
        description: string;
        status: CommandStatus;
        amount: number;
    };
    relationships: {
        restaurant: {
            data: {
                type: string;
                id: string;
            };
        };
        menus: {
            data: {
                type: string;
                id: string;
            }[];
        };
    };
}
