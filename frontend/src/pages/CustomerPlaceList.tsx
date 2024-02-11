import { useState } from 'react';
import PlacesList from '../components/PlacesList';
import { RestaurantList } from '../components/RestaurantList';
import CustomerCommandeHandler from '../components/CustomerCommandHandler';
import CustomerMenuList from '../components/CustomerMenuList';

interface IMenu {
    id: string;
    attributes: {
        name: string;
        price: number;
    };
}

export default function CustomerPlaceList(): JSX.Element {
    const [placeId, setPlaceId] = useState<number>(0);
    const [restaurantId, setRestaurantId] = useState<number>(0);
    const [restaurantName, setRestaurantName] = useState<string>('');
    const [selectedMenus, setSelectedMenus] = useState<IMenu[]>([]);

    const setPlaceIdHandler = (id: number): void => {
        setPlaceId(id);
        setRestaurantId(0);
    };
    const setRestaurantIdHandler = (id: number, name: string): void => {
        setRestaurantId(id);
        setRestaurantName(name);
    };
    const setSelectedMenusHandler = (menu: IMenu): void => {
        if (selectedMenus.some((m) => m.id === menu.id)) {
            return;
        }

        setSelectedMenus([...selectedMenus, menu]);
    };
    const cancelSelectedMenusHandler = (): void => {
        setSelectedMenus([]);
    };

    return (
        <div className="mt-4 flex flex-row gap-4 items-start justify-center">
            <PlacesList placeIdHandler={setPlaceIdHandler} />

            {restaurantId === 0 && (
                <RestaurantList
                    placeId={placeId}
                    restaurantIdHandler={setRestaurantIdHandler}
                />
            )}

            {restaurantId !== 0 && (
                <>
                    <CustomerMenuList
                        restaurantId={restaurantId}
                        restaurantName={restaurantName}
                        selectedMenusHandler={setSelectedMenusHandler}
                    />

                    <CustomerCommandeHandler
                        restaurantId={restaurantId}
                        restaurantName={restaurantName}
                        menus={selectedMenus}
                        resetSelectedMenus={cancelSelectedMenusHandler}
                    />
                </>
            )}
        </div>
    );
}
