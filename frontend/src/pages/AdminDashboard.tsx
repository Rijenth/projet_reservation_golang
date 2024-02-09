import { useState } from 'react';
import AdminNavbar from '../components/navbar/AdminNavbar';
import PlacesListForAdmin from '../components/PlacesListForAdmin';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { RestaurantListForAdmin } from '../components/RestaurantListForAdmin';
import AdminPlaceHandler from '../components/AdminPlaceHandler';

export default function AdminDashboard(): JSX.Element {
    const [placeId, setPlaceId] = useState<number>(0);
    const [restaurantId, setRestaurantId] = useState<number>(0);
    const userId = useSelector((state: RootState) => state.authentication.user?.id)

    const setPlaceIdHandler = (id: number): void => {
        setPlaceId(id);
        setRestaurantId(0);
    };

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <AdminNavbar />

            <div className="mt-4 flex flex-row gap-4 items-start justify-center">
                <PlacesListForAdmin placeIdHandler={setPlaceIdHandler} userId = {userId}/>

                {restaurantId === 0 && (
                    <RestaurantListForAdmin
                        placeId={placeId}
                    />
                )}

                <AdminPlaceHandler userId ={userId}/>

            </div>
        </div>
    );
}
