import { useEffect, useState } from 'react';
import { IMenuItem } from '../interfaces/IMenuItem';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { IMenu } from '../interfaces/IMenu';
import { useNavigate } from 'react-router-dom';

interface SelectedMenuMenuItemsProps {
    menu: IMenu;
    onClickCallback: (menu: IMenu) => void;
}

export default function SelectedMenuMenuItems({
    menu,
    onClickCallback,
}: SelectedMenuMenuItemsProps): JSX.Element {
    const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
    const token = useSelector((state: RootState) => state.authentication.token);

    const [menuItems, setMenuItems] = useState<IMenuItem[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>('');

    const navigate = useNavigate();

    const menuItemTypeTranslation = (type: string): string => {
        switch (type) {
            case 'starter':
                return 'Entrée';
            case 'main':
                return 'Plat';
            case 'dessert':
                return 'Dessert';
            case 'drink':
                return 'Boisson';
            default:
                return type;
        }
    };

    useEffect(() => {
        const fetchMenuItems = async (): Promise<void> => {
            setMenuItems([]);
            setErrorMessage('');

            await fetch(`${apiUrl}/menus/${menu.id}/menu-items`, {
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
                            'Une erreur api est survenue lors de la récupération des items du menu'
                        );
                    }

                    return response.json();
                })
                .then((data) => {
                    setMenuItems(data.data);
                })
                .catch((error) => {
                    if (error?.message) {
                        setErrorMessage(error.message);

                        return;
                    }

                    setErrorMessage('Une erreur est survenue');
                });
        };

        if (Number(menu.id) === 0) {
            return;
        }

        fetchMenuItems();
    }, [menu.id, apiUrl, token, navigate]);

    return (
        <div className="flex flex-col overflow-y-auto p-4 rounded-lg bg-white mt-2 border-2 border-gray-800">
            <p className="text-black text-sm font-bold underline mb-4">
                Ce menu est composé de :{' '}
            </p>
            <ul className="text-black text-sm font-bold">
                {menuItems.map((menuItem) => (
                    <li key={menuItem.id}>
                        {menuItem.attributes.name} -{' '}
                        {menuItemTypeTranslation(menuItem.attributes.type)} -{' '}
                        {menuItem.attributes.price} €
                    </li>
                ))}
            </ul>

            <button
                onClick={() => {
                    onClickCallback(menu);
                }}
                className="mt-4 bg-gray-800 text-white p-2 rounded-lg hover:bg-gray-600 w-1/2 mx-auto"
            >
                +
            </button>

            {errorMessage && (
                <div className="flex flex-col items-center justify-center bg-red-400 p-4 rounded-lg mt-4">
                    <p className="text-red-800 text-sm font-bold">
                        {errorMessage}
                    </p>
                </div>
            )}
        </div>
    );
}
