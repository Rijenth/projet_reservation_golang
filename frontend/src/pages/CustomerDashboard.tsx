import { useEffect, useState } from 'react';
import PlacesList from '../components/PlacesList';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { Link } from 'react-router-dom';
import { ICommand } from '../interfaces/ICommand';

export default function CustomerDashboard(): JSX.Element {
    const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
    const authentication = useSelector(
        (state: RootState) => state.authentication
    );

    const [errorMessage, setErrorMessage] = useState<string>('');
    const [commands, setCommands] = useState<ICommand[]>([]);

    useEffect(() => {
        const fetchCommands = async (): Promise<void> => {
            const response = await fetch(
                `${apiUrl}/users/${authentication.user?.id}/commands`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${authentication.token}`,
                    },
                }
            );

            if (!response.ok) {
                setErrorMessage(
                    `Une erreur s'est produite: ${response.status} - ${response.statusText}`
                );

                return;
            }

            const json = await response.json();

            setCommands(json.data);
        };

        fetchCommands();
    }, [apiUrl, authentication]);

    return (
        <>
            {errorMessage && (
                <div
                    className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                    role="alert"
                >
                    <strong className="font-bold">Erreur !</strong>
                    <span className="block sm:inline">{errorMessage}</span>
                </div>
            )}

            <h1 className="text-2xl font-bold my-8 ml-8 underline">
                Bienvenue sur votre espace client
            </h1>

            <div className="flex flex-row gap-4 items-start justify-evenly">
                <div className="container min-w-[500px] max-w-[500px] w-1/2">
                    <div className="flex flex-col space-y-4 border border-gray-200 p-4 rounded shadow-md">
                        <h2 className="text-xl font-bold">Informations</h2>

                        <p>
                            Nom / Prénom: {authentication.user?.firstName}{' '}
                            {authentication.user?.lastName}
                        </p>

                        <p>
                            Votre nom d&#39;utilisateur:{' '}
                            {authentication.user?.username}
                        </p>

                        <div className="border-t border-gray-200 pt-4">
                            <p>
                                Vous avez effectué {commands.length} commande(s)
                            </p>

                            <p>
                                Vous avez{' '}
                                {
                                    commands.filter(
                                        (c) => c.attributes.status === 'ongoing'
                                    ).length
                                }{' '}
                                commande(s) en cours
                            </p>

                            <p>
                                Vous avez{' '}
                                {
                                    commands.filter(
                                        (c) => c.attributes.status === 'ready'
                                    ).length
                                }{' '}
                                commande(s) prête(s)
                            </p>

                            <p>
                                Vous avez{' '}
                                {
                                    commands.filter(
                                        (c) =>
                                            c.attributes.status === 'delivered'
                                    ).length
                                }{' '}
                                commande(s) terminée(s)
                            </p>
                        </div>

                        <Link
                            to="/dashboard/customer/places"
                            className="text-blue-500"
                        >
                            Passer une commande
                        </Link>
                    </div>
                </div>
                <PlacesList placeIdHandler={() => {}} />
            </div>
        </>
    );
}
