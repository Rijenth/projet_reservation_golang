import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { useEffect, useState } from 'react';
import { IPlace } from '../interfaces/IPlace';

export default function AdminDashboard(): JSX.Element {
    const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
    const authentication = useSelector(
        (state: RootState) => state.authentication
    );

    const [errorMessage, setErrorMessage] = useState<string>('');
    const [places, setPlaces] = useState<IPlace[]>([]);
    const [restaurantCount, setRestaurantCount] = useState<number>(0);

    useEffect(() => {
        const fetchPlaces = async (): Promise<void> => {
            const response = await fetch(
                `${apiUrl}/users/${authentication.user?.id}/places`,
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

            setPlaces(json.data);

            const restaurantCounts = json.data.reduce(
                (acc: number, place: IPlace) => {
                    return acc + place.relationships.restaurants.data.length;
                },
                0
            );

            setRestaurantCount(restaurantCounts);
        };

        fetchPlaces();
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
                Bienvenue sur votre espace administrateur
            </h1>

            <div>
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

                        <p>Vous avez {places.length} lieu(x) enregistré(s)</p>
                        <p>
                            Vous avez {restaurantCount} restaurant(s)
                            enregistré(s) dans vos lieux.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
