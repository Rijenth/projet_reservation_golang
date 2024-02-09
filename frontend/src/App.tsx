import { Route, Routes } from 'react-router-dom';
import MainLayout from './pages/MainLayout';
import Register from './pages/Register';
import Login from './pages/Login';
import CustomerDashboard from './pages/CustomerDashboard';
import Logout from './pages/Logout';
import AdminDashboard from './pages/AdminDashboard';
import OwnerDashboard from './pages/OwnerDashboard';
import AuthenticatedRoutes from './middlewares/AuthenticatedRoutes';
import CustomerRoutes from './middlewares/CustomerRoutes';
import OwnerRoutes from './middlewares/OwnerRoutes';
import AdminRoutes from './middlewares/AdminRoutes';
import CustomerCommands from './pages/CustomerCommands';
import OwnerCreateRestaurant from './pages/OwnerCreateRestaurant';
import OwnerCommandList from './pages/OwnerCommandList';

function App(): JSX.Element {
    return (
        <MainLayout>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route element={<AuthenticatedRoutes />}>
                    <Route element={<CustomerRoutes />}>
                        <Route
                            path="/dashboard/customer"
                            element={<CustomerDashboard />}
                        />
                        <Route
                            path="/dashboard/customer/commands"
                            element={<CustomerCommands />}
                        />
                    </Route>

                    <Route element={<AdminRoutes />}>
                        <Route
                            path="/dashboard/admin"
                            element={<AdminDashboard />}
                        />
                    </Route>

                    <Route element={<OwnerRoutes />}>
                        <Route
                            path="/dashboard/owner"
                            element={<OwnerDashboard />}
                        />
                        <Route
                            path="/dashboard/owner/commands"
                            element={<OwnerCommandList />}
                        />
                        <Route
                            path="/dashboard/owner/create-restaurant"
                            element={<OwnerCreateRestaurant />}
                        />
                    </Route>
                </Route>

                <Route path="/logout" element={<Logout />} />

                <Route path="*" element={<h1>Not Found</h1>} />
            </Routes>
        </MainLayout>
    );
}

export default App;
