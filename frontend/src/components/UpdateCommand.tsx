import { ICommand } from '../interfaces/ICommand';

interface UpdateCommandProps {
    command: ICommand;
}

export default function UpdateCommand({
    command,
}: UpdateCommandProps): JSX.Element {
    return (
        <div className="flex justify-center items-center fixed left-0 bottom-0 w-full h-full bg-black bg-opacity-50 z-50">
            <div className="flex flex-col items-center justify-center bg-white p-4 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-4">
                    Commande n°{command.id}
                </h2>
                <p className="text-sm font-bold">
                    Montant : {command.attributes.amount} €
                </p>
                <p className="text-sm font-bold">
                    Statut : {command.attributes.status}
                </p>
                <p className="text-sm font-bold">
                    Code de retrait : {command.attributes.identificationNumber}
                </p>
            </div>
        </div>
    );
}
