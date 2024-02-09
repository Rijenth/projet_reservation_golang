import AsyncRequestButton from './AsyncRequestButton';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';

export default function UserSeeder(): JSX.Element {
    const seeder = useSelector((state: RootState) => state.seeder);
    const dispatch = useDispatch();

    const setSeedUsernames = (data: unknown): void => {
        if (data === null || typeof data !== 'object') {
            return;
        }

        const { adminUsername, ownerUsername, customerUsername } = data as {
            adminUsername?: string;
            ownerUsername?: string;
            customerUsername?: string;
        };

        dispatch({
            type: 'seeder/setSeeder',
            payload: {
                adminUsername: adminUsername ?? '',
                ownerUsername: ownerUsername ?? '',
                customerUsername: customerUsername ?? '',
            },
        });
    };

    return (
        <>
            <AsyncRequestButton
                requestParams={{
                    url: 'http://localhost:8000/seed',
                    method: 'GET',
                }}
                customClass="bg-gray-500 text-white font-bold py-2 px-4 rounded w-full"
                buttonMessage="Seed Application"
                handleDataCallback={setSeedUsernames}
            />

            <p>
                <strong>Instruction:</strong>
                <br />
                Vous pouvez utiliser le bouton &quot;Seed Application&quot; pour
                ajouter des utilisateurs et vous connecter avec les informations
                suivantes.
            </p>

            <p>
                Ces identifiants ne sont valables que si le serveur n&apos;a pas
                été redémarré.
            </p>

            <table className="table-auto">
                <thead>
                    <tr>
                        <th className="px-4 py-2">Administrateur</th>
                        <th className="px-4 py-2">Restaurateur</th>
                        <th className="px-4 py-2">Client</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="border px-4 py-2">
                            {seeder.adminUsername}
                        </td>
                        <td className="border px-4 py-2">
                            {seeder.ownerUsername}
                        </td>
                        <td className="border px-4 py-2">
                            {seeder.customerUsername}
                        </td>
                    </tr>
                    <tr>
                        <td className="border px-4 py-2">
                            {seeder.adminUsername !== '' ? 'password' : ''}
                        </td>
                        <td className="border px-4 py-2">
                            {seeder.ownerUsername !== '' ? 'password' : ''}
                        </td>
                        <td className="border px-4 py-2">
                            {seeder.customerUsername !== '' ? 'password' : ''}
                        </td>
                    </tr>
                </tbody>
            </table>
        </>
    );
}
