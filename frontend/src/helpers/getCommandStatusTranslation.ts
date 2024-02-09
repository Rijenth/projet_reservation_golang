import { CommandStatus } from '../interfaces/ICommand';

const getCommandStatusTranslation = (status: CommandStatus): string => {
    switch (status) {
        case 'delivered':
            return 'livrées';
        case 'ongoing':
            return 'en cours';
        case 'ready':
            return 'prêtes';
        default:
            return 'Inconnu';
    }
};

export default getCommandStatusTranslation;
