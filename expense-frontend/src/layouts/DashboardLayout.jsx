import React from "react";
import { useAuth } from "../context/AuthContext";

const DashboardLayout = ({ children }) => {
    const { logout, user } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-expense">EXPENSE TRACKER</h1>
                            {user && (
                                <p className="text-gray-500">
                                    Welcome, <span className="font-medium text-expense-dark">{user.name}</span>
                                </p>
                            )}
                        </div>

                        <button
                            onClick={logout}
                            className="px-4 py-2 bg-expense text-white rounded-md hover:bg-expense-dark transition"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>

            <footer className="bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <p className="text-center text-gray-500 text-sm">
                        Expense Tracker &copy; {new Date().getFullYear()}
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default DashboardLayout;
