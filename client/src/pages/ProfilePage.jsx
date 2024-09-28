import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {setLoginRedirect} from "../redux/auxiliarySlice.js";


const ProfilePage = () => {

    let user = useSelector((state) => state.persistedReducer.user.user);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user)
            navigate("/login", {replace: true});
    }, [user]);



    return (
        <div className="flex justify-center items-center align-middle">
            <div className="max-w-[1400px] w-full p-5 rounded-lg bg-green-200">
                <div>

                    <button className="btn" onClick={()=>document.getElementById("createTaskModal").showModal()}>open modal</button>

                </div>
            </div>

            <dialog id="createTaskModal" className="modal">
                <div className="modal-box">
                    <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <h3 className="font-bold text-lg">Hello!</h3>
                    <p className="py-4">Press ESC key or click on ✕ button to close</p>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </div>
    );
};

export default ProfilePage;
