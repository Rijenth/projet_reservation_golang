import { useState } from 'react';
import { roundFloatNumber } from '../helpers/roundFloatNumber';
import { ICommand } from '../interfaces/ICommand';
import SelectedCommandInfos from './SelectedCommandInfos';

interface CommandListProps {
    commands: ICommand[];
}

export default function CommandList({
    commands,
}: CommandListProps): JSX.Element {
    const [selectedCommandId, setSelectedCommandId] = useState<number>(0);

    return (
        <div className="flex flex-col space-y-4 overflow-y-auto h-full p-4 rounded-lg no-scrollbar">
            {commands.map((command) => (
                <div
                    onClick={() => {
                        setSelectedCommandId(
                            selectedCommandId !== Number(command.id)
                                ? Number(command.id)
                                : 0
                        );
                    }}
                    key={command.id}
                    className="flex flex-col items-left justify-center bg-white p-4 rounded-lg shadow-md w-96 hover:bg-gray-800 hover:text-white hover:border-2 hover:border-white"
                >
                    <h2 className="text-sm font-bold">
                        {command.attributes.description}{' '}
                    </h2>
                    <p className="text-sm font-bold">
                        Montant : {roundFloatNumber(command.attributes.amount)}{' '}
                        €
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
    );
}
