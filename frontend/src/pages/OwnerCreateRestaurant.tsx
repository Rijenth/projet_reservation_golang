import { useState } from 'react';
import { IPostRestaurant } from '../interfaces/IPostRestaurant';
import PlacesList from '../components/PlacesList';
import LoadingButton from '../components/LoadingButton';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { useNavigate } from 'react-router-dom';

export default function OwnerCreateRestaurant(): JSX.Element {
    const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
    const authentication = useSelector(
        (state: RootState) => state.authentication
    );
    const [placeId, setPlaceId] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [hasError, setHasError] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const navigate = useNavigate();

    const postRestaurant: IPostRestaurant = {
        data: {
            type: 'restaurants',
            attributes: {
                name: '',
            },
            relationships: {
                user: {
                    type: 'users',
                    id: '',
                },
            },
        },
    };

    const createRestaurant = async (): Promise<void> => {
        setIsLoading(true);

        postRestaurant.data.relationships.user.id =
            authentication.user?.id.toString() || '';

        const response = await fetch(
            `${apiUrl}/places/${placeId}/restaurants`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authentication.token}`,
                },
                body: JSON.stringify(postRestaurant),
            }
        );

        if (!response.ok) {
            setHasError(true);
            setIsLoading(false);

            if (response.status === 401) {
                setErrorMessage(
                    'Vous devez être connecté pour créer un restaurant'
                );
                return;
            }

            await response.json().then((data) => {
                if (data.errors) {
                    setErrorMessage(data.errors[0].detail);
                }
            });

            return;
        }

        setIsLoading(false);

        navigate('/dashboard/owner');
    };

    const setPlaceIdHandler = (id: number): void => {
        setPlaceId(id.toString());
    };

    return (
        <div className="bg-gray-100 p-4 rounded">
            <div className="flex flex-row h-100">
                <PlacesList placeIdHandler={setPlaceIdHandler} />

                {!placeId && (
                    <div className="bg-gray-800 rounded p-4 rounded-lg text-center flex flex-col h-50 m-auto w-96">
                        <h2 className="text-white text-xl font-bold m-4 underline">
                            Créez un restaurant
                        </h2>

                        <p className="text-white text-left block mb-2">
                            Sélectionnez un lieu pour créer un restaurant. Pour
                            créer un restaurant, veuillez sélectionner un lieu.
                        </p>
                    </div>
                )}

                {placeId && (
                    <div className="bg-gray-800 rounded p-4 rounded-lg text-center flex flex-col h-50 m-auto w-96">
                        <h2 className="text-white text-xl font-bold m-4 underline">
                            Créer un restaurant
                        </h2>

                        <label
                            className="text-white text-left block mb-2"
                            htmlFor="name"
                        >
                            Nom du restaurant :{' '}
                        </label>
                        <input
                            type="text"
                            placeholder="Nom du restaurant"
                            className="border border-gray-400 rounded p-2 mb-2"
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ): void => {
                                postRestaurant.data.attributes.name =
                                    e.target.value;
                            }}
                            required
                        />

                        {errorMessage && (
                            <div className="flex flex-col items-center justify-center bg-red-400 p-4 rounded-lg my-2">
                                <p className="text-red-800 text-sm font-bold">
                                    {errorMessage}
                                </p>
                            </div>
                        )}

                        <LoadingButton
                            title="Créer un restaurant"
                            buttonClass="bg-green-500 text-white py-2 px-4 rounded"
                            isLoading={isLoading}
                            hasError={hasError}
                            onClickCallback={createRestaurant}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
