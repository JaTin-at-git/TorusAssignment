import TaskStatusBar from "./TaskStatusBar.jsx";

function TaskTile({task, taskType}) {
    return <div className="overflow-hidden bg-white max-w-[90%] w-full relative p-4 rounded-lg shadow-sm hover:shadow-lg transition-all">
        <p className="badge text-white px-4 bg-red-700 top-4 right-4 absolute py-3">{new Date(task.dueDate).toLocaleDateString()}</p>
        <p className={`opacity-80 shadow-md p-2 w-12 h-12 absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-${task.priority === "low" ? "green-600" : task.priority === "medium" ? "yellow-300" : "red-700"}`}></p>
        <p className="font-medium py-1 text-xl">{task.title}</p>
        <div className="">
            <p className="text-gray-500 text-lg">{task.description}</p>
            <div className="flex gap-4 my-6">
                <p className="badge badge-outline badge-error badge-ghost p-3">Assigned
                    to: {task.assignedUser.email}</p>
                <p className="badge badge-outline badge-ghost p-3">Assigned by: {task.createdBy.email}</p>
                <p className="badge badge-outline badge-ghost p-3">Created
                    on: {new Date(task.createdAt).toLocaleDateString()}</p>
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