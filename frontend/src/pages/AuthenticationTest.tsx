import AsyncRequestButton from '../components/AsyncRequestButton';

export default function AuthenticationTest(): JSX.Element {
    const Register = async (): Promise<void> => {
        console.log('[Test] Register');

        const data = {
            data: {
                type: 'users',
                attributes: {
                    username: 'admin',
                    firstname: 'Pierre',
                    lastname: 'LeRocher',
                    password: 'password',
                    role: 'admin',
                },
            },
        };

        await fetch('http://localhost:8000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then((response) => response.json())
            .then((json) => {
                console.log(json);
            });
    };

    const login = async (): Promise<void> => {
        console.log('[Test] login');

        await fetch('http://localhost:8000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: 'admin',
                password: 'password',
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);

                if (data.token) localStorage.removeItem('token');
                localStorage.setItem('token', data.token);
            });
    };

    const getCurrentUser = async (): Promise<void> => {
        console.log('[Test] getCurrentUser');

        await fetch('http://localhost:8000/me', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('token'),
            },
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
            });
    };

    return (
        <div>
            <h1>Test</h1>
            <button
                className="bg-gray-500 text-white font-bold py-2 px-4 rounded"
                onClick={Register}
            >
                Register test
            </button>

            <button
                className="bg-gray-500 text-white font-bold py-2 px-4 rounded ml-2"
                onClick={login}
            >
                Login
            </button>

            <button
                className="bg-gray-500 text-white font-bold py-2 px-4 rounded ml-2"
                onClick={getCurrentUser}
            >
                Me
            </button>

            <AsyncRequestButton
                requestParams={{
                    url: 'http://localhost:8000/seed',
                    method: 'GET',
                }}
                buttonMessage="Seed Application"
            />
        </div>
    );
}
