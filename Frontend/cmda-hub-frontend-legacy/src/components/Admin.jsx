




// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { IoEyeSharp, IoEyeOffSharp } from "react-icons/io5";
// import JwtUtil from "../services/JwtUtil";

// import Navbar from "./Navbar";

// const Admin = () => {
//   const [newUser, setNewUser] = useState({
//     companyName: "",
//     employeeName: "",
//     jobTitle: "",
//     email: "",
//     password: "",
//     confirmpassword: "",
//     role: "user",
//     mobileNum: "",
//   });
//   const [allUsers, setAllUsers] = useState([]);
//   const [viewUsers, setViewUsers] = useState(true);
//   const [loading, setLoading] = useState(true);
//   const [passwordMatchError, setPasswordMatchError] = useState("");
//   const [mobileNumError, setMobileNumError] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

//   useEffect(() => {
//     const fetchAdminCompany = async () => {
//       try {
//         const token = localStorage.getItem("authToken");
//         if (!token) {
//           toast.error("Unauthorized. Please log in.");
//           return;
//         }

//         const email = JwtUtil.extractEmail(token);
//         if (!email) {
//           toast.error("Failed to retrieve admin email.");
//           return;
//         }

//         const response = await axios.get(`${API_BASE}/corporate/${email}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         });

//         setNewUser((prev) => ({
//           ...prev,
//           companyName: response.data.companyName || "",
//         }));
//       } catch (error) {
//         console.error("Error fetching admin company:", error);
//         toast.error("Failed to fetch admin's company name.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAdminCompany();
//     fetchAllUsers();
//   }, []);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     if (name === "companyName" || name === "role") return;

//     setNewUser({ ...newUser, [name]: value });

//     // Real-time password confirmation validation
//     if (name === "confirmpassword" || name === "password") {
//       if (name === "confirmpassword" && value !== newUser.password) {
//         setPasswordMatchError("Passwords do not match");
//       } else if (name === "password" && newUser.confirmpassword && value !== newUser.confirmpassword) {
//         setPasswordMatchError("Passwords do not match");
//       } else {
//         setPasswordMatchError("");
//       }
//     }

//     // Mobile number validation
//     if (name === "mobileNum") {
//       const mobileRegex = /^\d{10}$/;
//       if (!mobileRegex.test(value) && value !== "") {
//         setMobileNumError("Mobile number must be exactly 10 digits");
//       } else {
//         setMobileNumError("");
//       }
//     }
//   };

//   const handleUserAction = async (email) => {
//     try {
//       const token = localStorage.getItem("authToken");
//       if (!token) {
//         toast.error("Unauthorized. Please log in.");
//         return;
//       }

//       const adminEmail = JwtUtil.extractEmail(token);
//       if (!adminEmail) {
//         toast.error("Failed to retrieve admin email.");
//         return;
//       }

//       await axios.delete(`${API_BASE}/Admin/deleteCorporateUserByEmail/${email}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//           role: "Admin",
//           email: adminEmail,
//         },
//       });
//       toast.success("Corporate user deactivated successfully!");
//       setAllUsers(allUsers.filter((user) => user.email !== email));
//     } catch (error) {
//       console.error("Error deleting user:", error.response);
//       toast.error(error.response?.data || "An error occurred. Please try again.");
//     }
//   };

//   const handleSubmit = async () => {
//     if (
//       !newUser.companyName ||
//       !newUser.email ||
//       !newUser.password ||
//       !newUser.confirmpassword ||
//       !newUser.mobileNum
//     ) {
//       toast.error("All required fields must be filled!");
//       return;
//     }

//     if (newUser.password.length < 8) {
//       toast.error("Password must be at least 8 characters long.");
//       return;
//     }

//     if (newUser.password !== newUser.confirmpassword) {
//       toast.error("Passwords do not match.");
//       return;
//     }

//     const mobileRegex = /^\d{10}$/;
//     if (!mobileRegex.test(newUser.mobileNum)) {
//       toast.error("Mobile number must be exactly 10 digits");
//       return;
//     }

