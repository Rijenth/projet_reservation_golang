import { useEffect, useState } from 'react';
import { RootState } from '../store/store';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

interface RestaurantListProps {
    placeId: number;
}

export function RestaurantList({ placeId }: RestaurantListProps): JSX.Element {
    const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
    interface Restaurant {
        id: string;
        attributes: {
            name: string;
        };
    }

    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const token = useSelector((state: RootState) => state.authentication.token);
    const [errorMessage, setErrorMessage] = useState<string>('');

    const navigate = useNavigate();

    useEffect(() => {
        console.log('page restaurant list');

        setErrorMessage('');

        if (placeId === 0) {
            return;
        }

        const controller = new AbortController();

        fetch(`${apiUrl}/places/${placeId}/restaurants`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,
        })
            .then((response) => {
                if (!response.ok) {
                    if (response.status === 401) {
                        navigate('/logout');
                        return;
                    }

                    throw new Error('Une erreur api est survenue');
                }

                return response.json();
            })
            .then((data) => {
                setRestaurants(data.data);
            })
            .catch((error) => {
                if (error?.message) {
                    setErrorMessage(error.message);
                    return;
                }

                setErrorMessage('Une erreur inconnue est survenue');
            });

        return () => {
            controller.abort();
        };
    }, [apiUrl, token, navigate, placeId]);

    return (
        <div
            className="flex flex-col items-center justify-center border-2 border-gray-400 p-8 rounded-lg shadow-md w-1/2 max-w-[500px] bg-gray-800"
            style={{ height: '80vh' }}
        >
            {errorMessage && (
                <div className="w-full text-center bg-red-400 rounded-lg p-4">
                    <p className="text-red-800 text-sm mb-4">{errorMessage}</p>
                </div>
            )}

            {errorMessage === '' && (
                <>
                    <h1 className="text-white text-xl font-bold mb-4 underline">
                        Liste des lieux
                    </h1>
                    <div className="flex flex-col space-y-4 overflow-y-auto h-full p-4 rounded-lg">
                        {restaurants.map((restaurant) => (
                            <button
                                key={restaurant.id}
                                className="flex flex-col items-center justify-center bg-white p-4 rounded-lg shadow-md w-96 hover:bg-gray-800 hover:text-white transition-all"
                            >
                                <h2 className="text-sm font-bold">
                                    {restaurant.attributes.name}
                                </h2>
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
