import { useState } from 'react';
import LoadingButton from './LoadingButton';
import { IPostCommand } from '../interfaces/IPostCommand';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { IMenu } from '../interfaces/IMenu';
import { roundFloatNumber } from '../helpers/roundFloatNumber';

interface CustomerCommandeHandlerProps {
    restaurantId: number;
    restaurantName: string;
    menus: IMenu[];
    resetSelectedMenus: () => void;
}

export default function CustomerCommandeHandler({
    restaurantId,
    restaurantName,
    menus,
    resetSelectedMenus,
}: CustomerCommandeHandlerProps): JSX.Element {
    const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [hasError, setHasError] = useState<boolean>(false);
    const authentication = useSelector(
        (state: RootState) => state.authentication
    );
    const command: IPostCommand = {
        data: {
            type: 'commands',
            attributes: {
                description: '',
            },
            relationships: {
                menus: [],
                user: {
                    type: 'users',
                    id: '0',
                },
            },
        },
    };

    const getSelectedMenusTotalPrice = (): number => {
        const totalAmount = menus.reduce(
            (total, menu) => total + menu.attributes.price,
            0
        );

        return roundFloatNumber(totalAmount);
    };

    const handleCreateCommand = async (): Promise<void> => {
        setErrorMessage([]);
        setSuccessMessage('');
        setHasError(false);

        if (menus.length === 0) {
            setErrorMessage(['Veuillez sélectionner au moins un menu']);
            return;
        }

        command.data.attributes.description = `Commande ${restaurantName}`;

        command.data.relationships.menus = menus.map((menu) => {
            return {
                type: 'menus',
                id: menu.id,
            };
        });

        command.data.relationships.user.id =
            authentication.user?.id.toString() || '0';

        try {
            setIsLoading(true);

            const response = await fetch(
                `${apiUrl}/restaurants/${restaurantId}/commands`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${authentication.token}`,
                    },
                    body: JSON.stringify(command),
                }
            );

            if (!response.ok) {
                const json = await response.json();

                if (response.status === 401) {
                    setErrorMessage([
                        'Vous devez être connecté pour commander',
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

                setErrorMessage(['Erreur api lors de la commande']);
            }

            setSuccessMessage(
                'Commande effectuée avec succès, rendez-vous sur la page de suivi pour suivre votre commande'
            );

            resetSelectedMenus();
        } catch (error) {
            console.error('Erreur inconnue lors de la commande', error);

            setErrorMessage(['Erreur inconnue lors de la commande']);

            setHasError(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-4 bg-gray-800 rounded-lg w-80">
            <h2 className="text-white text-lg font-bold underline mb-4">
                Votre commande :
            </h2>

            <div className="space-y-2 text-white text-sm">
                {menus.length !== 0 ? (
                    menus.map((menu) => (
                        <div key={menu.id} className="flex justify-between">
                            <span>{menu.attributes.name}</span>
                            <span>{menu.attributes.price} €</span>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-sm">
                        Aucun menu sélectionné
                    </div>
                )}
            </div>

            <hr className=" m-4 bg-white" />

            <div className="flex mt-4 justify-between">
                <span className="text-white font-bold">Total:</span>
                <span className="text-white ml-2">
                    {getSelectedMenusTotalPrice()} €
                </span>
            </div>

            <div className="mt-4 flex justify-evenly">
                <LoadingButton
                    buttonClass="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 w-1/2"
                    title="Commander"
                    isLoading={isLoading}
                    hasError={hasError}
                    onClickCallback={handleCreateCommand}
                />
                <button
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-red-600"
                    onClick={() => {
                        setErrorMessage([]);
                        setSuccessMessage('');
                        resetSelectedMenus();
                    }}
                >
                    Annuler
                </button>
            </div>

            {successMessage && (
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
}
