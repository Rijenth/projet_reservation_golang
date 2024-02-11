import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { useEffect, useState } from 'react';
import { ICommand } from '../interfaces/ICommand';
import getCommandStatusTranslation from '../helpers/getCommandStatusTranslation';
import OverflowContainer from '../components/OverflowContainer';
import CommandList from '../components/CommandList';

interface OwnerCommandListProps {}

export default function OwnerCommandList({}: OwnerCommandListProps): JSX.Element {
    const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
    const authentication = useSelector(
        (state: RootState) => state.authentication
    );

    const [ongoingCommands, setOngoingCommands] = useState<ICommand[]>([]);
    const [readyCommands, setReadyCommands] = useState<ICommand[]>([]);
    const [deliveredCommands, setDeliveredCommands] = useState<ICommand[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [updateCommandList, setUpdateCommandList] = useState<boolean>(false);

    const updateParentCallback = (): void => {
        setUpdateCommandList(!updateCommandList);
    };

    useEffect(() => {
        const fetchCommands = async (restaurantId: number): Promise<void> => {
            setErrorMessage('');
            setOngoingCommands([]);
            setReadyCommands([]);
            setDeliveredCommands([]);

            try {
                const response = await fetch(
                    `${apiUrl}/restaurants/${restaurantId}/commands`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${authentication.token}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error('Une erreur est survenue');
                }

                const json = await response.json();

                setOngoingCommands(
                    json.data.filter(
                        (command: ICommand) =>
                            command.attributes.status === 'ongoing'
                    )
                );
                setReadyCommands(
                    json.data.filter(
                        (command: ICommand) =>
                            command.attributes.status === 'ready'
                    )
                );
                setDeliveredCommands(
                    json.data.filter(
                        (command: ICommand) =>
                            command.attributes.status === 'delivered'
                    )
                );
            } catch (error) {
                setErrorMessage('Une erreur est survenue');
            }
        };

        const fetchUserRestaurants = async (): Promise<void> => {
            setErrorMessage('');

            const response = await fetch(
                `${apiUrl}/users/${authentication.user?.id}/restaurants`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${authentication.token}`,
                    },
                }
            );

            if (!response.ok) {
                setErrorMessage('Une erreur est survenue');
                return;
            }

            const json = await response.json();

            fetchCommands(json.data[0].id);
        };

        fetchUserRestaurants();
    }, [apiUrl, authentication, updateCommandList]);

    return (
        <div className="mt-4 flex flex-row gap-4 items-start justify-center">
            {' '}
            <OverflowContainer
                errorMessage={errorMessage || ''}
                underlinedTitle={`Commandes ${getCommandStatusTranslation('ongoing')} - ( ${ongoingCommands.length} )`}
            >
                <CommandList
                    commands={ongoingCommands}
                    updateParentCallback={() => updateParentCallback()}
                />
            </OverflowContainer>
            <OverflowContainer
                errorMessage={errorMessage || ''}
                underlinedTitle={`Commandes ${getCommandStatusTranslation('ready') + 'es'} - ( ${readyCommands.length} )`}
            >
                <CommandList
                    commands={readyCommands}
                    updateParentCallback={() => updateParentCallback()}
                />
            </OverflowContainer>
            <OverflowContainer
                errorMessage={errorMessage || ''}
                underlinedTitle={`Commandes ${getCommandStatusTranslation('delivered') + 's'} - ( ${deliveredCommands.length} )`}
            >
                <CommandList
                    commands={deliveredCommands}
                    updateParentCallback={() => updateParentCallback()}
                />
            </OverflowContainer>
        </div>
    );
}
