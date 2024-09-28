import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {ToastContainer, Zoom} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Root from "./pages/Root.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";

function App() {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <Root/>,
            errorElement: <ErrorPage/>,
            children: [
                {
                    path: "",
                    element: <ProfilePage/>,
                }, {
                    path: "signup",
                    element: <SignupPage/>
                }, {
                    path: "login",
                    element: <LoginPage/>
                }
            ],
        },
    ]);

    return (
        <div>
            <div>
                <ToastContainer
                    position="top-right"
                    autoClose="1000"
                    closeOnClick="true"
                    transition={Zoom}
                    draggable="true"
                />
                <RouterProvider router={router}/>
            </div>
        </div>
    );
}

export default App;
