import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const AuthenticatedRoutes: React.FC = () => {
    const isLoggedIn = useSelector(
        (state: RootState) => state.authentication.authenticated
    );

    const location = useLocation();

    if (!isLoggedIn) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    return <Outlet />;
};

export default AuthenticatedRoutes;
