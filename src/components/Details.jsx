import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  Camera,
  User,
  MapPin,
  Calendar,
  Building,
  Phone,
  Mail,
  Moon,
  Sun,
  Download,
  X,
} from "lucide-react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { handleSuccess } from "../utils";
import { useAuth } from "../context/AuthContext";

export default function Details() {
  const { name } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    // Fetch employee data based on ID
    (async () => {
      const res = await axios.post("/api/backend_dev/gettabledata.php", {
        username: "test",
        password: "123456",
      });
      const employeeData = res.data.TABLE_DATA.data.find(
        (item) => item[0] === name
      );

      if (employeeData) {
        setEmployee({
          id: employeeData[3],
          name: employeeData[0],
          position: employeeData[1],
          location: employeeData[2],
          employeeId: employeeData[3],
          joinDate: employeeData[4],
          salary: employeeData[5],

          // Additional mock data for details
          email: `${employeeData[0]
            .toLowerCase()
            .replace(" ", ".")}@company.com`,
          phone: `+1 (555) ${Math.floor(Math.random() * 900) + 100}-${
            Math.floor(Math.random() * 9000) + 1000
          }`,
          department: employeeData[1].includes("Developer")
            ? "Engineering"
            : employeeData[1].includes("Accountant")
            ? "Finance"
            : employeeData[1].includes("Sales")
            ? "Sales"
            : "Operations",
          manager: "John Smith",
          status: "Active",
        });
      }
      setLoading(false);
    })();
  }, [name]);

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

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      streamRef.current = stream;
      setShowCamera(true); // show modal, then attach in useEffect
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Unable to access camera. Please check permissions.");
    }
  };

  useEffect(() => {
    if (showCamera && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current
        .play()
        .catch((err) => console.error("Video play failed:", err));
    }
  }, [showCamera]);

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext("2d");

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageDataUrl = canvas.toDataURL("image/jpeg");
      setCapturedImage(imageDataUrl);
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  };

  const downloadImage = () => {
    if (capturedImage) {
      const link = document.createElement("a");
      link.download = `${employee.name.replace(" ", "_")}_photo.jpg`;
      link.href = capturedImage;
      link.click();
    }
  };

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
              Loading employee details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div
        className={`min-h-screen ${
          darkMode ? "dark bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <User
              className={`mx-auto h-12 w-12 ${
                darkMode ? "text-gray-600" : "text-gray-400"
              } mb-4`}
            />
            <h3
              className={`text-lg font-medium ${
                darkMode ? "text-gray-300" : "text-gray-900"
              } mb-2`}
            >
              Employee Not Found
            </h3>
            <p
              className={`text-sm ${
                darkMode ? "text-gray-500" : "text-gray-500"
              } mb-4`}
            >
              The employee you're looking for doesn't exist.
            </p>
            <Link
              to="/list"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to List
            </Link>
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
                <span>Back to List</span>
              </Link>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
              <h1
                className={`text-xl font-semibold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Employee Details
              </h1>
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Employee Info Card */}
          <div className="lg:col-span-2">
            <div
              className={`rounded-xl border p-8 ${
                darkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              }`}
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2
                    className={`text-2xl font-bold mb-2 ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {employee.name}
                  </h2>
                  <p
                    className={`text-lg font-medium ${
                      darkMode ? "text-blue-400" : "text-blue-600"
                    }`}
                  >
                    {employee.position}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 text-sm font-medium rounded-full ${
                    employee.status === "Active"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                  }`}
                >
                  {employee.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <User
                      className={`h-5 w-5 ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    />
                    <div>
                      <p
                        className={`text-sm ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Employee ID
                      </p>
                      <p
                        className={`font-medium ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {employee.employeeId}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Mail
                      className={`h-5 w-5 ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    />
                    <div>
                      <p
                        className={`text-sm ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Email
                      </p>
                      <p
                        className={`font-medium ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {employee.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Phone
                      className={`h-5 w-5 ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    />
                    <div>
                      <p
                        className={`text-sm ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Phone
                      </p>
                      <p
                        className={`font-medium ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {employee.phone}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <MapPin
                      className={`h-5 w-5 ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    />
                    <div>
                      <p
                        className={`text-sm ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Location
                      </p>
                      <p
                        className={`font-medium ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {employee.location}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Building
                      className={`h-5 w-5 ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    />
                    <div>
                      <p
                        className={`text-sm ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Department
                      </p>
                      <p
                        className={`font-medium ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {employee.department}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Calendar
                      className={`h-5 w-5 ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    />
                    <div>
                      <p
                        className={`text-sm ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Start Date
                      </p>
                      <p
                        className={`font-medium ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {employee.joinDate}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p
                      className={`text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Annual Salary
                    </p>
                    <p
                      className={`text-2xl font-bold ${
                        darkMode ? "text-green-400" : "text-green-600"
                      }`}
                    >
                      {employee.salary}
                    </p>
                  </div>
                  <div>
                    <p
                      className={`text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Reports to
                    </p>
                    <p
                      className={`font-medium ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {employee.manager}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Photo Capture Card */}
          <div className="lg:col-span-1">
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
                Employee Photo
              </h3>

              {capturedImage ? (
                <div className="space-y-4">
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                    <img
                      src={capturedImage || "/placeholder.svg"}
                      alt="Captured employee photo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={downloadImage}
                      className="flex-1 flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </button>
                    <button
                      onClick={() => setCapturedImage(null)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        darkMode
                          ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div
                    className={`aspect-square rounded-lg border-2 border-dashed flex items-center justify-center ${
                      darkMode
                        ? "border-gray-600 bg-gray-700"
                        : "border-gray-300 bg-gray-50"
                    }`}
                  >
                    <div className="text-center">
                      <Camera
                        className={`mx-auto h-12 w-12 ${
                          darkMode ? "text-gray-500" : "text-gray-400"
                        } mb-2`}
                      />
                      <p
                        className={`text-sm ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        No photo captured
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={startCamera}
                    className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Capture Photo
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Camera Modal */}
      {showCamera && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div
            className={`rounded-xl p-6 max-w-md w-full ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3
                className={`text-lg font-semibold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Capture Photo
              </h3>
              <button
                onClick={stopCamera}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode
                    ? "text-gray-400 hover:text-white hover:bg-gray-700"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                }`}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="aspect-square rounded-lg overflow-hidden bg-black">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={capturePhoto}
                  className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Capture
                </button>
                <button
                  onClick={stopCamera}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    darkMode
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>

          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}
    </div>
  );
}
