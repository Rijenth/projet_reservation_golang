import { useEffect, useState } from 'react';
import { IRestaurant } from '../interfaces/IRestaurant';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { useNavigate } from 'react-router-dom';
import { IPlace } from '../interfaces/IPlace';
import { IMenu } from '../interfaces/IMenu';
import { ICommand } from '../interfaces/ICommand';
import RestaurantMenuHandler from '../components/RestaurantMenuHandler';
import RestaurantMenuItemsHandler from '../components/RestaurantMenuItemsHandler';

export default function OwnerDashboard(): JSX.Element {
    const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
    const authentication = useSelector(
        (state: RootState) => state.authentication
    );
    const [ownerRestaurants, setOwnerRestaurants] = useState<IRestaurant[]>([]);
    const [restaurantPlace, setRestaurantPlace] = useState<IPlace>();
    const [restaurantMenus, setRestaurantMenus] = useState<IMenu[]>([]);
    const [restaurantCommands, setRestaurantCommands] = useState<ICommand[]>(
        []
    );
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [showCreateMenu, setShowCreateMenu] = useState<boolean>(true);
    const [showCreateMenuItem, setShowCreateMenuItem] =
        useState<boolean>(false);

    const handleShowComponent = (component: string): void => {
        if (component === 'menu') {
            setShowCreateMenu(true);
            setShowCreateMenuItem(false);
        } else if (component === 'menu-item') {
            setShowCreateMenu(false);
            setShowCreateMenuItem(true);
        }
    };

    const navigate = useNavigate();

    useEffect(() => {
        const fetchRestaurantPlaces = async (
            placeId: number
        ): Promise<void> => {
            const response = await fetch(`${apiUrl}/places/${placeId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authentication.token}`,
                },
            });

            if (!response.ok) {
                setErrorMessage(
                    'Une erreur est survenue lors de la récupération des places'
                );
                return;
            }

            const json = await response.json();

            setRestaurantPlace(json.data);
        };
        const fetchRestaurantMenus = async (
            restaurantId: number
        ): Promise<void> => {
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
        const fetchRestaurantCommands = async (
            restaurantId: number
        ): Promise<void> => {
            const response = await fetch(
                `${apiUrl}/restaurants/${restaurantId}/commands`,
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
                    'Une erreur est survenue lors de la récupération des commandes'
                );
                return;
            }

            const json = await response.json();

            setRestaurantCommands(json.data);
        };
        const fetchOwnerRestaurants = async (): Promise<void> => {
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
                if (response.status === 401) {
                    navigate('/logout');
                    return;
                }

                setErrorMessage(
                    'Une erreur est survenue lors de la récupération des restaurants'
                );
                return;
            }

            const json = await response.json();

            if (json.data.length === 0) {
                navigate('/dashboard/owner/create-restaurant');
            }
            setOwnerRestaurants(json.data);

            fetchRestaurantPlaces(json.data[0].relationships.place.data.id);
            fetchRestaurantMenus(json.data[0].id);
            fetchRestaurantCommands(json.data[0].id);
        };

        fetchOwnerRestaurants();
    }, [apiUrl, authentication, navigate]);

    return (
        <>
            {errorMessage && (
                <div
                    className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                    role="alert"
                >
                    <strong className="font-bold">Erreur !</strong>
                    <span className="block sm:inline">{errorMessage}</span>
                </div>
            )}

            <h1 className="text-2xl font-bold my-8 ml-8 underline">
                Bienvenue sur votre espace restaurateur
            </h1>

            <div className="flex flex-row justify-evenly">
                <div>
                    <div className="container min-w-[500px] max-w-[500px] w-1/2">
                        <div className="flex flex-col space-y-4 border border-gray-200 p-4 rounded shadow-md">
                            <h2 className="text-xl font-bold">Informations</h2>
                            <p>
                                Vous êtes connecté en tant que{' '}
                                {authentication.user?.username}
                            </p>
                            <p>
                                Vous êtes propriétaire de{' '}
                                {ownerRestaurants.length} restaurant(s)
                            </p>
                            <p>
                                Vous avez {restaurantMenus.length} menu(s)
                                enregistré(s)
                            </p>
                            <p>
                                Vous avez {restaurantCommands.length}{' '}
                                commande(s) enregistrée(s)
                            </p>
                        </div>
                    </div>
                    <div className="container min-w-[500px] max-w-[500px] mt-4 w-1/2">
                        <div className="flex flex-col">
                            {ownerRestaurants.map((restaurant) => (
                                <div
                                    key={restaurant.id}
                                    className="bg-white shadow-md rounded p-4 border border-gray-200"
                                >
                                    <p className="text-xl font-bold">
                                        {restaurant.attributes.name}
                                    </p>

                                    <p>
                                        {restaurantPlace?.attributes.name} -{' '}
                                        {restaurantPlace?.attributes.address}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="container min-w-[500px] max-w-[500px] mt-4 w-1/2">
                        <div className="flex flex-col border border-gray-200 p-4 rounded shadow-md">
                            <h2 className="text-xl font-bold">Statistiques</h2>
                            <p>
                                Nombre de commandes passées dans votre
                                restaurant : {restaurantCommands.length}
                            </p>
                            <p className="text-lg font-bold mt-4">
                                Commandes en cours :{' '}
                                {
                                    restaurantCommands.filter(
                                        (command) =>
                                            command.attributes.status ===
                                            'ongoing'
                                    ).length
                                }
                            </p>
                            <p className="text-lg font-bold mt-4">
                                Commandes en prêtes :{' '}
                                {
                                    restaurantCommands.filter(
                                        (command) =>
                                            command.attributes.status ===
                                            'ready'
                                    ).length
                                }
                            </p>
                            <p className="text-lg font-bold mt-4">
                                Commandes en livrées :{' '}
                                {
                                    restaurantCommands.filter(
                                        (command) =>
                                            command.attributes.status ===
                                            'delivered'
                                    ).length
                                }
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col justify-between">
                    {ownerRestaurants.length > 0 && (
                        <>
                            {showCreateMenu && (
                                <RestaurantMenuHandler
                                    restaurantMenus={restaurantMenus}
                                    setRestaurantMenus={setRestaurantMenus}
                                    restaurantId={ownerRestaurants[0].id}
                                    showComponentCallback={handleShowComponent}
                                />
                            )}
                            {showCreateMenuItem && (
                                <RestaurantMenuItemsHandler
                                    restaurantId={ownerRestaurants[0].id}
                                    showComponentCallback={handleShowComponent}
                                />
                            )}
                        </>
                    )}
                </div>

                {/* right */}
            </div>
        </>
    );
}
