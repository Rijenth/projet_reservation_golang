import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoutes: React.FC = () => {
    const userRole = useSelector(
        (state: RootState) => state.authentication.user?.role
    );

    if (userRole !== 'admin') {
        return <Navigate to="/logout" />;
    }

    return <Outlet />;
};

export default AdminRoutes;
