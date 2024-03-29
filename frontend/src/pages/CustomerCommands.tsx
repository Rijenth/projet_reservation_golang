import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { ICommand } from '../interfaces/ICommand';
import { useNavigate } from 'react-router-dom';
import OverflowContainer from '../components/OverflowContainer';
import CommandList from '../components/CommandList';
import getCommandStatusTranslation from '../helpers/getCommandStatusTranslation';

export default function CustomerCommands(): JSX.Element {
    const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
    const authentication = useSelector(
        (state: RootState) => state.authentication
    );

    const [commands, setCommands] = useState<ICommand[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>('');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserCommands = async (): Promise<void> => {
            setErrorMessage('');

            const userId = authentication.user?.id;

            if (!userId) {
                navigate('/logout');
                return;
            }

            const token = authentication.token;

            if (!token) {
                navigate('/logout');
                return;
            }

            await fetch(`${apiUrl}/users/${userId}/commands`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((response) => {
                    if (!response.ok) {
                        if (response.status === 401) {
                            navigate('/logout');
                            return;
                        }

                        throw new Error(
                            'Une erreur api est survenue lors de la récupération des commandes'
                        );
                    }

                    return response.json();
                })
                .then((data) => {
                    setCommands(data.data);
                })
                .catch((error) => {
                    if (error?.message) {
                        setErrorMessage(error.message);

                        return;
                    }

                    setErrorMessage('Une erreur inconnue est survenue');
                });
        };

        fetchUserCommands();
    }, [apiUrl, authentication, navigate]);

    return (
        <div className="mt-4 flex flex-row gap-4 items-start justify-center">
            <OverflowContainer
                errorMessage={errorMessage || ''}
                underlinedTitle={`Commandes ${getCommandStatusTranslation('ongoing')} - ( ${
                    commands.filter(
                        (command) => command.attributes.status === 'ongoing'
                    ).length
                } )`}
            >
                <CommandList
                    commands={commands.filter(
                        (command) => command.attributes.status === 'ongoing'
                    )}
                />
            </OverflowContainer>

            <OverflowContainer
                errorMessage={errorMessage || ''}
                underlinedTitle={`Commandes ${getCommandStatusTranslation('ready') + 'es'} - ( ${
                    commands.filter(
                        (command) => command.attributes.status === 'ready'
                    ).length
                } )`}
            >
                <CommandList
                    commands={commands.filter(
                        (command) => command.attributes.status === 'ready'
                    )}
                />
            </OverflowContainer>

            <OverflowContainer
                errorMessage={errorMessage || ''}
                underlinedTitle={`Commandes ${getCommandStatusTranslation('delivered') + 's'} - ( ${
                    commands.filter(
                        (command) => command.attributes.status === 'delivered'
                    ).length
                } )`}
            >
                <CommandList
                    commands={commands.filter(
                        (command) => command.attributes.status === 'delivered'
                    )}
                />
            </OverflowContainer>
        </div>
    );
}
