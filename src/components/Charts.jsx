import { useState, useEffect } from "react";
import {
  ArrowLeft,
  BarChart3,
  Moon,
  Sun,
  TrendingUp,
  Users,
  DollarSign,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import axios from "axios";
import { handleSuccess } from "../utils";
import { useAuth } from "../context/AuthContext";

export default function ChartsPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [employeeData, setEmployeeData] = useState([]);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }

    (async () => {
      const res = await axios.post("/api/backend_dev/gettabledata.php", {
        username: "test",
        password: "123456",
      });
      setEmployeeData(res.data.TABLE_DATA.data);
      setLoading(false);
    })();
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const handleLogout = () => {
    logout();
    handleSuccess("Logout Successfull");
    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  // Prepare data for charts

  const firstTen = employeeData.slice(0, 10).map((emp, index) => ({
    name: emp[0].split(" ")[0], // First name only for better display
    salary: Number.parseInt(emp[5].replace(/[$,]/g, "")),
    fullName: emp[0],
    position: emp[1],
  }));

  const salaryData = employeeData.map((emp, index) => ({
    name: emp[0].split(" ")[0], // First name only for better display
    salary: Number.parseInt(emp[5].replace(/[$,]/g, "")),
    fullName: emp[0],
    position: emp[1],
  }));

  // Position distribution data
  const positionCounts = employeeData.reduce((acc, emp) => {
    const position = emp[1];
    acc[position] = (acc[position] || 0) + 1;
    return acc;
  }, {});

  const positionData = Object.entries(positionCounts).map(
    ([position, count]) => ({
      position:
        position.length > 20 ? position.substring(0, 20) + "..." : position,
      count,
      fullPosition: position,
    })
  );

  const COLORS = [
    "#2563eb",
    "#06b6d4",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
  ];

  if (loading) {
    return (
      <div
        className={`min-h-screen ${
          darkMode ? "dark bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p
              className={`text-lg ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Loading analytics...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        darkMode ? "dark bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* Header */}
      <header
        className={`${
          darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        } border-b transition-colors duration-200`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                to="/list"
                className={`flex items-center space-x-2 ${
                  darkMode
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-600 hover:text-gray-900"
                } transition-colors`}
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Employee List</span>
              </Link>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
              <div className="flex items-center space-x-2">
                <BarChart3
                  className={`h-5 w-5 ${
                    darkMode ? "text-blue-400" : "text-blue-600"
                  }`}
                />
                <h1
                  className={`text-xl font-semibold ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Employee Analytics
                </h1>
              </div>
            </div>

            <div>
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode
                    ? "text-gray-400 hover:text-white hover:bg-gray-700"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                }`}
              >
                {darkMode ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>

              <button
                onClick={handleLogout}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode
                    ? "text-gray-400 hover:text-white hover:bg-gray-700"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                }`}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div
            className={`rounded-xl border p-6 ${
              darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-sm font-medium ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Total Employees
                </p>
                <p
                  className={`text-2xl font-bold ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {employeeData.length}
                </p>
              </div>
              <Users
                className={`h-8 w-8 ${
                  darkMode ? "text-blue-400" : "text-blue-600"
                }`}
              />
            </div>
          </div>

          <div
            className={`rounded-xl border p-6 ${
              darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-sm font-medium ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Average Salary
                </p>
                <p
                  className={`text-2xl font-bold ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  $
                  {Math.round(
                    salaryData.reduce((sum, emp) => sum + emp.salary, 0) /
                      salaryData.length
                  ).toLocaleString()}
                </p>
              </div>
              <DollarSign
                className={`h-8 w-8 ${
                  darkMode ? "text-green-400" : "text-green-600"
                }`}
              />
            </div>
          </div>

          <div
            className={`rounded-xl border p-6 ${
              darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-sm font-medium ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Highest Salary
                </p>
                <p
                  className={`text-2xl font-bold ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  $
                  {Math.max(
                    ...salaryData.map((emp) => emp.salary)
                  ).toLocaleString()}
                </p>
              </div>
              <TrendingUp
                className={`h-8 w-8 ${
                  darkMode ? "text-purple-400" : "text-purple-600"
                }`}
              />
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Salary Bar Chart */}
          <div
            className={`rounded-xl border p-6 ${
              darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <h3
              className={`text-lg font-semibold mb-4 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Employee Salaries (First 10)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={firstTen}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={darkMode ? "#374151" : "#e5e7eb"}
                />
                <XAxis
                  dataKey="name"
                  stroke={darkMode ? "#9ca3af" : "#6b7280"}
                  fontSize={12}
                />
                <YAxis
                  stroke={darkMode ? "#9ca3af" : "#6b7280"}
                  fontSize={12}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode ? "#1f2937" : "#ffffff",
                    border: `1px solid ${darkMode ? "#374151" : "#e5e7eb"}`,
                    borderRadius: "8px",
                    color: darkMode ? "#ffffff" : "#000000",
                  }}
                  formatter={(value, name) => [
                    `$${value.toLocaleString()}`,
                    "Salary",
                  ]}
                  labelFormatter={(label) => {
                    const emp = salaryData.find((e) => e.name === label);
                    return emp ? `${emp.fullName} - ${emp.position}` : label;
                  }}
                />
                <Bar dataKey="salary" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Position Distribution Pie Chart */}
          <div
            className={`rounded-xl border p-6 ${
              darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <h3
              className={`text-lg font-semibold mb-4 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Position Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={positionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ position, count }) => `${position}: ${count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {positionData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode ? "#1f2937" : "#ffffff",
                    border: `1px solid ${darkMode ? "#374151" : "#e5e7eb"}`,
                    borderRadius: "8px",
                    color: darkMode ? "#ffffff" : "#000000",
                  }}
                  formatter={(value, name) => [value, "Employees"]}
                  labelFormatter={(label) => {
                    const pos = positionData.find((p) => p.position === label);
                    return pos ? pos.fullPosition : label;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
}
