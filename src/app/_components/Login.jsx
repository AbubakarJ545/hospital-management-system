import React, { useState } from "react";
import AdminDashboard from "./AdminDashboard";

export default function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [isLogin, setIsLogin] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.username === "admin" && formData.password === "admin123") {
      setIsLogin(true);
    } else {
      setError("Invalid username or password");
    }
  };
  if (isLogin) {
    return <AdminDashboard />;
  }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="flex bg-white shadow-lg rounded-2xl overflow-hidden w-full max-w-4xl">
        {/* Left Side - Login Form */}
        <div className="w-1/2 flex flex-col justify-center items-center p-8">
          <h1 className="text-3xl font-bold text-blue-600 mb-4">
            Jamal Hospital
          </h1>
          <div className="w-full max-w-sm">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
              Admin Login
            </h2>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter admin username"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-200"
              >
                Login
              </button>
            </form>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="w-1/2">
          <img
            src="/hospital.jpg"
            alt="Hospital"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
