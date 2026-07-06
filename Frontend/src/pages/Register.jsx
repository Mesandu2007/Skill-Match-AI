import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { Footer } from "../components/Footer";
import { registerUser } from "../services/api";

export const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();
  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [errors, setErrors] =
    useState({});

  const [loading, setLoading] =
    useState(false);

  const [apiError, setApiError] =
    useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });
  };

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name =
        "Name is required";
    }

    if (!form.email.trim()) {
      newErrors.email =
        "Email is required";
    }

    if (!form.password.trim()) {
      newErrors.password =
        "Password is required";
    }

    if (
      form.password.length < 6
    ) {
      newErrors.password =
        "Password must be at least 6 characters";
    }

    if (
      !form.confirmPassword.trim()
    ) {
      newErrors.confirmPassword =
        "Confirm your password";
    }

    if (
      form.password !==
      form.confirmPassword
    ) {
      newErrors.confirmPassword =
        "Passwords do not match";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    const validationErrors =
      validate();

    if (
      Object.keys(
        validationErrors
      ).length > 0
    ) {
      setErrors(
        validationErrors
      );
      return;
    }

    setErrors({});
    setLoading(true);
    
    try {
      const res = await registerUser(form);

      localStorage.setItem(
        "token",
        res.data.token
      );

      navigate("/dashboard");
    } catch (error) {
      setApiError(
        error.response?.data?.message ||
          "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md bg-gray-900 p-8 rounded-2xl border border-gray-800 shadow-xl">
          <h1 className="text-3xl font-bold text-white text-center mb-8">
            Register
          </h1>

          <form
            onSubmit={
              handleSubmit
            }
            className="space-y-5"
          >
            
            <div>
              <label className="text-gray-300">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={
                  handleChange
                }
                placeholder="Enter your name"
                className="w-full mt-2 p-3 rounded-lg bg-gray-800 text-white border border-gray-700 outline-none focus:border-blue-500"
              />

              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {
                    errors.name
                  }
                </p>
              )}
            </div>

            {apiError && (
              <p className="text-red-500 text-sm mt-1">
                {apiError}
              </p>
            )}

            
            <div>
              <label className="text-gray-300">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={
                  handleChange
                }
                placeholder="Enter your email"
                className="w-full mt-2 p-3 rounded-lg bg-gray-800 text-white border border-gray-700 outline-none focus:border-blue-500"
              />

              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {
                    errors.email
                  }
                </p>
              )}
            </div>

            
            <div>
              <label className="text-gray-300">
                Password
              </label>

              <div className="relative mt-2">
                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  value={
                    form.password
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Enter password"
                  className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 outline-none focus:border-blue-500"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? (
                    <FaEyeSlash />
                  ) : (
                    <FaEye />
                  )}
                </button>
              </div>

              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {
                    errors.password
                  }
                </p>
              )}
            </div>

            
            <div>
              <label className="text-gray-300">
                Confirm Password
              </label>

              <div className="relative mt-2">
                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  name="confirmPassword"
                  value={
                    form.confirmPassword
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Confirm password"
                  className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 outline-none focus:border-blue-500"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash />
                  ) : (
                    <FaEye />
                  )}
                </button>
              </div>

              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {
                    errors.confirmPassword
                  }
                </p>
              )}
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 transition py-3 rounded-lg text-white font-semibold disabled:bg-blue-800 disabled:cursor-not-allowed"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <p className="text-gray-400 text-center mt-6">
            Already have an
            account?{" "}
            <Link
              to="/login"
              className="text-blue-500 hover:text-blue-400"
            >
              Login
            </Link>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};