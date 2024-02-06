import { useState } from 'react';
import AsyncRequestButton from './AsyncRequestButton';

export default function UserSeeder(): JSX.Element {
    const [seedAdminUsername, setSeedAdminUsername] = useState<string>('');
    const [seedOwnerUsername, setSeedOwnerUsername] = useState<string>('');
    const [seedCustomerUsername, setSeedCustomerUsername] =
        useState<string>('');

    const setSeedUsernames = (data: unknown): void => {
        if (data === null || typeof data !== 'object') {
            return;
        }

        const { adminUsername, ownerUsername, customerUsername } = data as {
            adminUsername?: string;
            ownerUsername?: string;
            customerUsername?: string;
        };

        setSeedAdminUsername(adminUsername ?? '');
        setSeedOwnerUsername(ownerUsername ?? '');
        setSeedCustomerUsername(customerUsername ?? '');
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
                suivantes :
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
                            {seedAdminUsername}
                        </td>
                        <td className="border px-4 py-2">
                            {seedOwnerUsername}
                        </td>
                        <td className="border px-4 py-2">
                            {seedCustomerUsername}
                        </td>
                    </tr>
                    <tr>
                        <td className="border px-4 py-2">
                            {seedAdminUsername !== '' ? 'password' : ''}
                        </td>
                        <td className="border px-4 py-2">
                            {seedOwnerUsername !== '' ? 'password' : ''}
                        </td>
                        <td className="border px-4 py-2">
                            {seedCustomerUsername !== '' ? 'password' : ''}
                        </td>
                    </tr>
                </tbody>
            </table>
        </>
    );
}