//     try {
//       const token = localStorage.getItem("authToken");
//       if (!token) {
//         toast.error("Unauthorized. Please log in.");
//         return;
//       }

//       const adminEmail = JwtUtil.extractEmail(token);
//       if (!adminEmail) {
//         toast.error("Failed to retrieve admin email.");
//         return;
//       }

//       // Check if user already exists
//       const userExists = allUsers.some((user) => user.email === newUser.email);
//       if (userExists) {
//         toast.error("This employee is already registered!");
//         return;
//       }

//       await axios.post(`${API_BASE}/Admin/addCorporateUser`, newUser, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//           role: "Admin",
//           email: adminEmail,
//         },
//       });
//       toast.success("Corporate user added successfully!");
//       fetchAllUsers();
//       setNewUser((prev) => ({
//         ...prev,
//         employeeName: "",
//         jobTitle: "",
//         email: "",
//         password: "",
//         confirmpassword: "",
//         mobileNum: "",
//       }));
//       setPasswordMatchError("");
//       setMobileNumError("");
//     } catch (error) {
//       console.error("Error adding user:", error.response);
//       toast.error(error.response?.data || "An error occurred. Please try again.");
//     }
//   };

//   const fetchAllUsers = async () => {
//     try {
//       const token = localStorage.getItem("authToken");
//       if (!token) {
//         toast.error("Unauthorized. Please log in.");
//         return;
//       }

//       const adminEmail = JwtUtil.extractEmail(token);
//       if (!adminEmail) {
//         toast.error("Failed to retrieve admin email.");
//         return;
//       }

//       const response = await axios.get(`${API_BASE}/Admin/getAllCorporateUsers`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//           role: "Admin",
//           email: adminEmail,
//         },
//       });
//       setAllUsers(response.data.filter((user) => user.status !== 0));
//     } catch (error) {
//       console.error("Error fetching users:", error);
//       toast.error("Failed to fetch users");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
//         <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
//       <Navbar />
//       <div className="max-w-7xl mx-auto mt-16">
//         <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">
//           Admin Dashboard
//         </h1>

//         {/* Add User Card */}
//         <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 mb-8">
//           <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
//             Add New Corporate User
//           </h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//             {Object.keys(newUser).map((field) => (
//               <div key={field} className="relative">
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                   {field.replace(/([A-Z])/g, " $1").trim()}
//                 </label>
//                 <div className="relative">
//                   <input
//                     type={
//                       field === "password" && showPassword
//                         ? "text"
//                         : field === "confirmpassword" && showConfirmPassword
//                         ? "text"
//                         : field.includes("password")
//                         ? "password"
//                         : "text"
//                     }
//                     name={field}
//                     value={newUser[field]}
//                     onChange={handleInputChange}
//                     className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition duration-200"
//                     placeholder={`Enter ${field.replace(/([A-Z])/g, " $1").trim()}`}
//                     readOnly={field === "companyName" || field === "role"}
//                   />
//                   {field === "password" && (
//                     <button
//                       type="button"
//                       className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
//                       onClick={() => setShowPassword(!showPassword)}
//                     >
//                       {showPassword ? <IoEyeOffSharp size={20} /> : <IoEyeSharp size={20} />}
//                     </button>
//                   )}
//                   {field === "confirmpassword" && (
//                     <button
//                       type="button"
//                       className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
//                       onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                     >
//                       {showConfirmPassword ? <IoEyeOffSharp size={20} /> : <IoEyeSharp size={20} />}
//                     </button>
//                   )}
//                 </div>
//                 {field === "confirmpassword" && passwordMatchError && (
//                   <p className="text-red-500 text-sm mt-1">{passwordMatchError}</p>
//                 )}
//                 {field === "mobileNum" && mobileNumError && (
//                   <p className="text-red-500 text-sm mt-1">{mobileNumError}</p>
//                 )}
//               </div>
//             ))}
//           </div>
//           <div className="flex justify-center gap-4 mt-8">
//             <button
//               className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200 font-medium"
//               onClick={handleSubmit}
//             >
//               Activate User
//             </button>
//             <button
//               className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition duration-200 font-medium flex items-center gap-2"
//               onClick={() => setViewUsers(!viewUsers)}
//             >
//               <IoEyeSharp size={20} />
//               {viewUsers ? "Hide Users" : "View All Users"}
//             </button>
//           </div>
//         </div>

