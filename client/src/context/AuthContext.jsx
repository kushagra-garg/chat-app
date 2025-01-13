import { createContext, useCallback, useEffect, useState } from "react";
import { baseUrl, postRequest } from "../utils/services";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [registerError, setRegisterError] = useState(null);
    const [isRegisterLoading, setIsRegisterLoading] = useState(false);
    const [registerInfo, setRegisterInfo] = useState({
        name: "",
        email: "",
        password: ""
    });
    const [loginInfo, setloginInfo] = useState({
        email: "",
        password: ""
    });
    const [loginError, setloginError] = useState(null);
    const [isLoginLoading, setIsLoginLoading] = useState(false);


    console.log("user", user)
    //console.log("register info", registerInfo)
    console.log("login info", loginInfo)

    useEffect(() => {
        const user = localStorage.getItem("User");
        setUser(JSON.parse(user));
    }, []);

    const updateRegisterInfo = useCallback((info) => {
        setRegisterInfo(info);
    }, []);

    const registerUser = useCallback(async (e) => {
        e.preventDefault();
        setIsRegisterLoading(true);
        setRegisterError(null);
        const response = await postRequest(`${baseUrl}/users/register`, JSON.stringify(registerInfo));
        setIsRegisterLoading(false);
        if (response.error) {
            return setRegisterError(response);
        }
        localStorage.setItem("User", JSON.stringify(response));
        setUser(response);
    }, [registerInfo]);

    const loginUser = useCallback(async (e) => {
        e.preventDefault();
        setIsLoginLoading(true);
        setloginError(null);
        const response = await postRequest(`${baseUrl}/users/login`, JSON.stringify(loginInfo));
        setIsLoginLoading(false);
        if (response.error) {
            return setloginError(response);
        }
        localStorage.setItem("User", JSON.stringify(response));
        setUser(response);
    }, [loginInfo])

    const updateLoginInfo = useCallback((info) => {
        setloginInfo(info);
    }, [loginInfo]);

    const logoutUser = useCallback(() => {
        localStorage.removeItem("User");
        setUser(null);
    })

    return (<AuthContext.Provider value={{
        user, registerInfo, updateRegisterInfo, registerUser, registerError, isRegisterLoading, logoutUser,
        loginUser, updateLoginInfo, loginInfo, loginError, isLoginLoading
    }}>
        {children}
    </AuthContext.Provider>
    )
};