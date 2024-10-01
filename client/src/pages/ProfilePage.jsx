import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLoaderData, useNavigate } from "react-router-dom";
import CreateTaskModal from "../components/CreateTaskModal.jsx";
import { request } from "../requestMethods.js";
import TaskTile from "../components/TaskTile.jsx";
import {GrNext, GrPrevious} from "react-icons/gr";

export async function getTasks({ request: req }) {
    const url = new URL(req.url);
    const params = new URLSearchParams(url.search);

    // Extract query parameters with default values
    const taskType = params.get('taskType') || 'personal';
    const page = params.get('page') || 1;
    const limit = params.get('limit') || 2;
    const status = params.get('status') || '';
    const priority = params.get('priority') || '';
    const assignedUserEmail = params.get('assignedUserEmail') || '';

    // Construct backend API URL with all query parameters
    const apiUrl = `/tasks/getTasks?taskType=${taskType}&page=${page}&limit=${limit}&status=${status}&priority=${priority}&assignedUserEmail=${assignedUserEmail}`;
    return await request.post(apiUrl);
}

const ProfilePage = () => {
    const { tasks, currentPageNumber, maximumPages } = useLoaderData().data?.data || {};
    const [currentPage, setCurrentPage] = useState(currentPageNumber || 1);
    const [taskType, setTaskType] = useState('personal'); // Default task type
    const [status, setStatus] = useState(''); // Status filter
    const [priority, setPriority] = useState(''); // Priority filter
    const [taskData, setTaskData] = useState(tasks || []); // Local state for tasks
    const [isAdmin, setIsAdmin] = useState(false); // State for admin status
    let user = useSelector((state) => state.persistedReducer.user.user);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/login", { replace: true });
        }
    }, [user]);

    // Function to check if user is an admin
    const checkAdminStatus = async () => {
        try {
            const response = await request.get("/user/isAdmin");
            if (response.data.isAdmin) {
                setIsAdmin(true);
            }
        } catch (error) {
            console.error("Error checking admin status:", error);
        }
    };

    // Fetch admin status on component mount
    useEffect(() => {
        checkAdminStatus();
    }, []);

    // Function to fetch tasks with current filters
    const fetchTasks = (newPage = currentPage) => {
        const newUrl = `/?taskType=${taskType}&page=${newPage}&status=${status}&priority=${priority}`;
        navigate(newUrl, {replace: true});
    };

    // Update task data when loader data changes
    useEffect(() => {
        setTaskData(tasks);
    }, [tasks]);

    // Fetch tasks when any filter or task type changes
    useEffect(() => {
        fetchTasks(1); // Fetch tasks on filter changes and reset to the first page
    }, [taskType, status, priority]);

    const handleTaskTypeChange = (newTaskType) => {
        setTaskType(newTaskType);
        setStatus(''); // Reset status filter
        setPriority(''); // Reset priority filter
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        fetchTasks(pageNumber);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        if (name === "status") {
            setStatus(value);
        } else if (name === "priority") {
            setPriority(value);
        }
    };

    return (
        <div className="relative flex justify-center items-center align-middle">
            <div className="max-w-[1400px] w-full p-5 rounded-lg bg-gray-50 shadow-sm">

                <div className="flex gap-4 flex-wrap my-2">
                    <button className={`p-2 px-4 border-0 rounded-sm ${taskType === 'personal' ? 'border-b-2 border-b-black' : ''}`}
                            onClick={() => handleTaskTypeChange('personal')}>
                        Personal Tasks
                    </button>
                    <button className={`p-2 px-4 border-0 rounded-sm ${taskType === 'assigned' ? 'border-b-2 border-b-black' : ''}`}
                            onClick={() => handleTaskTypeChange('assigned')}>
                        Assigned Tasks
                    </button>
                    {isAdmin && (
                        <button className={`p-2 px-4 border-0 rounded-sm ${taskType === 'assignedToOthers' ? 'border-b-2 border-b-black' : ''}`}
                                onClick={() => handleTaskTypeChange('assignedToOthers')}>
                            Assigned To Other
                        </button>
                    )}
                </div>

                {/* Filter Bar */}
                <div className="flex flex-col gap-4 mb-4">
                    <div className="flex gap-4">
                        <select name="status" value={status} onChange={handleFilterChange} className="p-2 border border-gray-300 rounded">
                            <option value="">Select Status</option>
                            <option value="ToDo">To Do</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                        </select>

                        <select name="priority" value={priority} onChange={handleFilterChange} className="p-2 border border-gray-300 rounded">
                            <option value="">Select Priority</option>
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                        </select>
                    </div>
                </div>

                <div>
                    <div className="flex flex-col w-full justify-center items-center gap-6">
                        {taskData && taskData.map(t => <TaskTile key={t._id} taskType={taskType} task={t} />)}
                    </div>
                </div>

                {/* Pagination Controls */}
                <div className="flex justify-center items-center align-middle mt-4">
                    {currentPage > 1 && (
                        <button className="p-2 hover:bg-gray-100" onClick={() => handlePageChange(currentPage - 1)}>
                            <GrPrevious/>
                        </button>
                    )}
                    <span className="mx-2">Page {currentPage} of {maximumPages}</span>
                    {currentPage < maximumPages && (
                        <button className="p-2 hover:bg-gray-100" onClick={() => handlePageChange(currentPage + 1)}>
                            <GrNext/>
                        </button>
                    )}
                </div>
            </div>

            <CreateTaskModal id="createTaskModal" />
        </div>
    );
};

export default ProfilePage;
