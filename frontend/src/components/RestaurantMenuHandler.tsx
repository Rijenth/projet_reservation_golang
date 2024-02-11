import { useEffect, useState } from 'react';
import { IPostMenu } from '../interfaces/IPostMenu';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { useNavigate } from 'react-router-dom';
import { IMenuItem } from '../interfaces/IMenuItem';
import ChoicePicker from './ChoicePicker';
import LoadingButton from './LoadingButton';
import { IMenu } from '../interfaces/IMenu';

interface RestaurantMenuHandlerProps {
    showComponentCallback: (component: 'menu' | 'menu-item') => void;
    restaurantId: string;
    setRestaurantMenus: (menu: IMenu[]) => void;
    restaurantMenus: IMenu[];
}

export default function RestaurantMenuHandler({
    showComponentCallback,
    restaurantId,
    setRestaurantMenus,
    restaurantMenus,
}: RestaurantMenuHandlerProps): JSX.Element {
    const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
    const token = useSelector((state: RootState) => state.authentication.token);
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [hasError, setHasError] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [menuName, setMenuName] = useState<string>('');
    const [selectedMenuItems, setSelectedMenuItems] = useState<IMenuItem[]>([]);
    const [starterMenuItems, setStarterMenuItems] = useState<IMenuItem[]>([]);
    const [mainMenuItems, setMainMenuItems] = useState<IMenuItem[]>([]);
    const [dessertMenuItems, setDessertMenuItems] = useState<IMenuItem[]>([]);
    const [drinkMenuItems, setDrinkMenuItems] = useState<IMenuItem[]>([]);

    const menu: IPostMenu = {
        data: {
            type: 'menus',
            attributes: {
                name: '',
            },
            relationships: {
                menu_items: [],
            },
        },
    };

    useEffect(() => {
        setErrorMessage('');

        const fetchMenuItems = async (): Promise<void> => {
            fetch(`${apiUrl}/restaurants/${restaurantId}/menu-items`, {
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
                    setStarterMenuItems(
                        data.data.filter(
                            (item: IMenuItem) =>
                                item.attributes.type === 'starter'
                        )
                    );
                    setMainMenuItems(
                        data.data.filter(
                            (item: IMenuItem) => item.attributes.type === 'main'
                        )
                    );
                    setDessertMenuItems(
                        data.data.filter(
                            (item: IMenuItem) =>
                                item.attributes.type === 'dessert'
                        )
                    );
                    setDrinkMenuItems(
                        data.data.filter(
                            (item: IMenuItem) =>
                                item.attributes.type === 'drink'
                        )
                    );
                })
                .catch((error) => {
                    if (error?.message) {
                        setErrorMessage(error.message);
                        return;
                    }

                    setErrorMessage('Une erreur inconnue est survenue');
                });
        };

        fetchMenuItems();

        return () => {
            setStarterMenuItems([]);
            setMainMenuItems([]);
            setDessertMenuItems([]);
            setDrinkMenuItems([]);
            setSelectedMenuItems([]);
        };
    }, [apiUrl, token, navigate, restaurantId]);

    const handleCreateMenu = async (): Promise<void> => {
        setErrorMessage('');
        setSuccessMessage('');
        setHasError(false);

        menu.data.attributes.name = menuName;

        const formattedMenuItems = selectedMenuItems.map(
            (menuItem: IMenuItem) => ({
                type: 'menu-items' as const,
                id: menuItem.id,
            })
        );

        menu.data.relationships.menu_items = formattedMenuItems;

        try {
            setIsLoading(true);

            const response = await fetch(
                `${apiUrl}/restaurants/${restaurantId}/menus`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(menu),
                }
            );

            if (!response.ok) {
                const json = await response.json();

                if (response.status === 401) {
                    setErrorMessage(
                        'Vous devez être connecté pour créer un menu'
                    );
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

                setErrorMessage('Erreur api lors de la création du lieu');
            }

            const data = await response.json();
            setRestaurantMenus([...restaurantMenus, data]);

            setSuccessMessage('Menu créé avec succès');

            setTimeout(() => {
                setSuccessMessage('');
            }, 2000);

            setMenuName('');
            setSelectedMenuItems([]);
        } catch (error) {
            console.error('Erreur inconnue lors de la création du menu', error);

            setErrorMessage('Erreur inconnue lors de la création du menu');

            setHasError(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container min-w-[500px] max-w-[500px] w-1/2">
            {/* Menu creator */}
            <div className="flex flex-col space-y-4 border border-gray-200 p-4 rounded shadow-md h-auto">
                <h2 className="text-xl font-bold">
                    Créer un menu pour votre restaurant
                </h2>

                <p>
                    Composez le nouveau menu que vous souhaitez proposer à vos
                    clients.
                </p>

                <label htmlFor="menu-name">Nom du menu</label>
                <input
                    type="text"
                    name="menu-name"
                    className="border border-gray-300 rounded p-2"
                    placeholder="Nom du menu"
                    value={menuName}
                    onChange={(e) => {
                        setMenuName(e.target.value);
                    }}
                    required
                />
                <label htmlFor="">Entrée</label>
                {starterMenuItems.length > 0 ? (
                    <ChoicePicker
                        menuItems={starterMenuItems}
                        selectedMenuItems={selectedMenuItems}
                        setSelectedMenuItems={setSelectedMenuItems}
                    ></ChoicePicker>
                ) : (
                    <>
                        <select className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                            <option value="">Sélectionner</option> 
                        </select>
                    </>
                )}

                <label htmlFor="">Plat</label>
                {mainMenuItems.length > 0 ? (
                    <ChoicePicker
                        menuItems={mainMenuItems}
                        selectedMenuItems={selectedMenuItems}
                        setSelectedMenuItems={setSelectedMenuItems}
                    ></ChoicePicker>
                ) : (
                    <>
                        <select className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                            <option value="">Sélectionner</option> 
                        </select>
                    </>
                )}

                <label htmlFor="">Dessert</label>
                {dessertMenuItems.length > 0 ? (
                    <ChoicePicker
                        menuItems={dessertMenuItems}
                        selectedMenuItems={selectedMenuItems}
                        setSelectedMenuItems={setSelectedMenuItems}
                    ></ChoicePicker>
                ) : (
                    <>
                        <select className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                            <option value="">Sélectionner</option> 
                        </select>
                    </>
                )}

                <label htmlFor="">Boisson</label>
                {drinkMenuItems.length > 0 ? (
                    <ChoicePicker
                        menuItems={drinkMenuItems}
                        selectedMenuItems={selectedMenuItems}
                        setSelectedMenuItems={setSelectedMenuItems}
                    ></ChoicePicker>
                ) : (
                    <>
                        <select className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                            <option value="">Sélectionner</option> 
                        </select>
                    </>
                )}

                <LoadingButton
                    buttonClass="px-4 py-2 bg-green-500 text-white w-full rounded hover:bg-green-600 w-1/2"
                    title="Créer un menu"
                    isLoading={isLoading}
                    hasError={hasError}
                    onClickCallback={handleCreateMenu}
                />

                <button
                    className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-800"
                    onClick={() => showComponentCallback('menu-item')}
                >
                    Ajouter un ingrédient à mon restaurant
                </button>

                {errorMessage && (
                    <p className="bg-red-200 py-3 rounded-lg my-4 text-center text-red-800 text-base leading-8">
                        {errorMessage}
                    </p>
                )}

                {successMessage.length !== 0 && (
                    <div className="mt-4 bg-green-400 rounded-lg p-4">
                        <p className="text-green-800 text-sm">
                            {successMessage}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
