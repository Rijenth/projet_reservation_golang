import { useEffect, useState } from 'react';
import { ICommand } from '../interfaces/ICommand';
import { IRestaurant } from '../interfaces/IRestaurant';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { useNavigate } from 'react-router-dom';
import { IMenu } from '../interfaces/IMenu';
import { roundFloatNumber } from '../helpers/roundFloatNumber';

interface SelectedCommandInfosProps {
    command: ICommand;
}

export default function SelectedCommandInfos({
    command,
}: SelectedCommandInfosProps): JSX.Element {
    const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
    const token = useSelector((state: RootState) => state.authentication.token);
    const [restaurant, setRestaurant] = useState<IRestaurant | null>(null);
    const [menus, setMenus] = useState<IMenu[]>([]);

    const [errorMessage, setErrorMessage] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchCommandRestaurant = async (): Promise<void> => {
            setErrorMessage('');
            setRestaurant(null);

            await fetch(
                `${apiUrl}/restaurants/${command.relationships.restaurant.data.id}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
                .then((response) => {
                    if (!response.ok) {
                        if (response.status === 401) {
                            navigate('/logout');
                            return;
                        }

                        throw new Error(
                            'Une erreur api est survenue lors du restaurant de la commande'
                        );
                    }

                    return response.json();
                })
                .then((data) => {
                    setRestaurant(data.data);
                })
                .catch((error) => {
                    if (error?.message) {
                        setErrorMessage(error.message);

                        return;
                    }

                    setErrorMessage('Une erreur est survenue');
                });
        };

        const fetchCommandMenus = async (): Promise<void> => {
            setErrorMessage('');
            setMenus([]);

            await fetch(`${apiUrl}/commands/${command.id}/menus`, {
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

                        throw new Error(
                            'Une erreur api est survenue lors de la récupération des menus de la commande'
                        );
                    }

                    return response.json();
                })
                .then((data) => {
                    setMenus(data.data);

                    setIsLoading(false);
                })
                .catch((error) => {
                    if (error?.message) {
                        setErrorMessage(error.message);

                        return;
                    }

                    setErrorMessage('Une erreur est survenue');
                });
        };

        if (Number(command.id) === 0) {
            return;
        }

        fetchCommandRestaurant();
        fetchCommandMenus();
    }, [command, apiUrl, token, navigate]);

    if (errorMessage) {
        return (
            <div className="text-red-800 text-center border-2 border-red-500 p-4 rounded-lg bg-red-400">
                {errorMessage}
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex flex-col overflow-y-auto p-4 rounded-lg bg-white mt-2 border-2 border-gray-800">
                <div className="loading loading-xs loading-dots"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col overflow-y-auto p-4 rounded-lg bg-white mt-2 border-2 border-gray-800">
            <p className="text-black text-sm font-bold underline mb-4">
                Menus :{' '}
            </p>
            <div className="flex flex-col mb-4">
                {menus.length === 0 && (
                    <p className="text-black text-sm">
                        Aucun menu n&#39;a été commandé
                    </p>
                )}

                {menus.map((menu) => (
                    <p key={menu.id} className="text-sm text-black">
                        {menu.attributes.name} -{' '}
                        {roundFloatNumber(menu.attributes.price)} €
                    </p>
                ))}
            </div>

            <p className="text-black text-sm font-bold underline mb-4">
                Restaurant :
            </p>

            <p className="text-black text-sm">{restaurant?.attributes.name}</p>
        </div>
    );
}
