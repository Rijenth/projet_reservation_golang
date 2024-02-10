import { CommandStatus } from '../interfaces/ICommand';

const getCommandStatusTranslation = (status: CommandStatus): string => {
    switch (status) {
        case 'delivered':
            return 'livrée';
        case 'ongoing':
            return 'en cours';
        case 'ready':
            return 'prêt';
        default:
            return 'Inconnu';
    }
};

export default getCommandStatusTranslation;
