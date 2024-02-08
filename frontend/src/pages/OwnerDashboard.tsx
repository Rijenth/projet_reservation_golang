import { useEffect, useState } from 'react';
import { IRestaurant } from '../interfaces/IRestaurant';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { useNavigate } from 'react-router-dom';

export default function OwnerDashboard(): JSX.Element {
    const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
    const authentication = useSelector(
        (state: RootState) => state.authentication
    );
    const [ownerRestaurants, setOwnerRestaurants] = useState<IRestaurant[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>('');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchOwnerRestaurants = async (): Promise<void> => {
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
                if (response.status === 401) {
                    navigate('/logout');
                    return;
                }

                setErrorMessage(
                    'Une erreur est survenue lors de la récupération des restaurants'
                );
                return;
            }

            const data = await response.json();

            setOwnerRestaurants(data.data);
        };

        fetchOwnerRestaurants();

        if (ownerRestaurants.length === 0) {
            navigate('/dashboard/owner/create-restaurant');
        }
    }, [apiUrl, authentication, navigate]);

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

            <p>Vous avez un restaurant</p>
        </>
    );
}
