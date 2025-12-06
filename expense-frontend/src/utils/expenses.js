export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 2,
    }).format(amount);
};

export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

export const getExpensesByCategory = (expenses) => {

    const categories = {
        food: 0,
        transport: 0,
        entertainment: 0,
        shopping: 0,
        utilities: 0,
        health: 0,
        other: 0,
    };

    expenses.forEach((expense) => {
        const key = String(expense.category || "other").toLowerCase();
        if (Object.prototype.hasOwnProperty.call(categories, key)) {
            categories[key] += Number(expense.amount) || 0;
        } else {
            categories.other += Number(expense.amount) || 0;
        }
    });

    return categories;
};

export const getTotalExpenses = (expenses) => {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
};

export const getChartData = (expenses) => {
    const expenseByCategory = getExpensesByCategory(expenses);
    return Object.entries(expenseByCategory)
        .filter(([, value]) => value > 0)
        .map(([name, value]) => ({
            name: name.charAt(0).toUpperCase() + name.slice(1),
            value,
        }));
};

export const getCategoryTextColor = (category) => {
    const colors = {
        food: "text-indigo-500",
        travel: "text-cyan-500",
        entertainment: "text-purple-500",
        shopping: "text-orange-500",
        utilities: "text-teal-500",
        health: "text-green-500",
        others: "text-slate-500",

    };
    const key = String(category || "").toLowerCase();
    return colors[key] || "text-gray-500";

};

export const getMonthName = (date) => {
    return date.toLocaleString("default", { month: "long" });
};

export const getExpensesByMonth = (expenses, numMonths = 6) => {
    const now = new Date();
    const result = {};
    for (let i = 0; i < numMonths; i++) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthYear = `${getMonthName(d)} ${d.getFullYear()}`;
        result[monthYear] = 0;
    }
    expenses.forEach((expense) => {
        const expenseDate = new Date(expense.date);
        const monthYear = `${getMonthName(expenseDate)} ${expenseDate.getFullYear()}`;
        if (result[monthYear] !== undefined) {
            result[monthYear] += expense.amount;
        }

    });
    return result;
};
