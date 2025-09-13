import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Map,
  Moon,
  Sun,
  MapPin,
  Users,
  Building,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { handleSuccess } from "../utils";
import { useAuth } from "../context/AuthContext";

export default function MapPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState(null);
  const [employeeData, setEmployeeData] = useState([]);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
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

  const locationStats = employeeData.reduce((acc, emp) => {
    const location = emp[2];
    const salary = Number.parseInt(emp[5].replace(/[$,]/g, ""));

    if (!acc[location]) {
      acc[location] = {
        employees: [],
        totalSalary: 0,
        count: 0,
        averageSalary: 0,
      };
    }

    acc[location].employees.push({
      name: emp[0],
      position: emp[1],
      salary: emp[5],
      startDate: emp[4],
      id: emp[3],
    });
    acc[location].totalSalary += salary;
    acc[location].count += 1;
    acc[location].averageSalary = Math.round(
      acc[location].totalSalary / acc[location].count
    );

    return acc;
  }, {});

  const cityCoordinates = {
    Edinburgh: { x: 45, y: 25, country: "Scotland" },
    Tokyo: { x: 85, y: 40, country: "Japan" },
    "San Francisco": { x: 15, y: 45, country: "USA" },
    "New York": { x: 25, y: 40, country: "USA" },
  };

  const cities = Object.entries(locationStats).map(([city, stats]) => ({
    name: city,
    ...stats,
    coordinates: cityCoordinates[city] || { x: 50, y: 50, country: "Unknown" },
  }));

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
              Loading map data...
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
                <Map
                  className={`h-5 w-5 ${
                    darkMode ? "text-blue-400" : "text-blue-600"
                  }`}
                />
                <h1
                  className={`text-xl font-semibold ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Global Employee Distribution
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* World Map Visualization */}
          <div
            className={`lg:col-span-2 rounded-xl border p-6 ${
              darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <h3
              className={`text-lg font-semibold mb-6 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Employee Locations Worldwide
            </h3>

            {/* Simplified World Map */}
            <div className="relative w-full h-96 bg-gradient-to-b from-blue-100 to-blue-50 dark:from-gray-700 dark:to-gray-600 rounded-lg overflow-hidden">
              {/* Continents (simplified shapes) */}
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 100 60"
              >
                {/* North America */}
                <path
                  d="M5 20 L25 15 L30 25 L25 35 L15 40 L5 35 Z"
                  fill={darkMode ? "#4b5563" : "#e5e7eb"}
                  stroke={darkMode ? "#6b7280" : "#d1d5db"}
                  strokeWidth="0.5"
                />

                {/* Europe */}
                <path
                  d="M40 15 L50 12 L55 20 L50 25 L40 22 Z"
                  fill={darkMode ? "#4b5563" : "#e5e7eb"}
                  stroke={darkMode ? "#6b7280" : "#d1d5db"}
                  strokeWidth="0.5"
                />

                {/* Asia */}
                <path
                  d="M55 10 L85 8 L90 25 L85 35 L70 30 L55 25 Z"
                  fill={darkMode ? "#4b5563" : "#e5e7eb"}
                  stroke={darkMode ? "#6b7280" : "#d1d5db"}
                  strokeWidth="0.5"
                />
              </svg>

              {/* City Markers */}
              {cities.map((city) => (
                <div
                  key={city.name}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                  style={{
                    left: `${city.coordinates.x}%`,
                    top: `${city.coordinates.y}%`,
                  }}
                  onClick={() =>
                    setSelectedCity(
                      selectedCity === city.name ? null : city.name
                    )
                  }
                >
                  {/* Marker */}
                  <div
                    className={`w-4 h-4 rounded-full border-2 border-white shadow-lg transition-all duration-200 group-hover:scale-125 ${
                      selectedCity === city.name
                        ? "bg-red-500 scale-125"
                        : "bg-blue-500"
                    }`}
                  ></div>

                  {/* Pulse animation */}
                  <div
                    className={`absolute inset-0 w-4 h-4 rounded-full animate-ping ${
                      selectedCity === city.name ? "bg-red-400" : "bg-blue-400"
                    } opacity-75`}
                  ></div>

                  {/* City label */}
                  <div
                    className={`absolute top-6 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded text-xs font-medium whitespace-nowrap transition-opacity ${
                      selectedCity === city.name
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100"
                    } ${
                      darkMode
                        ? "bg-gray-800 text-white border border-gray-600"
                        : "bg-white text-gray-900 border border-gray-200"
                    } shadow-lg`}
                  >
                    {city.name}
                    <br />
                    <span className="text-blue-600 dark:text-blue-400">
                      {city.count} employees
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="mt-4 flex items-center justify-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span
                  className={`text-sm ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Office Location
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span
                  className={`text-sm ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Selected
                </span>
              </div>
            </div>
          </div>

          {/* Location Statistics */}
          <div className="space-y-6">
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
                Location Overview
              </h3>
              <div className="space-y-4">
                {cities.map((city) => (
                  <div
                    key={city.name}
                    className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                      selectedCity === city.name
                        ? darkMode
                          ? "bg-blue-900/50 border-blue-500"
                          : "bg-blue-50 border-blue-300"
                        : darkMode
                        ? "bg-gray-700 border-gray-600 hover:bg-gray-600"
                        : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                    }`}
                    onClick={() =>
                      setSelectedCity(
                        selectedCity === city.name ? null : city.name
                      )
                    }
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <MapPin
                          className={`h-4 w-4 ${
                            selectedCity === city.name
                              ? "text-blue-600 dark:text-blue-400"
                              : "text-gray-500 dark:text-gray-400"
                          }`}
                        />
                        <span
                          className={`font-medium ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {city.name}
                        </span>
                      </div>
                      <span
                        className={`text-sm px-2 py-1 rounded-full ${
                          darkMode
                            ? "bg-gray-600 text-gray-300"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {city.coordinates.country}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center space-x-1">
                        <Users className="h-3 w-3 text-gray-500" />
                        <span
                          className={
                            darkMode ? "text-gray-300" : "text-gray-600"
                          }
                        >
                          {city.count} employees
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Building className="h-3 w-3 text-gray-500" />
                        <span
                          className={`font-medium ${
                            darkMode ? "text-green-400" : "text-green-600"
                          }`}
                        >
                          ${city.averageSalary.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected City Details */}
            {selectedCity && (
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
                  {selectedCity} Team
                </h3>
                <div className="space-y-3">
                  {locationStats[selectedCity].employees.map((employee) => (
                    <div
                      key={employee.id}
                      className={`p-3 rounded-lg ${
                        darkMode ? "bg-gray-700" : "bg-gray-50"
                      }`}
                    >
                      <div
                        className={`font-medium ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {employee.name}
                      </div>
                      <div
                        className={`text-sm ${
                          darkMode ? "text-blue-400" : "text-blue-600"
                        }`}
                      >
                        {employee.position}
                      </div>
                      <div
                        className={`text-sm ${
                          darkMode ? "text-green-400" : "text-green-600"
                        } font-medium`}
                      >
                        {employee.salary}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
