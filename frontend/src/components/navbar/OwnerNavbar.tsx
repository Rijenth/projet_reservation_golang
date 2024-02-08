import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import LogoutButton from '../LogoutButton';
import { Link } from 'react-router-dom';

export default function OwnerNavbar(): JSX.Element {
    const username = useSelector(
        (state: RootState) => state.authentication.user?.username
    );

    return (
        <nav className="bg-gray-800 p-4 rounded flex">
            <div className="container mx-auto flex items-center justify-between">
                <Link to="/" className="text-white">
                    FoodCourt - Espace restaurateur de {username}
                </Link>

                <Link
                    to="/dashboard/owner/create-restaurant"
                    className="text-white"
                >
                    Créer un restaurant
                </Link>

                <div className="space-x-4">
                    <LogoutButton />
                </div>
            </div>
        </nav>
    );
}
