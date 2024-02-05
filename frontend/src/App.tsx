import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import MainLayout from './pages/MainLayout';
import Register from './pages/Register';
import Login from './pages/Login';
import { useSelector } from 'react-redux';
import { RootState } from './store/store';
import CustomerDashboard from './pages/CustomerDashboard';
import Logout from './pages/Logout';
import AdminDashboard from './pages/AdminDashboard';
import OwnerDashboard from './pages/OwnerDashboard';

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

function App(): JSX.Element {
    return (
        <MainLayout>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route element={<AuthenticatedRoutes />}>
                    <Route
                        path="/dashboard/customer"
                        element={<CustomerDashboard />}
                    />
                    <Route
                        path="/dashboard/owner"
                        element={<AdminDashboard />}
                    />
                    <Route
                        path="/dashboard/admin"
                        element={<OwnerDashboard />}
                    />
                </Route>

                <Route path="/logout" element={<Logout />} />

                <Route path="*" element={<h1>Not Found</h1>} />
            </Routes>
        </MainLayout>
    );
}

export default App;
