import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import TextInput from "../components/common/TextInput";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, selectAuth } from "../store/slices/authSlice";
import Button from "../components/common/Button";

export default function Login() {
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: location.state?.email || "",
    password: "",
  });
  const [statusMessage, setStatusMessage] = useState({
    type: location.state?.message ? "success" : "",
    text: location.state?.message || "",
  });
  const { isLoading, isError, isSuccess, message } = useSelector(selectAuth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (location.state?.email) {
      setFormData((prev) => ({ ...prev, email: location.state.email }));
    }
    if (location.state?.message) {
      setStatusMessage({ type: "success", text: location.state.message });
    }
  }, [location.state]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (statusMessage.text) setStatusMessage({ type: "", text: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email.trim() || !formData.password.trim()) {
      setStatusMessage({
        type: "error",
        text: "Please enter both email and password.",
      });
      return;
    }

    console.log("formData", formData);

    try {
      const response = await dispatch(loginUser(formData)).unwrap();
      console.log("login page", response);
      if (response?.statusCode === 200) {
        setFormData({
          email: "",
          password: "",
        });
        navigate("/");
      }
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      <div className="w-full max-w-md p-8 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Welcome Back</h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Sign in with your email and password
          </p>
        </div>

        {(isError || isSuccess) && (
          <div
            className={`p-3 rounded-xl text-xs font-semibold ${
              isError
                ? "bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30"
                : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
            }`}
          >
            {message}
          </div>
        )}

        {statusMessage.text && (
          <div
            className={`p-3 rounded-xl text-xs font-semibold ${
              statusMessage.type === "error"
                ? "bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30"
                : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
            }`}
          >
            {statusMessage.text}
          </div>
        )}

        <form className="space-y-4" noValidate onSubmit={handleSubmit}>
          <TextInput
            label="Email Address"
            id="login-email"
            name="email"
            type="email"
            placeholder="name@example.com"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            required
          />

          <TextInput
            label="Password"
            id="login-password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            autoComplete="current-password"
            required
          />

          <Button type="submit" variant="primary" fullWidth loading={isLoading}>
            Log In
          </Button>

          {/* Demo test account fill buttons */}
          <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-dashed border-neutral-300 dark:border-neutral-700/80 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              <span>Demo Test Accounts:</span>
              <span className="text-[10px] text-neutral-400">1-click fill</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() =>
                  setFormData({ email: "admin@crm.com", password: "admin" })
                }
                className="py-1.5 px-3 text-xs font-semibold rounded-lg bg-purple-500/15 text-purple-600 dark:text-purple-300 border border-purple-500/30 hover:bg-purple-500/25 transition-colors"
              >
                👑 Fill Admin
              </button>
              <button
                type="button"
                onClick={() =>
                  setFormData({ email: "user@crm.com", password: "user" })
                }
                className="py-1.5 px-3 text-xs font-semibold rounded-lg bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors"
              >
                👤 Fill User
              </button>
            </div>
          </div>
        </form>

        <div className="text-center text-xs text-neutral-500 pt-2 border-t border-neutral-200 dark:border-neutral-800">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
