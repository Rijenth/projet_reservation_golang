import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import MainLayout from './pages/MainLayout';
import Register from './pages/Register';
import Login from './pages/Login';

const AuthenticatedRoutes: React.FC = () => {
    const isLoggedIn = false; // changer cette valeur pour tester les routes authenticated

    const location = useLocation();

    if (!isLoggedIn) {
        return <Navigate to="/login" state={{ from: location }} replace />;
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
                    {/* Routes qui necessite une authentification */}
                </Route>
            </Routes>
        </MainLayout>
    );
}

export default App;