//         {/* Users Table */}
//         {viewUsers && (
//           <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
//             <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
//               Corporate Users
//             </h2>
//             <div className="overflow-x-auto">
//               <table className="w-full border-collapse">
//                 <thead>
//                   <tr className="bg-gray-100 dark:bg-gray-700">
//                     <th className="px-6 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
//                       Company
//                     </th>
//                     <th className="px-6 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
//                       Employee
//                     </th>
//                     <th className="px-6 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
//                       Email
//                     </th>
//                     <th className="px-6 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
//                       Job Title
//                     </th>
//                     <th className="px-6 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {allUsers.map((user, index) => (
//                     <tr
//                       key={index}
//                       className="border-b border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
//                     >
//                       <td className="px-6 py-4 text-gray-900 dark:text-white">{user.companyName}</td>
//                       <td className="px-6 py-4 text-gray-900 dark:text-white">{user.employeeName}</td>
//                       <td className="px-6 py-4 text-gray-900 dark:text-white">{user.email}</td>
//                       <td className="px-6 py-4 text-gray-900 dark:text-white">{user.jobTitle}</td>
//                       <td className="px-6 py-4">
//                         <button
//                           className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200 font-medium"
//                           onClick={() => handleUserAction(user.email)}
//                         >
//                           Delete User
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Admin;


// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";

// const Admin = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//   });

//   const [users, setUsers] = useState([]);
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleAddUser = async () => {
//     const token = localStorage.getItem("token");

//     if (!token) {
//       alert("No token found. Please log in again.");
//       return;
//     }

//     try {
//       const decoded = jwtDecode(token);

//       const userType = decoded.userType;
//       if (userType !== "Admin") {
//         alert("Unauthorized: You are not allowed to add a user.");
//         return;
//       }

//       const response = await axios.post(
//         "http://localhost:8080/admin/add-corporate",
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setUsers([...users, response.data]);
//       setFormData({ name: "", email: "", password: "" });
//     } catch (error) {
//       console.error("Error adding user:", error);
//       alert("Failed to add user.");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-blue-100 via-blue-200 to-blue-300 dark:from-blue-900 dark:via-blue-800 dark:to-blue-700 py-10 px-4 sm:px-6 lg:px-8">
//       <h1 className="text-4xl font-extrabold text-center text-blue-900 dark:text-white tracking-wide mb-10">
//         Admin Dashboard
//       </h1>

//       <div className="max-w-3xl mx-auto backdrop-blur-md bg-white/70 dark:bg-gray-800/60 shadow-2xl rounded-2xl p-8 mb-12 border border-blue-300 dark:border-blue-600">
//         <h2 className="text-2xl font-semibold text-blue-800 dark:text-blue-300 mb-6">
//           Add New Corporate User
//         </h2>

//         <div className="space-y-6">
//           <input
//             type="text"
//             name="name"
//             placeholder="Name"
//             value={formData.name}
//             onChange={handleChange}
//             className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white/60 dark:bg-gray-700/40 placeholder-gray-500 dark:placeholder-gray-400 text-gray-800 dark:text-white shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
//           />

//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             value={formData.email}
//             onChange={handleChange}
//             className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white/60 dark:bg-gray-700/40 placeholder-gray-500 dark:placeholder-gray-400 text-gray-800 dark:text-white shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
//           />

//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             value={formData.password}
//             onChange={handleChange}
//             className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white/60 dark:bg-gray-700/40 placeholder-gray-500 dark:placeholder-gray-400 text-gray-800 dark:text-white shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
//           />

//           <button
//             onClick={handleAddUser}
//             className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-900 transition duration-200 shadow-lg shadow-blue-300/40 font-medium"
//           >
//             Add Corporate User
//           </button>
//         </div>
//       </div>

//       <div className="max-w-4xl mx-auto backdrop-blur-md bg-white/70 dark:bg-gray-800/60 shadow-2xl rounded-2xl p-6 border border-blue-300 dark:border-blue-600">
//         <h2 className="text-2xl font-semibold text-blue-800 dark:text-blue-300 mb-4">
//           Corporate Users
//         </h2>
//         <ul className="divide-y divide-blue-200 dark:divide-blue-600">
//           {users.map((user, index) => (
//             <li
//               key={index}
//               className="py-3 text-gray-800 dark:text-gray-200 tracking-wide"
//             >
//               {user.name} - {user.email}
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default Admin;




import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoEyeSharp, IoEyeOffSharp } from "react-icons/io5";
import JwtUtil from "../services/JwtUtil";

