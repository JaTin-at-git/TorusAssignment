import React, {Fragment} from "react";
import {NavLink, useNavigate, useNavigation} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {logoutUser} from "../redux/apiCalls/userCalls.js";

const UserNavbar = () => {
    const user = useSelector((state) => state.persistedReducer.user.user);
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    async function handleLogout() {
        await logoutUser(dispatch);
    }

    const underlineIfActive = ({isActive}) => `${isActive ? "text-black box-border transition-all border-blue-600 border-b-2" : "text-gray-500"}`;

    const links = (<>
        {!user && (<NavLink to="/signup" className={underlineIfActive}>
            Signup
        </NavLink>)}
        {!user && (<NavLink to="/login" className={underlineIfActive}>
            Login
        </NavLink>)}
    </>);

    return (


        <nav className="bg-white border-gray-200 dark:bg-gray-900 shadow-md">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto pb-1">
                <div className="flex flex-col rtl:space-x-reverse">
                    <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Torus Assignment</span>
                    <a className="text-gray-300" href="mailto:jigyashusaini7@gmail.com">Created by Jigyasu Saini</a>
                </div>
                {!user && <>
                    <button data-collapse-toggle="navbar-default" type="button"
                            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                            aria-controls="navbar-default" aria-expanded="false">
                        <span className="sr-only">Open main menu</span>
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                             viewBox="0 0 17 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M1 1h15M1 7h15M1 13h15"/>
                        </svg>
                    </button>
                    <div className="hidden w-full md:block md:w-auto" id="navbar-default">
                        <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                            <div className="dropdown dropdown-end flex gap-2 text-sm font-medium mr-2">
                                {links}
                            </div>
                        </ul>
                    </div>
                </>}
                {user && <div className="flex justify-center items-center align-middle gap-2">
                    <button className="btn" onClick={() => document.getElementById("createTaskModal").showModal()}>
                        Create Task
                    </button>
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full flex justify-center items-center align-middle">
                                <div className="bg-blue-500 w-full h-full text-2xl text-white">{user.name.split(' ').map(n => n[0].toUpperCase()).join('')}</div>
                            </div>
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                            <li><a onClick={handleLogout}>Logout</a></li>
                        </ul>
                    </div>
                </div>}
            </div>
        </nav>

    );
};

export default UserNavbar;
