import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { useNavigate } from 'react-router-dom';
import OverflowContainer from './OverflowContainer';

interface PlacesListProps {
    placeIdHandler: (id: number) => void;
}

export default function PlacesList({
    placeIdHandler,
}: PlacesListProps): JSX.Element {
    const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
    interface Place {
        id: string;
        attributes: {
            name: string;
            address: string;
        };
    }
    const [places, setPlaces] = useState<Place[]>([]);
    const token = useSelector((state: RootState) => state.authentication.token);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const navigate = useNavigate();

    useEffect(() => {
        console.log('page places list');
        setErrorMessage('');

        const fetchPlaces = async (): Promise<void> => {
            fetch(`${apiUrl}/places`, {
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

                        throw new Error('Une erreur api est survenue');
                    }

                    return response.json();
                })
                .then((data) => {
                    setPlaces(data.data);
                })
                .catch((error) => {
                    if (error?.message) {
                        setErrorMessage(error.message);
                        return;
                    }

                    setErrorMessage('Une erreur inconnue est survenue');
                });
        };

        fetchPlaces();

        return () => {
            setPlaces([]);
        };
    }, [apiUrl, token, navigate]);

    return (
        <OverflowContainer
            errorMessage={errorMessage}
            underlinedTitle="Liste des lieux"
        >
            <div className="flex flex-col space-y-4 overflow-y-auto h-full p-4 rounded-lg no-scrollbar">
                {places.map((place) => (
                    <button
                        onClick={() => placeIdHandler(parseInt(place.id))}
                        key={place.id}
                        className="flex flex-col items-center justify-center bg-white p-4 rounded-lg shadow-md w-96 hover:bg-gray-800 hover:text-white hover:border-2 hover:border-white"
                    >
                        <h2 className="text-sm font-bold">
                            {place.attributes.name}
                        </h2>
                        <p className="text-sm">{place.attributes.address}</p>
                    </button>
                ))}
            </div>
        </OverflowContainer>
    );
}
