import React, { useEffect, useState } from 'react';
import { RootState } from '../store/store';
import { useSelector } from 'react-redux';
import { IMenu } from '../interfaces/IMenu';
import OverflowContainer from '../components/OverflowContainer';
import { IMenuItem } from '../interfaces/IMenuItem';

const OwnerMenusList: React.FC = () => {
    const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
    const authentication = useSelector(
        (state: RootState) => state.authentication
    );
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [restaurantMenus, setRestaurantMenus] = useState<IMenu[]>([]);
    const [restaurantMenuItems, setRestaurantMenuItems] = useState<IMenuItem[]>(
        []
    );

    useEffect(() => {
        const fetchRestaurantMenus = async (
            restaurantId: number
        ): Promise<void> => {
            setErrorMessage('');
            const response = await fetch(
                `${apiUrl}/restaurants/${restaurantId}/menus`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${authentication.token}`,
                    },
                }
            );

            if (!response.ok) {
                setErrorMessage(
                    'Une erreur est survenue lors de la récupération des menus'
                );
                return;
            }

            const json = await response.json();

            setRestaurantMenus(json.data);
        };

        const fetchUserRestaurants = async (): Promise<void> => {
            setErrorMessage('');

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
                setErrorMessage('Une erreur est survenue');
                return;
            }

            const json = await response.json();
            fetchRestaurantMenus(json.data[0].id);
        };

        fetchUserRestaurants();
    }, [apiUrl, authentication]);

    const fetchRestaurantMenuItems = async (menuId: number): Promise<void> => {
        setErrorMessage('');
        const response = await fetch(`${apiUrl}/menus/${menuId}/menu-items`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authentication.token}`,
            },
        });

        if (!response.ok) {
            setErrorMessage(
                'Une erreur est survenue lors de la récupération des ingrédients'
            );
            return;
        }

        const json = await response.json();

        setRestaurantMenuItems(json.data);
    };

    return (
        <>
            <div className="mt-4 flex flex-row gap-4 items-start justify-center space-x-10">
                <OverflowContainer
                    errorMessage={errorMessage || ''}
                    underlinedTitle="Vos menus"
                >
                    <div className="flex flex-row pt-5">
                        <div className="container w-full mt-4 w-1/2 font-bold rounded-xl">
                            <div className="flex flex-col">
                                <div className="shadow-md min-w-[350px] min-h-[500px] rounded-xl">
                                    <div className="overflow-y-auto max-h-[450px] p-4">
                                        <ul className="space-y-6">
                                            {restaurantMenus.map((menu) => (
                                                <button
                                                    onClick={() =>
                                                        fetchRestaurantMenuItems(
                                                            parseInt(menu.id)
                                                        )
                                                    }
                                                    key={menu.id}
                                                    className="flex flex-col items-center justify-center bg-white p-2 rounded-lg shadow-md w-full hover:bg-gray-800 hover:text-white hover:border-2 hover:border-white"
                                                >
                                                    <li key={menu.id}>
                                                        {menu.attributes.name} -{' '}
                                                        {menu.attributes.price}{' '}
                                                        €
                                                    </li>
                                                </button>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </OverflowContainer>

                <OverflowContainer
                    underlinedTitle="Les détails du menu selectionné"
                    errorMessage=""
                >
                    <div className="flex flex-row pt-5">
                        <div className="container w-full mt-4 w-1/2 text-white font-bold rounded-xl">
                            <div className="flex flex-col">
                                <div className="shadow-md min-w-[350px] min-h-[500px] rounded-xl p-4 border border-gray-200">
                                    <div className="overflow-y-auto max-h-[500px] p-4">
                                        <ul className="space-y-6">
                                            {restaurantMenuItems.map(
                                                (menuItems) => (
                                                    <li key={menuItems.id}>
                                                        {
                                                            menuItems.attributes
                                                                .name
                                                        }{' '}
                                                        -{' '}
                                                        {
                                                            menuItems.attributes
                                                                .type
                                                        }{' '}
                                                        -{' '}
                                                        {
                                                            menuItems.attributes
                                                                .price
                                                        }{' '}
                                                        €
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </OverflowContainer>
            </div>
        </>
    );
};

export default OwnerMenusList;
