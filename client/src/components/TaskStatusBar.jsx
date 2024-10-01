import React, {useEffect, useState} from "react";
import {updateTaskStatus} from "../redux/apiCalls/userCalls.js";
import {toast} from "react-toastify";
import to from "await-to-js";

const TaskStatusBar = ({status, taskId, taskType}) => {
    const changeAble = taskType!=="assignedToOthers";
    const [step, setStep] = useState(0);
    const [initialStep, setInitialStep] = useState(0);
    const [errorMessage, setErrorMessage] = useState("");

    const handleSliderChange = (e) => {
        setStep(parseInt(e.target.value));
    };

    useEffect(() => {
        if (status === "In Progress") {
            setStep(1);
            setInitialStep(1);
        } else if (status === "Completed") {
            setStep(2);
            setInitialStep(2);
        } else {
            setStep(0);
            setInitialStep(0);
        }
    }, [status]);

    async function handleStatusChange() {
        setErrorMessage("");
        const [err, res] = await to(updateTaskStatus(taskId, step === 0 ? "ToDo" : step === 1 ? "In Progress" : "Completed"));
        if (err) setErrorMessage(err.message);
        else {
            setInitialStep(step);
            toast("Status Changed", {type: "success"})
        }
    }

    return (
        <div className="flex md:gap-6 my-8 flex-wrap">
            <div className="w-[450px] max-w-full">
                <input
                    disabled={!changeAble}
                    id="status"
                    type="range"
                    min="0"
                    max="2"
                    value={step}
                    step="1"
                    onChange={handleSliderChange}
                    className="w-[400px] max-w-full h-3 bg-gray-300 rounded-lg appearance-none cursor-pointer focus:outline-none"
                />
                <div className="flex justify-between mt-2 text-sm">
                    <span className={` ${step === 0 ? "text-green-600 font-bold" : "text-gray-400"}`}>ToDo</span>
                    <span className={` ${step === 1 ? "text-green-600 font-bold" : "text-gray-400"}`}>In Progress</span>
                    <span className={` ${step === 2 ? "text-green-600 font-bold" : "text-gray-400"}`}>Completed</span>
                </div>
            </div>

            {/* Conditionally render the button only if the status has changed */}
            {changeAble && step !== initialStep && (
                <div className="flex flex-col items-start">
                    <p className="text-red-700 p-3 font-medium">{errorMessage}</p>
                    <button onClick={handleStatusChange} className="btn btn-outline">
                        Change Status
                    </button>
                </div>
            )}
        </div>
    );
};

export default TaskStatusBar;
