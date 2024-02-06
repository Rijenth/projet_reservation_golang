import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { Navigate, Outlet } from 'react-router-dom';

const OwnerRoutes: React.FC = () => {
    const userRole = useSelector(
        (state: RootState) => state.authentication.user?.role
    );

    if (userRole !== 'owner') {
        return <Navigate to="/logout" />;
    }

    return <Outlet />;
};

export default OwnerRoutes;
