import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { useNavigate } from 'react-router-dom';

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

        return () => {
            setPlaces([]);
        };
    }, [apiUrl, token, navigate]);

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
                        {places.map((place) => (
                            <button
                                onClick={() =>
                                    placeIdHandler(parseInt(place.id))
                                }
                                key={place.id}
                                className="flex flex-col items-center justify-center bg-white p-4 rounded-lg shadow-md w-96 hover:bg-gray-800 hover:text-white transition-all"
                            >
                                <h2 className="text-sm font-bold">
                                    {place.attributes.name}
                                </h2>
                                <p className="text-sm">
                                    {place.attributes.address}
                                </p>
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