import Navbar from "./Navbar";

const Admin = () => {
  const [newUser, setNewUser] = useState({
    companyName: "",
    employeeName: "",
    jobTitle: "",
    email: "",
    password: "",
    confirmpassword: "",
    role: "user",
    mobileNum: "",
  });
  const [allUsers, setAllUsers] = useState([]);
  const [viewUsers, setViewUsers] = useState(true);
  const [loading, setLoading] = useState(true);
  const [passwordMatchError, setPasswordMatchError] = useState("");
  const [mobileNumError, setMobileNumError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

  useEffect(() => {
    const fetchAdminCompany = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          toast.error("Unauthorized. Please log in.");
          return;
        }

        const email = JwtUtil.extractEmail(token);
        if (!email) {
          toast.error("Failed to retrieve admin email.");
          return;
        }

        const response = await axios.get(`${API_BASE}/corporate/${email}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        setNewUser((prev) => ({
          ...prev,
          companyName: response.data.companyName || "",
        }));
      } catch (error) {
        console.error("Error fetching admin company:", error);
        toast.error("Failed to fetch admin's company name.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminCompany();
    fetchAllUsers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "companyName" || name === "role") return;

    setNewUser({ ...newUser, [name]: value });

    if (name === "confirmpassword" || name === "password") {
      if (name === "confirmpassword" && value !== newUser.password) {
        setPasswordMatchError("Passwords do not match");
      } else if (name === "password" && newUser.confirmpassword && value !== newUser.confirmpassword) {
        setPasswordMatchError("Passwords do not match");
      } else {
        setPasswordMatchError("");
      }
    }

    if (name === "mobileNum") {
      const mobileRegex = /^\d{10}$/;
      if (!mobileRegex.test(value) && value !== "") {
        setMobileNumError("Mobile number must be exactly 10 digits");
      } else {
        setMobileNumError("");
      }
    }
  };

  const handleUserAction = async (email) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("Unauthorized. Please log in.");
        return;
      }

      const adminEmail = JwtUtil.extractEmail(token);
      if (!adminEmail) {
        toast.error("Failed to retrieve admin email.");
        return;
      }

      await axios.delete(`${API_BASE}/Admin/deleteCorporateUserByEmail/${email}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          role: "Admin",
          email: adminEmail,
        },
      });
      toast.success("Corporate user deactivated successfully!");
      setAllUsers(allUsers.filter((user) => user.email !== email));
    } catch (error) {
      console.error("Error deleting user:", error.response);
      toast.error(error.response?.data || "An error occurred. Please try again.");
    }
  };

  const handleSubmit = async () => {
    if (
      !newUser.companyName ||
      !newUser.email ||
      !newUser.password ||
      !newUser.confirmpassword ||
      !newUser.mobileNum
    ) {
      toast.error("All required fields must be filled!");
      return;
    }

    if (newUser.password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    if (newUser.password !== newUser.confirmpassword) {
      toast.error("Passwords do not match.");
      return;
    }

    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(newUser.mobileNum)) {
      toast.error("Mobile number must be exactly 10 digits");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("Unauthorized. Please log in.");
        return;
      }

      const adminEmail = JwtUtil.extractEmail(token);
      if (!adminEmail) {
        toast.error("Failed to retrieve admin email.");
        return;
      }

      const userExists = allUsers.some((user) => user.email === newUser.email);
      if (userExists) {
        toast.error("This employee is already registered!");
        return;
      }

      await axios.post(`${API_BASE}/Admin/addCorporateUser`, newUser, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          role: "Admin",
          email: adminEmail,
        },
      });
      toast.success("Corporate user added successfully!");
      fetchAllUsers();
      setNewUser((prev) => ({
        ...prev,
        employeeName: "",
        jobTitle: "",
        email: "",
        password: "",
        confirmpassword: "",
        mobileNum: "",
      }));
      setPasswordMatchError("");
      setMobileNumError("");
    } catch (error) {
      console.error("Error adding user:", error.response);
      toast.error(error.response?.data || "An error occurred. Please try again.");
    }
  };

  const fetchAllUsers = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("Unauthorized. Please log in.");
        return;
      }

      const adminEmail = JwtUtil.extractEmail(token);
      if (!adminEmail) {
        toast.error("Failed to retrieve admin email.");
        return;
      }

      const response = await axios.get(`${API_BASE}/Admin/getAllCorporateUsers`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          role: "Admin",
          email: adminEmail,
        },
      });
      setAllUsers(response.data.filter((user) => user.status !== 0));
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 dark:border-indigo-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <Navbar />
      <div className="max-w-7xl mx-auto mt-16">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white text-center mb-12 tracking-tight">
          Admin Dashboard
        </h1>

        {/* Add User Card */}
        <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8 mb-12 transform hover:scale-[1.01] transition-all duration-300">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Add New Corporate User
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.keys(newUser).map((field) => (
              <div key={field} className="relative group">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2 capitalize">
                  {field.replace(/([A-Z])/g, " $1").trim()}
                </label>
                <div className="relative">
                  <input
                    type={
                      field === "password" && showPassword
                        ? "text"
                        : field === "confirmpassword" && showConfirmPassword
                        ? "text"
                        : field.includes("password")
                        ? "password"
                        : "text"
                    }
                    name={field}
                    value={newUser[field]}
                    onChange={handleInputChange}
                    className="w-full p-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white transition-all duration-300 shadow-sm hover:shadow-md"
                    placeholder={`Enter ${field.replace(/([A-Z])/g, " $1").trim()}`}
                    readOnly={field === "companyName" || field === "role"}
                  />
                  {field === "password" && (
                    <button
                      type="button"
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-300 hover:text-blue-600 dark:hover:text-indigo-400 transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <IoEyeOffSharp size={22} /> : <IoEyeSharp size={22} />}
                    </button>
                  )}
                  {field === "confirmpassword" && (
                    <button
                      type="button"
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-300 hover:text-blue-600 dark:hover:text-indigo-400 transition-colors"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <IoEyeOffSharp size={22} /> : <IoEyeSharp size={22} />}
                    </button>
                  )}
                </div>
                {field === "confirmpassword" && passwordMatchError && (
                  <p className="text-red-500 text-sm mt-2 font-medium animate-pulse">{passwordMatchError}</p>
                )}
                {field === "mobileNum" && mobileNumError && (
                  <p className="text-red-500 text-sm mt-2 font-medium animate-pulse">{mobileNumError}</p>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-6 mt-10">
            <button
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              onClick={handleSubmit}
            >
              Activate User
            </button>
            <button
              className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-8 py-3 rounded-xl hover:from-teal-600 hover:to-cyan-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2"
              onClick={() => setViewUsers(!viewUsers)}
            >
              <IoEyeSharp size={22} />
              {viewUsers ? "Hide Users" : "View All Users"}
            </button>
          </div>
        </div>

        {/* Users Table */}
        {viewUsers && (
          <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8 transform hover:scale-[1.01] transition-all duration-300">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Corporate Users
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-gray-700 dark:to-gray-600">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Company
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Employee
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Job Title
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {allUsers.map((user, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-200 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">{user.companyName}</td>
                      <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">{user.employeeName}</td>
                      <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">{user.email}</td>
                      <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">{user.jobTitle}</td>
                      <td className="px-6 py-4">
                        <button
                          className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-6 py-2 rounded-xl hover:from-red-700 hover:to-pink-700 transition-all duration-300 font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-1"
                          onClick={() => handleUserAction(user.email)}
                        >
                          Delete User
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;