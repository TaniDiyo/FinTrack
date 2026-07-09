import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import { loginStyles } from "../assets/dummyStyles";

const Login = ({ onLogin, API_URL = "http://localhost:5000/api" }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    //to fetch profile
    const fetchProfile = async (token) => {
        if (!token) return null;
        const res = await axios.get(`${API_URL}/api/user/me`, {
            headers: { Authotization: `Bearer ${token}` },
        });
        return res.data;
    };

    const persistAuth = (profile, token, rememberMe) => {
        const storage = rememberMe
            ? localStorage
            : sessionStorage;

        try {
            if (token) {
                storage.setItem("token", token);
            }

            if (profile) {
                storage.setItem(
                    "user",
                    JSON.stringify(profile)
                );
            }
        } catch (err) {
            console.error("Storage Error:", err);
        }
    };

    //to login
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await axios.post(
                `${API_URL}/api/user/login`,
                { email, password },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = res.data || {};
            const token = data.token || null;

            //to derive user profile
            let profile = data.user ?? null;
            if (!profile) {
                const copy = { ...data };
                delete copy.token;
                delete copy.user;

                if (Object.keys(copy).length) {
                    profile = copy;
                }
            }

            if (!profile && token) {
                try {
                    profile = await fetchProfile(token);
                } catch (fetchErr) {
                    console.warn("Could not fetch profile after login token:", fetchErr);
                    profile = { email };
                }
            }

            if (!profile) profile = { email };
            persistAuth(profile, token);
            if (typeof onLogin === "function") {
                try {
                    onLogin(profile, rememberMe, token);
                }
                catch (callErr) {
                    console.warn("onLogin threw:", callErr);
                    navigate("/");
                }
                setPassword("");
            }
        } catch (err) {
            console.error("Login error:", err?.response || err);
            const serverMsg =
                err.response?.data?.message ||
                (err.response?.data
                    ? JSON.stringify(err.response.data)
                    : err.message) ||
                "Login failed";
            setError(serverMsg);
        } finally {
            setIsLoading(false);
         }
    };



    return (
        <div className={loginStyles.pageContainer}>
            <div className={loginStyles.cardContainer}>
                <div className={loginStyles.header}>
                    <div className={loginStyles.avatar}>
                        <User className="w-10 h-10 text-white" />
                    </div>

                    <h1 className={loginStyles.headerTitle}>
                        Welcome Back
                    </h1>

                    <p className={loginStyles.headerSubtitle}>
                        Sign in to your Expense Tracker account
                    </p>
                </div>

                <div className="loginStyels.formContainer">
                   {error && (
            <div className={loginStyles.errorContainer}>
              <div className={loginStyles.errorIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className={loginStyles.errorText}>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
                <label htmlFor="email" className={loginStyels.label}></label>
            </div>
          </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
