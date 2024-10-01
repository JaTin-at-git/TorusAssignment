import React from "react";
import { useNavigate, useRouteError } from "react-router-dom";

const ErrorPage = () => {
    const error = useRouteError(); // Get error details
    const navigate = useNavigate(); // To allow navigation

    // Function to navigate back to the home page or previous page
    const handleGoBack = () => {
        navigate(-1); // Goes back to the previous page
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-4xl font-bold text-red-500">Oops! Something went wrong.</h1>
            <p className="mt-4 text-lg text-gray-700">An error occurred while trying to load the page.</p>

            {/* Display error message if available */}
            {error && (
                <div className="mt-4 p-4 bg-white border border-red-200 rounded shadow-md max-w-lg">
                    <h2 className="text-xl font-semibold text-red-600">Error Details:</h2>
                    <p className="mt-2 text-gray-800">{error.statusText || error.message}</p>

                    {/* Optionally show status code if available */}
                    {error.status && <p className="mt-1 text-gray-600">Status Code: {error.status}</p>}
                </div>
            )}

            <button
                onClick={handleGoBack}
                className="mt-6 px-6 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
            >
                Go Back
            </button>
        </div>
    );
};

export default ErrorPage;
