import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {setLoginRedirect} from "../redux/auxiliarySlice.js";
import CreateTaskModal from "../components/CreateTaskModal.jsx";


const ProfilePage = () => {

    let user = useSelector((state) => state.persistedReducer.user.user);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user)
            navigate("/login", {replace: true});
    }, [user]);



    return (
        <div className="relative flex justify-center items-center align-middle">
            <div className="max-w-[1400px] w-full p-5 rounded-lg bg-green-200">
                <div>

                    <button className="btn" onClick={()=>document.getElementById("createTaskModal").showModal()}>Create Task</button>

                </div>
            </div>

                <CreateTaskModal id="createTaskModal"/>

        </div>
    );
};

export default ProfilePage;
