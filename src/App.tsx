import { useState, useMemo, useEffect } from "react";
import "./App.css";
import ExpensePieChart from "./components/ExpensePieChart";
import toast, { Toaster } from "react-hot-toast";
import { FaPen } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

function App() {
  const date = new Date(Date.now());

  interface Expense {
    id: number;
    date: string;
    note: string;
    category: string;
    amount: number | null;
  }

  const [data, setData] = useState<Expense[]>(() => {
    const savedExpenses = localStorage.getItem("expenses");
    return savedExpenses ? JSON.parse(savedExpenses) : [];
  });

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(data));
  }, [data]);

  const [formData, setFormData] = useState<Expense>({
    id: 0,
    date: "",
    note: "",
    category: "",
    amount: null,
  });

  const category = [
    "Food",
    "Travel",
    "Shopping",
    "Bills",
    "Entertainment",
    "Others",
  ];

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const formatDate = (date: string) => {
    if (!date) return "";

    return new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const [openAddExpenseCard, setOpenAddExpenseCard] = useState<boolean>(false);
  const [deleteExpenseCard, setDeleteExpenseCard] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const totalExpense = data.reduce(
    (total, expense) => total + (expense.amount ?? 0),
    0
  );

  const [sortColumn, setSortColumn] = useState<
    "date" | "note" | "amount" | ""
  >("");

  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedMonth, setSelectedMonth] = useState("All");

  const handleSort = (column: "date" | "note" | "amount") => {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const filteredExpenses = useMemo(() => {
    let result = [...data];

    if (selectedCategory !== "All") {
      result = result.filter(
        (expense) => expense.category === selectedCategory
      );
    }

    if (selectedMonth !== "All") {
      result = result.filter(
        (expense) => expense.date.split("-")[1] === selectedMonth
      );
    }

    if (sortColumn) {
      result.sort((a, b) => {
        let comparison = 0;

        if (sortColumn === "date") {
          comparison = a.date.localeCompare(b.date);
        }

        if (sortColumn === "note") {
          comparison = a.note.localeCompare(b.note);
        }

        if (sortColumn === "amount") {
          comparison = (a.amount ?? 0) - (b.amount ?? 0);
        }

        return sortDirection === "asc" ? comparison : -comparison;
      });
    }

    return result;
  }, [data, selectedCategory, selectedMonth, sortColumn, sortDirection]);

  const handleExpense = () => {
    if (!formData.date) {
      return toast.error("Please enter the date");
    }

    if (!formData.note.trim()) {
      return toast.error("Please enter the note");
    }

    if (!formData.category) {
      return toast.error("Please select the category");
    }

    if (
      !formData.amount ||
      formData.amount === null
    ) {
      return toast.error("Please enter the amount");
    }

    if (formData.amount <= 0) {
      return toast.error("Please enter a valid amount")
    }

    if (formData.id !== 0) {
      setData((prev) =>
        prev.map((expense) =>
          expense.id === formData.id ? { ...formData, amount: Number(formData.amount) } : expense
        )
      );

      toast.success("Expense updated successfully");
    } else {
      const newExpense = {
        ...formData,
        id: Date.now(),
      };

      setData((prev) => [...prev, newExpense]);

      toast.success("Expense has been saved");
    }

    setOpenAddExpenseCard(false);

    setFormData({
      id: 0,
      date: "",
      note: "",
      category: "",
      amount: null,
    });
  };

  const handleEdit = (id: number) => {
    const editData = data.find((expense) => expense.id === id);

    if (!editData) {
      return toast.error("Expense not found");
    }

    setFormData({
      id: editData.id,
      date: editData.date,
      note: editData.note,
      category: editData.category,
      amount: editData.amount,
    });

    setOpenAddExpenseCard(true);
  };

  const handleCancel = () => {
    setOpenAddExpenseCard(false);

    setFormData({
      id: 0,
      date: "",
      note: "",
      category: "",
      amount: null,
    });
  };

  const handleDelete = (id: number) => {
    setData((prev) => prev.filter((expense) => expense.id !== id));
    setDeleteId(null)
  };

  const handleClearFilters = () => {
    setSelectedCategory("All");
    setSelectedMonth("All");
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 p-3 sm:p-5 lg:p-6 select-none">
        <Toaster position="top-center" reverseOrder={false} />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between w-full">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-left">
            Expense Tracker
          </h1>

          <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold">
            {date.toLocaleString("default", { month: "long" })}{" "}
            {date.getFullYear()}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-6 sm:mt-10 gap-4 sm:gap-5">
          <div className="flex flex-col p-4 border-none w-full items-center shadow-md rounded-2xl bg-green-300">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center">
              Total Expenses
            </h2>
            <h3 className="text-xl sm:text-2xl font-semibold mt-4">
              {totalExpense}
            </h3>
          </div>

          <div className="flex flex-col p-4 border-none w-full items-center shadow-md rounded-2xl bg-blue-300">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center">
              Average Expense
            </h2>
            <h3 className="text-xl sm:text-2xl font-semibold mt-4">
              {data.length > 0 ? (totalExpense / data.length).toFixed(2) : 0}
            </h3>
          </div>

          <div className="flex flex-col p-4 border-none w-full items-center shadow-md rounded-2xl bg-red-300">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center">
              Biggest Expense
            </h2>
            <h3 className="text-xl sm:text-2xl font-semibold mt-4">
              {data.length > 0
                ? Math.max(...data.map((expense) => expense.amount ?? 0))
                : 0}
            </h3>
          </div>

          <div className="flex flex-col p-4 border-none w-full items-center shadow-md rounded-2xl bg-amber-300">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center">
              Total Entry
            </h2>
            <h3 className="text-xl sm:text-2xl font-semibold mt-4">
              {data.length}
            </h3>
          </div>
        </div>

        <div className="flex p-3 sm:p-6 items-center justify-center mt-5 sm:mt-8">
          <button
            onClick={() => setOpenAddExpenseCard(true)}
            className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white px-5 py-3 sm:py-4 rounded-lg"
          >
            Add Expense
          </button>

          {openAddExpenseCard && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70 p-3 sm:p-4">
              <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <label className="block mb-2 font-medium mt-3">Date</label>
                <input
                  value={formData.date}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      date: e.target.value,
                    }))
                  }
                  type="date"
                  className="w-full border rounded-lg p-2 sm:p-3 text-sm sm:text-base"
                />

                <label className="block mb-2 font-medium mt-3">Note</label>
                <input
                  value={formData.note}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      note: e.target.value,
                    }));
                  }}
                  type="text"
                  className="w-full border rounded-lg p-2 sm:p-3 text-sm sm:text-base"
                />

                <label className="block mb-2 font-medium mt-3">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }));
                  }}
                  className="w-full border rounded-lg p-2 sm:p-3 text-sm sm:text-base"
                >
                  <option value="">Select Category</option>
                  {category.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>

                <label className="block mb-2 font-medium mt-3">Amount</label>
                <input
                  value={formData.amount ?? ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      amount: e.target.value ? Number(e.target.value) : null,
                    }))
                  }
                  type="number"
                  className="w-full border rounded-lg p-2 sm:p-3 text-sm sm:text-base"
                />

                <div className="mt-5 flex flex-col-reverse sm:flex-row items-center justify-center gap-2">
                  <button
                    onClick={() => handleCancel()}
                    className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={() => handleExpense()}
                    className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}

          {
            deleteExpenseCard && (
              <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70 p-3 sm:p-4">
                <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                  <div className="flex flex-col items-center justify-center">
                    <p className="block mb-2 font-medium mt-3">Are you sure you want to delete this expense ?</p>
                    <div className="mt-4">
                      <button
                        onClick={() => setDeleteExpenseCard(false)}
                        className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg mr-2"
                      >
                        Cancel
                      </button>

                      <button
                        onClick={() => {
                          if (deleteId !== null) {
                            handleDelete(deleteId)
                            setDeleteExpenseCard(false)
                          }
                        }}
                        className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg"
                      >
                        Detete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          }
        </div>

        <div className="w-full flex flex-col xl:flex-row gap-5 mt-6 sm:mt-10">
          <div className="w-full flex xl:w-2/5 min-w-0 justify-center">
            <ExpensePieChart data={filteredExpenses} />
          </div>

          <div className="w-full min-w-0 xl:w-3/5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-4">
              <label className="font-semibold">Filter Category:</label>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full sm:w-auto border rounded-lg p-2 bg-white"
              >
                <option value="All">All Categories</option>
                {category.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <label className="font-semibold">Filter Month:</label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="border rounded-lg p-2 bg-white"
                >
                  <option value="All">All Months</option>

                  {months.map((month, index) => (
                    <option key={month} value={String(index + 1).padStart(2, "0")}>
                      {month}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => handleClearFilters()}
                  className="bg-red-400 text-white px-4 py-2 rounded-lg"
                >
                  Clear Filters
                </button>
              </div>
            </div>

            <div className="w-full overflow-x-auto rounded-lg shadow-sm">
              <table className="w-full min-w-[650px] border-collapse text-left">
                <thead className="bg-green-100">
                  <tr className="text-sm text-gray-700 shadow-sm">
                    <th
                      onClick={() => handleSort("date")}
                      className="px-4 py-3 font-semibold cursor-pointer whitespace-nowrap"
                    >
                      Date{" "}
                      {sortColumn === "date" &&
                        (sortDirection === "asc" ? "↑" : "↓")}
                    </th>

                    <th
                      onClick={() => handleSort("note")}
                      className="px-4 py-3 font-semibold cursor-pointer whitespace-nowrap"
                    >
                      Note{" "}
                      {sortColumn === "note" &&
                        (sortDirection === "asc" ? "↑" : "↓")}
                    </th>

                    <th className="px-4 py-3 font-semibold whitespace-nowrap">
                      Category
                    </th>

                    <th
                      onClick={() => handleSort("amount")}
                      className="px-4 py-3 font-semibold cursor-pointer whitespace-nowrap"
                    >
                      Amount{" "}
                      {sortColumn === "amount" &&
                        (sortDirection === "asc" ? "↑" : "↓")}
                    </th>

                    <th className="px-4 py-3 font-semibold whitespace-nowrap">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredExpenses.length > 0 ? (
                    filteredExpenses.map((expense) => (
                      <tr
                        key={expense.id}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="px-4 py-3 text-sm sm:text-md font-medium text-gray-600 whitespace-nowrap">
                          {formatDate(expense.date)}
                        </td>

                        <td className="px-4 py-3 text-sm sm:text-md font-medium text-gray-600 whitespace-nowrap">
                          {expense.note}
                        </td>

                        <td className="px-4 py-3 text-sm sm:text-md font-medium text-gray-600 whitespace-nowrap">
                          {expense.category}
                        </td>

                        <td className="px-4 py-3 text-sm sm:text-md font-medium text-gray-600 whitespace-nowrap">
                          {expense.amount}
                        </td>

                        <td className="px-4 py-3 whitespace-nowrap">
                          <button
                            onClick={() => handleEdit(expense.id)}
                            className="mr-2 text-blue-600"
                          >
                            <FaPen />
                          </button>

                          <button
                            onClick={() => {
                              setDeleteExpenseCard(true)
                              setDeleteId(expense.id)
                            }}
                            className="text-red-600"
                          >
                            <MdDelete />
                          </button>
                        </td>
                      </tr>
                    ))) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center py-8 text-gray-500 font-semibold"
                      >
                        No data available
                      </td>
                    </tr>
                  )
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;