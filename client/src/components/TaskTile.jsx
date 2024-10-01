import TaskStatusBar from "./TaskStatusBar.jsx";
import {CiSettings} from "react-icons/ci";
import to from "await-to-js";
import {request} from "../requestMethods.js";
import {deleteTask} from "../redux/apiCalls/userCalls.js";
import {useState} from "react";

function TaskTile({task, taskType}) {

    const [displayNone, setDisplayNone] = useState(false);

    async function handleDelete() {
        const [err, res] = await to(deleteTask(task._id));
        if(res) setDisplayNone(true);
    }

    return <div className={`overflow-hidden bg-white max-w-[90%] w-full relative p-4 rounded-lg shadow-sm hover:shadow-lg transition-all ${displayNone?"hidden":""}`}>
        <p className={`opacity-80 shadow-md p-2 w-12 h-12 absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 rotate-45 ${task.priority === "low" ? "bg-green-600" : task.priority === "medium" ? "bg-yellow-300" : "bg-red-700"}`}></p>
        <div className="dropdown dropdown-end absolute top-4 right-4">
            <div tabIndex={0} role="button" className=""><CiSettings size={24} /></div>
            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow-md">
                <li onClick={handleDelete} className="cursor-pointer text-red-700 text-lg">Delete Task</li>
            </ul>
        </div>
        <p className="font-medium py-1 text-xl">{task.title}</p>
        <div className="">
            <p className="text-gray-500 text-lg">{task.description}</p>
            <div className="flex gap-4 my-6 flex-wrap">
                {taskType === "assignedToOthers" && <p className="h-fit badge badge-outline badge-error badge-ghost p-1 ">Assigned
                    to: {task.assignedUser.email}</p>}
                {taskType === "assigned" && <p className="badge badge-outline badge-ghost p-3">Assigned by: {task.createdBy.email}</p>}
                <p className="badge badge-outline badge-ghost p-3 text-nowrap">Created
                    on: {new Date(task.createdAt).toLocaleDateString()}</p>
                <p className={`badge text-white px-4 top-4 right-4 -translate-x-1/3 md:absolute py-3 ${task.status==='Completed'?'bg-green-700 line-through':'bg-red-700'} `}>Due: {new Date(task.dueDate).toLocaleDateString()}</p>
            </div>
            <TaskStatusBar taskType={taskType} taskId={task._id} status={task.status}/>
        </div>
    </div>;
}

export default TaskTile;

//{
//     "_id": "66f8f66f94a5cc8547e796d1",
//     "title": "Some Personal Task Dummy 1",
//     "description": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores corporis eaque fugiat inventore labore laudantium libero!",
//     "dueDate": "2024-09-27T00:00:00.000Z",
//     "status": "Completed",
//     "assignedUser": {
//         "_id": "66f7f09ba1ad48b79712ab5b",
//         "email": "admin@gmail.com",
//         "name": "JaTin"
//     },
//     "createdBy": {
//         "_id": "66f7f09ba1ad48b79712ab5b",
//         "email": "admin@gmail.com",
//         "name": "JaTin"
//     },
//     "priority": "low",
//     "createdAt": "2024-09-29T06:40:47.068Z",
//     "updatedAt": "2024-09-29T06:40:47.068Z",
//     "__v": 0
// }