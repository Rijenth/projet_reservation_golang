import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import LogoutButton from '../LogoutButton';
import { Link } from 'react-router-dom';

export default function AdminNavbar(): JSX.Element {
    const username = useSelector(
        (state: RootState) => state.authentication.user?.username
    );

    return (
        <nav className="bg-gray-800 p-4 rounded flex">
            <div className="container mx-auto flex items-center justify-between">
                <a href="/" className="text-white">
                    FoodCourt - Espace administrateur(rice) de {username}
                </a>

                <div className="space-x-4">
                    <Link to="/dashboard/admin" className="text-white">
                        Accueil
                    </Link>

                    <Link to="/dashboard/admin/places" className="text-white">
                        Gérer les lieux
                    </Link>

                    <LogoutButton />
                </div>
            </div>
        </nav>
    );
}
