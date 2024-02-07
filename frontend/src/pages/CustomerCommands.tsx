import { useEffect, useState } from 'react';
import CustomerNavbar from '../components/navbar/CustomerNavbar';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { ICommand } from '../interfaces/ICommand';
import { useNavigate } from 'react-router-dom';
import CustomerCommandList from '../components/CustomerCommandList';

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

                    console.log(data.data);
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
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <CustomerNavbar />

            <div className="mt-4 flex flex-row gap-4 items-start justify-center">
                <CustomerCommandList
                    commands={commands.filter(
                        (command) => command.attributes.status === 'ongoing'
                    )}
                    commandStatus="ongoing"
                    errorMessage={errorMessage}
                />

                <CustomerCommandList
                    commands={commands.filter(
                        (command) => command.attributes.status === 'ready'
                    )}
                    commandStatus="ready"
                    errorMessage={errorMessage}
                />

                <CustomerCommandList
                    commands={commands.filter(
                        (command) => command.attributes.status === 'delivered'
                    )}
                    commandStatus="delivered"
                    errorMessage={errorMessage}
                />
            </div>
        </div>
    );
}
