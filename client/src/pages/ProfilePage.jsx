import React, {useEffect} from "react";
import {useSelector} from "react-redux";
import {useLoaderData, useNavigate} from "react-router-dom";
import CreateTaskModal from "../components/CreateTaskModal.jsx";
import {request} from "../requestMethods.js";
import TaskTile from "../components/TaskTile.jsx";

export async function getTasks({request: req}) {
    const url = new URL(req.url);
    const params = new URLSearchParams(url.search);

    // Extract query parameters with default values
    const taskType = params.get('taskType') || 'personal';
    const page = params.get('page') || 1;
    const limit = params.get('limit') || 10;
    const status = params.get('status') || '';
    const priority = params.get('priority') || '';
    const assignedUserEmail = params.get('assignedUserEmail') || '';

    // Construct backend API URL with all query parameters
    const apiUrl = `/tasks/getTasks?taskType=${taskType}&page=${page}&limit=${limit}&status=${status}&priority=${priority}&assignedUserEmail=${assignedUserEmail}`;
    return await request.post(apiUrl);
}

const ProfilePage = () => {

    const tasks = useLoaderData().data?.data?.tasks;
    console.log(tasks);

    let user = useSelector((state) => state.persistedReducer.user.user);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user)
            navigate("/login", {replace: true});
    }, [user]);


    console.log(tasks[0]);

    return (
        <div className="relative flex justify-center items-center align-middle">
            <div className="max-w-[1400px] w-full p-5 rounded-lg bg-gray-50 shadow-sm">

                <button className="btn"
                        onClick={() => document.getElementById("createTaskModal").showModal()}>Create Task
                </button>

                <div>
                    <div className="flex gap-4 flex-wrap my-2">
                        <button className="p-2 px-4 border-0 border-b-2 border-b-black rounded-sm">Personal Tasks</button>
                        <button className="p-2 px-4 border-0 border-b-2 border-b-black rounded-sm">Assigned Tasks</button>
                        <button className="p-2 px-4 border-0 border-b-2 border-b-black rounded-sm">Assigned To Other</button>
                    </div>
                    <div>
                        <div>Filters</div>
                        <div className="flex flex-col gap-2 w-full justify-center items-center gap-6">
                            {tasks.map(t=><TaskTile id={t.id} task={t}/>)}
                        </div>
                    </div>
                </div>



            </div>

            <CreateTaskModal id="createTaskModal"/>

        </div>
    );
};

export default ProfilePage;
