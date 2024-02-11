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

                <div className="space-x-4">
                    <Link to="/dashboard/owner" className="text-white">
                        Accueil
                    </Link>

                    <Link to="/dashboard/owner/menus" className="text-white">
                        Mes menus
                    </Link>

                    <Link to="/dashboard/owner/commands" className="text-white">
                        Mes commandes
                    </Link>

                    <LogoutButton />
                </div>
            </div>
        </nav>
    );
}
