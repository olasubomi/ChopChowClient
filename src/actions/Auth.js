import {
    INIT_URL,
    USER_DATA,
    USER_TOKEN_SET,
    USER_ROLE,
    CUSTOMER_ID,
    FETCH_START,
    FETCH_SUCCESS,
    FETCH_ERROR,
    SIGNOUT_USER_SUCCESS
} from "../constants/ActionTypes";
import axios from '../util/Api';

export const setInitUrl = (url) => {
    return {
        type: INIT_URL,
        payload: url
    };
};

export const userSignUp = ({ name, email, password }) => {
    console.log(name, email, password);
    return (dispatch) => {
        dispatch({ type: FETCH_START });
        axios.post('/register', {
            name: name,
            email: email,
            password: password
        }
        ).then(({ data }) => {
            console.log("__ SignUp api res __ : ", data);
            localStorage.setItem("token", JSON.stringify(data.token));
            axios.defaults.headers.common['Authorization'] = "Bearer " + data.token;
            dispatch({ type: FETCH_SUCCESS });
            dispatch({ type: USER_TOKEN_SET, payload: data.token });
            dispatch({ type: USER_ROLE, payload: data.role });
            // dispatch({ type: USER_DATA, payload: data.user });
            // dispatch({ type: CUSTOMER_ID, payload: data.customerID });
        }).catch(err => {
            console.error("xxx userSignUp Request ERROR xxx");
            console.log(err.response.status);
            if (err.response.status === 422) {
                dispatch({ type: FETCH_ERROR, payload: "Email address was already taken. If you are owner, please proceed to login with this email." });
            }
        });
    }
};

export const userSignIn = ({ email, password }) => {
    return (dispatch) => {
        dispatch({ type: FETCH_START });
        dispatch({ type: USER_TOKEN_SET, payload: null });
        dispatch({ type: USER_DATA, payload: null });
        axios.post('/login', {
            email: email,
            password: password,
        }
        ).then(({ data }) => {
            console.log(" ___ userSignIn RESPONSE ___ ", data);
            localStorage.setItem("userToken", data.token);
            localStorage.setItem("userRole", data.role);

            axios.defaults.headers.common['Authorization'] = "Bearer " + data.token;
            dispatch({ type: FETCH_SUCCESS });
            dispatch({ type: USER_TOKEN_SET, payload: data.token });
            dispatch({ type: USER_ROLE, payload: data.role });
            // dispatch({ type: USER_DATA, payload: data.username });
            // dispatch({ type: CUSTOMER_ID, payload: data.customerID });
            console.log(" ___ userSignIn customerID ", data.customerID);

        }).catch(err => {
            console.error("xxx userSignIn Request ERROR xxx", err);
            dispatch({ type: FETCH_ERROR, payload: "Error during user sign in request" });
        });
    }
};

export const getUser = () => {
    return (dispatch) => {
        dispatch({ type: FETCH_START });
        axios.get('/authenticate-app-page',
        ).then(({ data }) => {
            console.log(" ___ getUser RESPONSE ___ ", data);
            dispatch({ type: FETCH_SUCCESS });
            dispatch({ type: USER_DATA, payload: data.username });
            dispatch({ type: CUSTOMER_ID, payload: data.data });

        }).catch(err => {
            console.error("xxx getUser Request ERROR xxx", err);
            dispatch({ type: FETCH_ERROR, payload: "Error during get me request with this token" });
            dispatch({ type: SIGNOUT_USER_SUCCESS });
        });
    }
};

export const changePassword = (payload) => {
    return (dispatch) => {
        dispatch({ type: FETCH_START });
        axios.post('/change-password', payload).then(({ data }) => {
            console.log(" Change Password API RES ->> ", data);
            axios.defaults.headers.common['Authorization'] = "Bearer " + data.token;
            dispatch({ type: FETCH_SUCCESS, payload: "Password was changed successfully." });
            dispatch({ type: USER_TOKEN_SET, payload: data.token });
            dispatch({ type: USER_DATA, payload: data.user });
        }).catch(err => {
            console.error("xxx changePassword Request ERROR xxx", err.response);
            dispatch({ type: FETCH_ERROR, payload: "Password is not matched" });
        });
    }
};

export const cancelSubscription = () => {
    return (dispatch) => {
        dispatch({ type: FETCH_START });
        axios.get('/unsubscribe').then(({ data }) => {
            console.log(" Unsubscrieb API RES ->> ", data);
            axios.defaults.headers.common['Authorization'] = "Bearer " + data.token;
            dispatch({ type: FETCH_SUCCESS, payload: "Subscription was cancelled successfully." });
            dispatch({ type: USER_TOKEN_SET, payload: data.token });
            dispatch({ type: USER_DATA, payload: data.user });
        }).catch(err => {
            console.error("xxx cancel subscription Request ERROR xxx", err.response);
            dispatch({ type: FETCH_ERROR, payload: "Error during cancel subscription request." });
        });
    }
}
export const userSignOut = () => {
    return (dispatch) => {
        dispatch({ type: FETCH_START });
        axios.get('/logout',
        ).then(({ data }) => {
            localStorage.removeItem("token");
            dispatch({ type: FETCH_SUCCESS });
            dispatch({ type: SIGNOUT_USER_SUCCESS });
        }).catch(err => {
            console.error("xxx userSignOut Request ERROR xxx", err);
            dispatch({ type: FETCH_ERROR, payload: "Error during user sign out request" });
        });
    }
};

export const resendEmail = () => {
    return (dispatch) => {
        dispatch({ type: FETCH_START });
        axios.get('/email/resend')
            .then(({ data }) => {
                console.log(" resend email api success: ", data.message)
                dispatch({ type: FETCH_SUCCESS, payload: data.message });
            })
            .catch(err => {
                console.error("xxx resendEmail Request ERROR xxx", err);
                dispatch({ type: FETCH_ERROR, payload: "Error during request to resend email" });
            });
    }
}
