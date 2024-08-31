import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGlobalContext } from './context/context';

const LoginForm = () => {
    const navigate = useNavigate(); // Get the navigate function from useNavigate
    const { credentialLogin, LoginHandleChange, LoginHandleSubmit, formError, error } = useGlobalContext();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await LoginHandleSubmit(e);

        if (result && result.success) {
            navigate('/'); // Navigate to home page upon successful login
        } else {
            // Optionally handle unsuccessful login here
        }
    };

    return (
        <div className="flex w-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Login to your account
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                            Email address
                        </label>
                        <div className="mt-2">
                            <input
                                id="email"
                                name="emailId"
                                type="email"
                                value={credentialLogin.emailId}
                                onChange={LoginHandleChange}
                                required
                                autoComplete="email"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                            {formError.emailId && <p className="text-red-600">{formError.emailId}</p>}
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                Password
                            </label>
                            <div className="text-sm">
                                <Link to="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                                    Forgot password?
                                </Link>
                            </div>
                        </div>
                        <div className="mt-2">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={credentialLogin.password}
                                onChange={LoginHandleChange}
                                required
                                autoComplete="current-password"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                            {formError.password && <p className="text-red-600">{formError.password}</p>}
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Login
                        </button>
                    </div>

                    {error && <p className="text-red-600">{error}</p>}
                </form>

                <p className="mt-10 text-center text-sm text-gray-500">
                    Not a member?{' '}
                    <Link to="/signup" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginForm;
