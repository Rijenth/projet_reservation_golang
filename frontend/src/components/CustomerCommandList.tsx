import { useState } from 'react';
import { roundFloatNumber } from '../helpers/roundFloatNumber';
import { CommandStatus, ICommand } from '../interfaces/ICommand';
import OverflowContainer from './OverflowContainer';
import SelectedCommandInfos from './SelectedCommandInfos';

interface CustomerCommandListProps {
    commands: ICommand[];
    commandStatus: CommandStatus;
    errorMessage?: string;
}

export default function CustomerCommandList({
    commands,
    commandStatus,
    errorMessage,
}: CustomerCommandListProps): JSX.Element {
    const [selectedCommandId, setSelectedCommandId] = useState<number>(0);
    const getStatusTranslation = (status: CommandStatus): string => {
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

    return (
        <>
            <OverflowContainer
                errorMessage={errorMessage || ''}
                underlinedTitle={`Commandes ${getStatusTranslation(commandStatus)} - ( ${commands.length} )`}
            >
                <div className="flex flex-col space-y-4 overflow-y-auto h-full p-4 rounded-lg no-scrollbar">
                    {commands.map((command) => (
                        <div
                            onClick={() =>
                                setSelectedCommandId(Number(command.id))
                            }
                            key={command.id}
                            className="flex flex-col items-left justify-center bg-white p-4 rounded-lg shadow-md w-96 hover:bg-gray-800 hover:text-white hover:border-2 hover:border-white"
                        >
                            <h2 className="text-sm font-bold">
                                {command.attributes.description}{' '}
                            </h2>
                            <p className="text-sm font-bold">
                                Montant :{' '}
                                {roundFloatNumber(command.attributes.amount)} €
                            </p>

                            {command.attributes.identificationNumber && (
                                <div
                                    className={`${command.attributes.status === 'ready' ? 'bg-green-300' : 'bg-gray-300'} w-full text-center mt-2 text-black p-2 rounded-lg`}
                                >
                                    <span className="text-sm font-bold">
                                        {command.attributes.status === 'ready'
                                            ? `Code de retrait : ${command.attributes.identificationNumber}`
                                            : 'La commande a été retirée'}
                                    </span>
                                </div>
                            )}

                            {selectedCommandId === Number(command.id) && (
                                <SelectedCommandInfos command={command} />
                            )}
                        </div>
                    ))}
                </div>
            </OverflowContainer>
        </>
    );
}
