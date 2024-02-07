import React, { useEffect, useState } from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import ChangePageButton from '../components/ChangePageButton';
import Title from '../components/Title';
import Response from '../components/Response';
import { Res } from '../types/Types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import UserSeeder from '../components/UserSeeder';
import LoadingButton from '../components/LoadingButton';

const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

const Login: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [hasError, setHasError] = useState<boolean>(false);
    const [Username, setUsername]: [string, (Username: string) => void] =
        useState('');
    const [Password, setPassword]: [string, (Password: string) => void] =
        useState('');
    const [response, setResponse]: [
        [] | Res[],
        (response: [] | Res[]) => void,
    ] = useState<[] | Res[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>('');

    const navigate: NavigateFunction = useNavigate();

    const dispatch = useDispatch();

    const authentication = useSelector(
        (state: RootState) => state.authentication
    );

    //Camrynconsequatur

    useEffect(() => {
        if (authentication.authenticated && authentication.user) {
            navigate(`/dashboard/${authentication.user.role}`);

            return;
        }
    }, [authentication, navigate]);

    const login: () => void = (): void => {
        setErrorMessage('');

        setIsLoading(true);

        fetch(`${apiUrl}/login`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/vnd.api+json',
            },
            body: JSON.stringify({
                Username,
                Password,
            }),
        })
            .then((res: Response) => {
                if (!res.ok) {
                    return res.json().then((err: Error) => {
                        throw err;
                    });
                }
                return res.json();
            })
            .then((data) => {
                dispatch({
                    type: 'authentication/setAuthenticated',
                    payload: {
                        authenticated: true,
                        token: data.token,
                        user: data.user,
                    },
                });

                setIsLoading(false);
            })
            .catch((error) => {
                if (error.errors) {
                    setResponse(error.errors);
                } else if (error.message) {
                    setErrorMessage(error.message);
                }

                setHasError(true);

                setTimeout(() => {
                    setHasError(false);
                }, 1000);
            });
    };

    const register: () => void = (): void => {
        navigate('/register');
    };

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <Title title="Merci de vous connecter !"></Title>
            </div>
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <div className="space-y-6">
                    <form className="space-y-8" onSubmit={login}>
                        <div>
                            <label
                                htmlFor="username"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                Nom d&#39;utilisateur
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    value={Username}
                                    onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                    ): void => setUsername(e.target.value)}
                                ></input>
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    Mot de passe
                                </label>
                            </div>
                            <div className="mt-2">
                                <input
                                    type="password"
                                    className=" pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    value={Password}
                                    onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                    ): void => setPassword(e.target.value)}
                                ></input>
                            </div>
                        </div>

                        {errorMessage && (
                            <p className="bg-red-200 py-3 rounded-lg my-4 text-center text-red-800 text-base leading-8">
                                {errorMessage}
                            </p>
                        )}

                        <div>
                            <LoadingButton
                                buttonClass="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                title="Se connecter"
                                isLoading={isLoading}
                                hasError={hasError}
                                onClickCallback={login}
                            />
                        </div>
                    </form>

                    <div className="flex justify-center">
                        <ChangePageButton
                            buttonFunction={register}
                            page="S'inscrire"
                        ></ChangePageButton>
                    </div>

                    <Response response={response}></Response>

                    <UserSeeder />
                </div>
            </div>
        </div>
    );
};

export default Login;
