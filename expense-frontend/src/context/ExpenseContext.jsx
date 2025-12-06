import React, { createContext, useContext, useEffect, useReducer } from "react";
import { apiFetch } from "../utils/api.js";
import { useAuth } from "./AuthContext.jsx";

const ExpenseContext = createContext();

const initialState = { expenses: [], loading: false, error: null };

const expenseReducer = (state, action) => {
    switch (action.type) {
        case "SET_EXPENSES": return { ...state, expenses: action.payload, loading: false };
        case "ADD_EXPENSE": return { ...state, expenses: [...state.expenses, action.payload] };
        case "DELETE_EXPENSE": return { ...state, expenses: state.expenses.filter(e => e.id !== action.payload) };
        case "UPDATE_EXPENSE": return { ...state, expenses: state.expenses.map(e => e.id === action.payload.id ? action.payload : e) };
        case "SET_LOADING": return { ...state, loading: action.payload };
        case "SET_ERROR": return { ...state, error: action.payload, loading: false };
        default: return state;
    }
};

export const ExpenseProvider = ({ children }) => {
    const { user } = useAuth();
    const [state, dispatch] = useReducer(expenseReducer, initialState);

    const normalize = (expense) => {
        if (!expense) return expense;
        const { _id, ...rest } = expense;
        return { id: _id || expense.id, ...rest };
    };

    const fetchExpenses = async () => {
        dispatch({ type: "SET_LOADING", payload: true });
        try {
            const data = await apiFetch("/api/expenses");
            dispatch({ type: "SET_EXPENSES", payload: (data || []).map(normalize) });
        } catch (err) {
            dispatch({ type: "SET_ERROR", payload: err.message });
        }
    };

    useEffect(() => {
        if (user) fetchExpenses();
        else dispatch({ type: "SET_EXPENSES", payload: [] });

    }, [user]);

    const addExpense = async (expense) => {
        try {
            const data = await apiFetch("/api/expenses", { method: "POST", body: JSON.stringify(expense) });
            dispatch({ type: "ADD_EXPENSE", payload: normalize(data) });
            return normalize(data);
        } catch (err) {
            dispatch({ type: "SET_ERROR", payload: err.message });
            throw err;
        }
    };

    const deleteExpense = async (id) => {
        try {
            await apiFetch(`/api/expenses/${id}`, { method: "DELETE" });
            dispatch({ type: "DELETE_EXPENSE", payload: id });
        } catch (err) {
            dispatch({ type: "SET_ERROR", payload: err.message });
            throw err;
        }
    };

    const updateExpense = async (id, updated) => {
        try {
            const data = await apiFetch(`/api/expenses/${id}`, { method: "PUT", body: JSON.stringify(updated) });
            dispatch({ type: "UPDATE_EXPENSE", payload: normalize(data) });
            return normalize(data);
        } catch (err) {
            dispatch({ type: "SET_ERROR", payload: err.message });
            throw err;
        }
    };

    return (
        <ExpenseContext.Provider value={{
            expenses: state.expenses,
            loading: state.loading,
            error: state.error,
            fetchExpenses,
            addExpense,
            deleteExpense,
            updateExpense,
        }}>
            {children}
        </ExpenseContext.Provider>
    );
};

export const useExpenses = () => {
    const ctx = useContext(ExpenseContext);
    if (!ctx) throw new Error("useExpenses must be used inside ExpenseProvider");
    return ctx;
};
