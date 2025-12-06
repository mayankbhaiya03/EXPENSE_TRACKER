import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Signup = () => {
    const { signup } = useAuth();
    const nav = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await signup({ name, email, password });
            toast.success("Account created!");
            nav("/");
        } catch (err) {
            toast.error(err.message || "Signup failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full">
                <h1 className="text-3xl font-bold text-center text-expense">EXPENSE TRACKER</h1>
                <p className="text-center text-gray-500 mb-6">Create your account</p>

                <form onSubmit={submit} className="space-y-4">
                    <input type="text" placeholder="Full Name" required className="w-full p-3 border rounded-md"
                        value={name} onChange={(e) => setName(e.target.value)} />
                    <input type="email" placeholder="Email" required className="w-full p-3 border rounded-md"
                        value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input type="password" placeholder="Password" required className="w-full p-3 border rounded-md"
                        value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button disabled={loading} className="w-full py-3 bg-expense text-white rounded-md hover:bg-expense-dark transition">
                        {loading ? "Creating..." : "Sign Up"}
                    </button>
                </form>

                <p className="text-center mt-4 text-sm">
                    Already have an account? <Link className="text-expense underline" to="/login">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
