import React, { useState } from 'react';
import LoadingButton from './LoadingButton';
import { IPostPlace } from '../interfaces/IPostPlace';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { IPlace } from '../interfaces/IPlace';

interface AdminPlaceHandlerProps {
    userId: number | undefined;
    setNewPlaceHandler: (place: IPlace) => void;
}

const AdminPlaceHandler: React.FC<AdminPlaceHandlerProps> = ({
    userId,
    setNewPlaceHandler,
}) => {
    const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [hasError, setHasError] = useState<boolean>(false);
    const [placeName, setPlaceName] = useState<string>('');
    const [placeAddress, setPlaceAddress] = useState<string>('');
    const authentication = useSelector(
        (state: RootState) => state.authentication
    );

    const place: IPostPlace = {
        data: {
            type: 'places',
            attributes: {
                name: '',
                address: '',
            },
        },
    };

    const newPlace: IPlace = {
        id: '',
        attributes: {
            name: '',
            address: '',
        },
    };

    const handleCreatePlace = async (): Promise<void> => {
        setErrorMessage([]);
        setSuccessMessage('');
        setHasError(false);

        place.data.attributes.name = placeName;

        place.data.attributes.address = placeAddress;

        try {
            setIsLoading(true);

            const response = await fetch(`${apiUrl}/users/${userId}/places`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authentication.token}`,
                },
                body: JSON.stringify(place),
            });

            if (!response.ok) {
                const json = await response.json();

                if (response.status === 401) {
                    setErrorMessage([
                        'Vous devez être connecté pour créer un lieu',
                    ]);
                    return;
                }

                if (json.errors) {
                    setErrorMessage(
                        json.errors.map(
                            (error: { detail: string }) => error.detail
                        )
                    );
                    return;
                }

                setErrorMessage(['Erreur api lors de la création du lieu']);
            }

            const data = await response.json();
            newPlace.id = data.data.id;
            newPlace.attributes.name = data.data.attributes.name;
            newPlace.attributes.address = data.data.attributes.address;
            setNewPlaceHandler(newPlace);

            setSuccessMessage('Lieu créé avec succès');

            setTimeout(() => {
                setSuccessMessage('');
            }, 2000);

            setPlaceName('');
            setPlaceAddress('');
        } catch (error) {
            console.error('Erreur inconnue lors de la création du lieu', error);

            setErrorMessage(['Erreur inconnue lors de la création du lieu']);

            setHasError(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-4 bg-gray-800 rounded-lg w-80">
            <h2 className="text-white text-lg font-bold underline mb-4">
                Créer un lieu:
            </h2>

            <div className="space-y-3 mx-4 my-6">
                <div>
                    <label className="text-white">Nom</label>
                    <div>
                        <input
                            required
                            type="text"
                            className="w-full rounded h-8 pl-2"
                            value={placeName}
                            onChange={(e) => setPlaceName(e.target.value)}
                        ></input>
                    </div>
                </div>
                <div>
                    <label className="text-white">Adresse</label>
                    <div>
                        <input
                            required
                            type="text"
                            className="w-full rounded h-8 pl-2"
                            value={placeAddress}
                            onChange={(e) => setPlaceAddress(e.target.value)}
                        ></input>
                    </div>
                </div>
            </div>

            <div className="mt-4 flex justify-evenly">
                <LoadingButton
                    buttonClass="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 w-1/2"
                    title="Créer"
                    isLoading={isLoading}
                    hasError={hasError}
                    onClickCallback={handleCreatePlace}
                />
            </div>

            {successMessage.length !== 0 && (
                <div className="mt-4 bg-green-400 rounded-lg p-4">
                    <p className="text-green-800 text-sm">{successMessage}</p>
                </div>
            )}

            {errorMessage.length !== 0 && (
                <div className="mt-4 bg-red-400 rounded-lg p-4">
                    {errorMessage.map((error, index) => (
                        <p key={index} className="text-red-800 text-sm mb-2">
                            {error}
                        </p>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminPlaceHandler;
