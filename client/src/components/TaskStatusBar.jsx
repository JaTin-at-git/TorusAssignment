import React, { useEffect, useState } from "react";

const TaskStatusBar = ({ status }) => {
    const [step, setStep] = useState(0);
    const [initialStep, setInitialStep] = useState(0);

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

    function handleStatusChange() {
        // leave this function as is
    }

    return (
        <div className="flex gap-6 my-8">
            <div className="max-w-[450px]">
                <input
                    id="status"
                    type="range"
                    min="0"
                    max="2"
                    value={step}
                    step="1"
                    onChange={handleSliderChange}
                    className="w-[400px] h-3 bg-gray-300 rounded-lg appearance-none cursor-pointer focus:outline-none"
                />
                <div className="flex justify-between mt-2 text-sm">
                    <span className={` ${step === 0 ? "text-green-600 font-bold" : "text-gray-400"}`}>ToDo</span>
                    <span className={` ${step === 1 ? "text-green-600 font-bold" : "text-gray-400"}`}>In Progress</span>
                    <span className={` ${step === 2 ? "text-green-600 font-bold" : "text-gray-400"}`}>Completed</span>
                </div>
            </div>

            {/* Conditionally render the button only if the status has changed */}
            {step !== initialStep && (
                <button onClick={handleStatusChange} className="btn btn-outline">
                    Change Status
                </button>
            )}
        </div>
    );
};

export default TaskStatusBar;
