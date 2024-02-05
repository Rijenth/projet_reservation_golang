import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import CustomerNavbar from '../components/navbar/CustomerNavbar';
import PlacesList from '../components/PlacesList';
import { RestaurantList } from '../components/RestaurantList';

export default function CustomerDashboard(): JSX.Element {
    const userRole = useSelector(
        (state: RootState) => state.authentication.user?.role
    );
    const navigate = useNavigate();

    const [placeId, setPlaceId] = useState<number>(0);

    const setPlaceIdHandler = (id: number): void => {
        setPlaceId(id);
    };

    useEffect(() => {
        if (userRole !== 'customer') {
            navigate('/logout');

            return;
        }
    }, [userRole, navigate]);

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <CustomerNavbar />

            <div className="mt-4 flex flex-row gap-4 items-start justify-center">
                <PlacesList placeIdHandler={setPlaceIdHandler} />

                <RestaurantList placeId={placeId} />
            </div>
        </div>
    );
}
