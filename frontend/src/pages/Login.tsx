import React, { useState } from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import ChangePageButton from '../components/ChangePageButton';
import Title from '../components/Title';
import Response from '../components/Response';
import { Res } from '../types/Types';

const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

const Login: React.FC = () => {
    const [Username, setUsername]: [string, (Username: string) => void] =
        useState('');
    const [Password, setPassword]: [string, (Password: string) => void] =
        useState('');
    const [response, setResponse]: [
        [] | Res[],
        (response: [] | Res[]) => void,
    ] = useState<[] | Res[]>([]);

    const navigate: NavigateFunction = useNavigate();

    const login: (e: React.FormEvent) => void = (e: React.FormEvent): void => {
        e.preventDefault();

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
            .then((response: Response) => {
                if (!response.ok) {
                    return response.json().then((err: Error) => {
                        throw err;
                    });
                }
                return response.json();
            })
            .then((data) => {
                console.log(data);
                // navigate('/home');
            })
            .catch((error) => {
                console.error('Error:', error);

                setResponse(error.errors);
            });
    };

    const register: () => void = (): void => {
        navigate('/register');
    };

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <Title title="Please log in !"></Title>
            </div>
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <div className="space-y-6">
                    <form className="space-y-8" onSubmit={login}>
                        <div>
                            <label
                                htmlFor="username"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                Username
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
                                    Password
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

                        <div>
                            <input
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                value="Login"
                            ></input>
                        </div>
                    </form>
                    <div className="flex justify-center">
                        <ChangePageButton
                            buttonFunction={register}
                            page="Register"
                        ></ChangePageButton>
                    </div>
                    <Response response={response}></Response>
                </div>
            </div>
        </div>
    );
};

export default Login;
