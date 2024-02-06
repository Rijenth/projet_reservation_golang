import { useEffect, useState } from 'react';
import { RootState } from '../store/store';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import OverflowContainer from './OverflowContainer';

interface RestaurantListProps {
    placeId: number;
    restaurantIdHandler?: (id: number) => void;
}

export function RestaurantList({
    placeId,
    restaurantIdHandler,
}: RestaurantListProps): JSX.Element {
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
        <OverflowContainer
            errorMessage={errorMessage}
            underlineTitle="Liste des restaurants"
        >
            <div className="flex flex-col space-y-4 overflow-y-auto h-full p-4 rounded-lg">
                {restaurants.map((restaurant) => (
                    <button
                        onClick={() => {
                            if (restaurantIdHandler) {
                                restaurantIdHandler(parseInt(restaurant.id));
                            }
                        }}
                        key={restaurant.id}
                        className="flex flex-col items-center justify-center bg-white p-4 rounded-lg shadow-md w-96 hover:bg-gray-800 hover:text-white transition-all"
                    >
                        <h2 className="text-sm font-bold">
                            {restaurant.attributes.name}
                        </h2>
                    </button>
                ))}
            </div>
        </OverflowContainer>
    );
}
