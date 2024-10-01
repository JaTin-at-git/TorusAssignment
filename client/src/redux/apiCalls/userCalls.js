import {request} from "../../requestMethods.js";
import {loginFailed, loginSuccess, logoutSuccess, resetAll, startFetch,} from "../userSlice.js";
import {toast} from "react-toastify";
import to from "await-to-js";

export const loginUser = async (dispatch, body) => {
    dispatch(resetAll());
    dispatch(startFetch());
    const id = toast.loading("Logging you in");
    try {
        // api call
        const [err, res] = await to(request.post("/user/login", body));
        if (err) {
            toast.update(id, {
                render: `${err.response.data.message || err.response.data || "Some error occurred please try again later"}`,
                type: "error",
                isLoading: false,
                autoClose: 2000,
            });
            return false;
        } else {
            // update state if login successfully
            dispatch(loginSuccess({user: res.data.data.user}));
            toast.update(id, {
                render: "Login success!",
                type: "success",
                isLoading: false,
                autoClose: 2000,
            });
        }
        return true;
    } catch (error) {
        dispatch(loginFailed(error?.response?.data?.message));
        toast.update(id, {
            render: error?.response?.data?.message,
            type: "error",
            isLoading: false,
            autoClose: 2000,
        });
        return false;
    }
};

export const signup = async (dispatch, formData) => {
    dispatch(resetAll());
    dispatch(startFetch());
    const id = toast.loading("Signing you in");

    const [err, response] = await to(request.post("/user/signup", formData));
    if (err || ((response.status / 100) | 0) !== 2) {
        const errorMessage =
            err.response?.data?.message ||
            err.response.data ||
            "Some error occurred! please try again later.";
        toast.update(id, {
            render: errorMessage,
            type: "error",
            isLoading: false,
            autoClose: 0,
        });
        return false;
    } else {
        console.log(response);
        console.log(response.data.data.user);
        dispatch(loginSuccess({user: response.data.data.user}));
        toast.update(id, {
            render: "Signup successful!",
            type: "success",
            isLoading: false,
            autoClose: 1000,
        });
        return true;
    }
};


export const logoutUser = async (dispatch) => {
    dispatch(startFetch());
    const id = toast.loading("Logging out!");
    try {
        const response = await request.post("/user/logout");
        if (((response.status / 100) | 0) !== 2) throw new Error();
        dispatch(logoutSuccess());
        toast.update(id, {
            render: "Logged out successfully!",
            type: "success",
            isLoading: false,
            autoClose: 2000,
        });
        return true;
    } catch (e) {
        const errorMessage =
            e.response?.data?.message ||
            "Some error occurred! please try again later.";
        dispatch(loginFailed(errorMessage));
        toast.update(id, {
            render: errorMessage,
            type: "error",
            isLoading: false,
            autoClose: 0,
        });
        return false;
    }
};

export const createTask = async (formData) => {
    const id = toast.loading("Creating task!");
    try {
        const response = await request.post("/user/createTask", formData);
        if (((response.status / 100) | 0) !== 2) throw new Error();
        toast.update(id, {
            render: "Task Created!",
            type: "success",
            isLoading: false,
            autoClose: 2000,
        });
        return response;
    } catch (e) {
        const errorMessage =
            e.response?.data?.message ||
            "Some error occurred! please try again later.";
        toast.update(id, {
            render: errorMessage,
            type: "error",
            isLoading: false,
            autoClose: 0,
        });
        throw new Error(errorMessage);
    }
};

export const updateTaskStatus = async (taskId, newStatus) => {
    try {
        const response = await request.post("/tasks/updateTaskStatus", {taskId, newStatus});
        if (((response.status / 100) | 0) !== 2) throw new Error();
        return response;
    } catch (e) {
        const errorMessage =
            e.response?.data?.message ||
            "Some error occurred! please try again later.";
        throw new Error(errorMessage);
    }
};