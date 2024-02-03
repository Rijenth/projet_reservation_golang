import { Navigate, Outlet, Route, useLocation } from 'react-router-dom';
import MainLayout from './pages/MainLayout';

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
            <Route path="/login">
                <p>Login page</p>
            </Route>

            <Route element={<AuthenticatedRoutes />}>
                {/* Routes qui necessite une authentification */}
            </Route>
        </MainLayout>
    );
}

export default App;
