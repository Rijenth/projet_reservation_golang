import { useState } from 'react';
import AdminNavbar from '../components/navbar/AdminNavbar';
import PlacesListForAdmin from '../components/PlacesListForAdmin';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import AdminPlaceHandler from '../components/AdminPlaceHandler';
import AdminMenusList from '../components/AdminMenusList';
import { RestaurantList } from '../components/RestaurantList';
import { IPlace } from '../interfaces/IPlace';

export default function AdminDashboard(): JSX.Element {
    const [placeId, setPlaceId] = useState<number>(0);
    const [restaurantId, setRestaurantId] = useState<number>(0);
    const [restaurantName, setRestaurantName] = useState<string>('');
    const [newPlace, setNewPlace] = useState<IPlace>({
        id: '',
        attributes: {
            name: '',
            address: '',
        },
    });
    const userId = useSelector(
        (state: RootState) => state.authentication.user?.id
    );

    const setPlaceIdHandler = (id: number): void => {
        setPlaceId(id);
        setRestaurantId(0);
    };

    const setRestaurantIdHandler = (id: number, name: string): void => {
        setRestaurantId(id);
        setRestaurantName(name);
    };

    const setNewPlaceHandler = (newPlace: IPlace): void => {
        setNewPlace(newPlace);
    };

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <AdminNavbar />

            <div className="mt-4 flex flex-row gap-4 items-start justify-center">
                <PlacesListForAdmin
                    placeIdHandler={setPlaceIdHandler}
                    userId={userId}
                    newPlace={newPlace}
                />

                {restaurantId === 0 && (
                    <RestaurantList
                        placeId={placeId}
                        restaurantIdHandler={setRestaurantIdHandler}
                    />
                )}

                {restaurantId !== 0 && (
                    <AdminMenusList
                        restaurantId={restaurantId}
                        restaurantName={restaurantName}
                    />
                )}

                <AdminPlaceHandler
                    userId={userId}
                    setNewPlaceHandler={setNewPlaceHandler}
                />
            </div>
        </div>
    );
}
