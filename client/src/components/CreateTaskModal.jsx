import React, {useEffect, useState} from 'react';
import {request} from "../requestMethods.js";
import to from 'await-to-js';
import {createTask} from "../redux/apiCalls/userCalls.js";

function CreateTaskModal({id}) {
    const [isAdmin, setIsAdmin] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [errorMessagePersonal, setErrorMessagePersonal] = useState("");
    const [errorMessageAssignToOther, setErrorMessageAssignToOther] = useState("");
    const [personalTask, setPersonalTask] = useState({
        title: 'Some Personal Task Dummy 1',
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores corporis eaque fugiat inventore labore laudantium libero!',
        dueDate: '',
        priority: 'low', // Default priority
        type: 'personal'
    });
    const [assignedTask, setAssignedTask] = useState({
        title: '',
        description: '',
        dueDate: '',
        assignedUserEmail: '',
        priority: 'low',
        type: 'assignToOther'
    });
    const [showPersonalTaskSection, setShowPersonalTaskSection] = useState(true); // Default to show personal task section
    const [showAssignTaskSection, setShowAssignTaskSection] = useState(false); // Assigned task section is hidden by default

    // Fetch user admin status
    useEffect(() => {
        const fetchAdminStatus = async () => {
            try {
                const response = await request.get('/user/isAdmin');
                setIsAdmin(response.data.isAdmin);
            } catch (error) {
                console.error('Error fetching admin status:', error);
            }
        };
        fetchAdminStatus();
    }, []);

    const handlePersonalTaskSubmit = async (e) => {
        e.preventDefault();
        setDisabled(true);
        setErrorMessagePersonal("");

        const [err, res] = await to(createTask(personalTask));
        if (res) {
            closeModal();
            resetPersonalTaskForm();
        }else{
            setErrorMessagePersonal(err.message);
        }

        setDisabled(false);
    };

    const handleAssignedTaskSubmit = async (e) => {
        e.preventDefault();
        setDisabled(true);
        setErrorMessageAssignToOther("");

        const [err, res] = await to(createTask(assignedTask));
        if (res) {
            closeModal();
            resetAssignedTaskForm();
        }else{
            setErrorMessageAssignToOther(err.message);
        }

        setDisabled(false);
    };

    const resetPersonalTaskForm = () => {
        setPersonalTask({
            title: '',
            description: '',
            dueDate: '',
            priority: 'low',
            type: 'personal'
        });
    };

    const resetAssignedTaskForm = () => {
        setAssignedTask({
            title: '',
            description: '',
            dueDate: '',
            assignedUserEmail: '',
            priority: 'low',
            type: 'assignToOther'
        });
    };

    // Function to close modal
    const closeModal = () => {
        const modal = document.getElementById(id);
        modal.close();
    };

    return (
        <dialog id={id} className="modal">
            <div className="modal-box p-6 rounded-lg shadow-lg bg-white relative">
                {/* Close button (X) */}
                <button
                    onClick={closeModal}
                    className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                >
                    ✕
                </button>

                <h2 className="text-xl font-bold mb-4">Create a New Task</h2>

                {/* Toggle Buttons */}
                <div className="flex justify-start gap-3 mb-4">
                    <button
                        className={`p-2 bg-gray-100 ${showPersonalTaskSection ? 'border-0 rounded-none rounded-t-md border-b-2 border-black' : ""}`}
                        onClick={() => {
                            setShowPersonalTaskSection(true);
                            setShowAssignTaskSection(false);
                        }}
                    >
                        Create Personal Task
                    </button>
                    {isAdmin && (
                        <button
                            className={`p-2 bg-gray-100 ${showPersonalTaskSection ? '' : 'border-0 rounded-none rounded-t-md border-b-2 border-black'}`}

                            onClick={() => {
                                setShowPersonalTaskSection(false);
                                setShowAssignTaskSection(true);
                            }}
                        >
                            Assign Task to Other User
                        </button>
                    )}
                </div>

                {/* Personal Task Creation Section */}
                {showPersonalTaskSection && (
                    <form onSubmit={handlePersonalTaskSubmit} className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">Create Personal Task</h3>
                        <label htmlFor="personalTitle" className="block mb-1">Title:</label>
                        <input
                            type="text"
                            id="personalTitle"
                            className="input input-bordered w-full mb-3"
                            value={personalTask.title}
                            onChange={(e) => setPersonalTask({...personalTask, title: e.target.value})}
                            required
                        />

                        <label htmlFor="personalDescription" className="block mb-1">Description:</label>
                        <textarea
                            id="personalDescription"
                            className="textarea textarea-bordered w-full mb-3"
                            value={personalTask.description}
                            onChange={(e) => setPersonalTask({...personalTask, description: e.target.value})}
                            required
                        />

                        <label htmlFor="personalDueDate" className="block mb-1">Due Date:</label>
                        <input
                            type="date"
                            min={new Date().toISOString().split("T")[0]} // Set min to today's date
                            id="personalDueDate"
                            className="input input-bordered w-full mb-3"
                            value={personalTask.dueDate}
                            onChange={(e) => setPersonalTask({...personalTask, dueDate: e.target.value})}
                            required
                        />

                        <label htmlFor="personalPriority" className="block mb-1">Priority:</label>
                        <select
                            id="personalPriority"
                            className="select select-bordered w-full mb-4"
                            value={personalTask.priority}
                            onChange={(e) => setPersonalTask({...personalTask, priority: e.target.value})}
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                        <p className="text-red-700 font-medium p-3 mb-2">{errorMessagePersonal}</p>
                        <button type="submit" disabled={disabled} className="btn w-full">Create Personal Task</button>
                    </form>
                )}

                {/* Assigned Task Creation Section */}
                {showAssignTaskSection && (
                    <form onSubmit={handleAssignedTaskSubmit} className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">Assign Task to Another User</h3>
                        <label htmlFor="assignedTitle" className="block mb-1">Title:</label>
                        <input
                            type="text"
                            id="assignedTitle"
                            className="input input-bordered w-full mb-3"
                            value={assignedTask.title}
                            onChange={(e) => setAssignedTask({...assignedTask, title: e.target.value})}
                            required
                        />

                        <label htmlFor="assignedDescription" className="block mb-1">Description:</label>
                        <textarea
                            id="assignedDescription"
                            className="textarea textarea-bordered w-full mb-3"
                            value={assignedTask.description}
                            onChange={(e) => setAssignedTask({...assignedTask, description: e.target.value})}
                            required
                        />

                        <label htmlFor="assignedDueDate" className="block mb-1">Due Date:</label>
                        <input
                            type="date"
                            min={new Date().toISOString().split("T")[0]} // Set min to today's date
                            id="assignedDueDate"
                            className="input input-bordered w-full mb-3"
                            value={assignedTask.dueDate}
                            onChange={(e) => setAssignedTask({...assignedTask, dueDate: e.target.value})}
                            required
                        />

                        <label htmlFor="assignedUserEmail" className="block mb-1">Assigned User Email:</label>
                        <input
                            type="email"
                            id="assignedUserEmail"
                            className="input input-bordered w-full mb-3"
                            value={assignedTask.assignedUserEmail}
                            onChange={(e) => setAssignedTask({...assignedTask, assignedUserEmail: e.target.value})}
                            required
                        />

                        <label htmlFor="assignedPriority" className="block mb-1">Priority:</label>
                        <select
                            id="assignedPriority"
                            className="select select-bordered w-full mb-4"
                            value={assignedTask.priority}
                            onChange={(e) => setAssignedTask({...assignedTask, priority: e.target.value})}
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>

                        <p className="text-red-700 font-medium p-3 mb-2">{errorMessageAssignToOther}</p>
                        <button type="submit" disabled={disabled} className="btn w-full">Create Assigned Task</button>
                    </form>
                )}
            </div>
            <form method="dialog" onClick={closeModal} className="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>
    );
}

export default CreateTaskModal;
