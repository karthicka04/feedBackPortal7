import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import {FaTachometerAlt, FaUserPlus, FaBuilding, FaFileUpload, FaUsers, FaFlag, FaEye, FaTimes, FaSpinner} from 'react-icons/fa';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./AdminPage.css"; 

const AdminPage = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("dashboard");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registerNo, setRegisterNo] = useState("");
  const [department, setDepartment] = useState("");
  const [batch, setBatch] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyLocation, setCompanyLocation] = useState("");
  const [companyLogo, setCompanyLogo] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [file, setFile] = useState(null);
  const [flaggedFeedbacks, setFlaggedFeedbacks] = useState([]);
 
  const [isLoadingFlags, setIsLoadingFlags] = useState(false); 

  const fileInputRef = useRef(null);
  const fileInputRef1 = useRef(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/recruiters");
        setCompanies(response.data);
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };
    fetchCompanies();
  }, []);

  useEffect(() => {
    if (activeSection === "flaggedFeedbacks") {
      fetchFlaggedFeedbacks();
    }
  }, [activeSection]);

  

  const fetchFlaggedFeedbacks = async () => {
    setIsLoadingFlags(true); 
    try {
      
      const response = await axios.get("http://localhost:5000/api/viewFeedback/flag");
      console.log("Flagged Feedbacks Data:", response.data); 
      setFlaggedFeedbacks(response.data);
    } catch (error) {
      console.error("Error fetching flagged feedbacks:", error);
      toast.error("Error loading flagged feedbacks ❌");
      setFlaggedFeedbacks([]); 
    } finally {
      setIsLoadingFlags(false); 
    }
  };

  

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/admin/add-user", { name, email, password, registerNo, department, batch });
      toast.success("User added successfully ✅");
      // Clear form
      setName(""); setEmail(""); setPassword(""); setRegisterNo(""); setDepartment(""); setBatch("");
    } catch (error) {
      console.error(error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Error adding user ❌");
    }
  };

  const handleAddCompany = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/admin/add-company", { name: companyName, location: companyLocation, logo: companyLogo });
      toast.success("Company added successfully ✅");
      // Clear form
      setCompanyName(""); setCompanyLocation(""); setCompanyLogo("");
    } catch (error) {
      console.error(error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Error adding company ❌");
    }
  };

  const handleBulkUpload = async (type) => {
    if (!selectedFile) {
      toast.error("Please select a file first ❗");
      return;
    }
    const formData = new FormData();
    formData.append("file", selectedFile);
    try {
      await axios.post(`http://localhost:5000/api/admin/bulk-upload/${type}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(`Bulk ${type} upload successful ✅`);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = ""; // Clear file input
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.response?.data?.message || `Error uploading ${type} file ❌`);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleFileChange1 = (e) => {
    setFile(e.target.files[0]);
  };

  const handleCompanyChange = (event) => {
    setSelectedCompany(event.target.value);
  };

  const handleUpload = async () => {
    if (!file || !selectedCompany) {
      toast.error("Please select a company and upload an Excel file.");
      return;
    }
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = async (e) => {
      try {
        const binaryStr = e.target.result;
        const workbook = XLSX.read(binaryStr, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet);

        const response = await axios.post("http://localhost:5000/api/attendees/upload-attendees", {
          companyId: selectedCompany,
          attendees: data,
        });
        if (response.status === 201) {
          toast.success("Attendees uploaded successfully!");
          setFile(null);
          setSelectedCompany("");
          if (fileInputRef1.current) fileInputRef1.current.value = ""; // Clear file input
        }
      } catch (error) {
        console.error("Error uploading attendees:", error);
        toast.error(error.response?.data?.message || "Failed to upload attendees.");
      }
    };
    reader.onerror = (error) => {
        console.error("File reading error:", error);
        toast.error("Failed to read the file.");
    };
  };

  const handleRemoveFlag = async (flagId, feedbackId) => {
    try {
      
        const response = await axios.delete(`http://localhost:5000/api/viewFeedback/flag/${flagId}`);
        
        if (response.data.success) {
           
            setFlaggedFeedbacks(prev => 
                prev.filter(item => item._id !== flagId)
            );
            
          
            toast.success(response.data.message);
           
        } else {
            toast.error(response.data.message || "Failed to unflag feedback");
        }
    } catch (error) {
        console.error("Error removing flag:", error);
        toast.error(error.response?.data?.message || "Failed to unflag feedback ❌");
    }
};
  const [stats, setStats] = useState({
    totalStudents: 0,
    departmentCounts: {},
    totalCompanies: 0,
    flaggedFeedbacksCount: 0,
    isLoadingStats: true
  });
  
  
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/admin/stats");
        console.log("Dashboard Stats:", response.data);
        setStats({
          totalStudents: response.data.totalStudents,
          departmentCounts: response.data.departmentCounts,
          totalCompanies: response.data.totalCompanies,
          flaggedFeedbacksCount: response.data.flaggedFeedbacksCount,
          isLoadingStats: false
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        toast.error("Failed to load dashboard statistics");
        setStats(prev => ({ ...prev, isLoadingStats: false }));
      }
    };
  
    if (activeSection === "dashboard") {
      fetchDashboardStats();
    }
  }, [activeSection]);
  
  
  

  return (
    <div className="admin-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h3>Admin Panel</h3>
        </div>
        <nav className="sidebar-nav">
          <button onClick={() => setActiveSection("dashboard")} className={activeSection === 'dashboard' ? 'active' : ''}>
            <FaTachometerAlt /> <span>Dashboard</span>
          </button>
          <button onClick={() => setActiveSection("addUser")} className={activeSection === 'addUser' ? 'active' : ''}>
            <FaUserPlus /> <span>Add User</span>
          </button>
          <button onClick={() => setActiveSection("addCompany")} className={activeSection === 'addCompany' ? 'active' : ''}>
            <FaBuilding /> <span>Add Company</span>
          </button>
          <button onClick={() => setActiveSection("bulkUpload")} className={activeSection === 'bulkUpload' ? 'active' : ''}>
            <FaFileUpload /> <span>Bulk Upload</span>
          </button>
          <button onClick={() => setActiveSection("AttendiesUpload")} className={activeSection === 'AttendiesUpload' ? 'active' : ''}>
            <FaUsers /> <span>Attendees Upload</span>
          </button>
          <button onClick={() => setActiveSection("flaggedFeedbacks")} className={activeSection === 'flaggedFeedbacks' ? 'active' : ''}>
            <FaFlag /> <span>Flagged Feedbacks</span>
          </button>
        </nav>
      </aside>

      <main className="content">
      {activeSection === "dashboard" && (
    <div className="content-section dashboard">
      <h2>Welcome to Admin Dashboard 🎉</h2>
      
      {stats.isLoadingStats ? (
        <div className="loading-container">
          <FaSpinner className="spinner" /> Loading statistics...
        </div>
      ) : (
        <div className="dashboard-stats">
          {/* Total Students Card */}
          <div className="stat-card student-card">
            <div className="stat-icon">
              <FaUsers />
            </div>
            <div className="stat-content">
              <h3>Total Students</h3>
              <p className="stat-value">{stats.totalStudents}</p>
            </div>
          </div>
  
         
          <div className="stat-card dept-card">
            <div className="stat-icon">
              <FaBuilding />
            </div>
            <div className="stat-content">
              <h3>Departments</h3>
              <div className="dept-breakdown">
                {Object.entries(stats.departmentCounts).map(([dept, count]) => (
                  <div key={dept} className="dept-item">
                    <span className="dept-name">{dept}</span>
                    <span className="dept-count">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
  
          <div className="stat-card company-card">
            <div className="stat-icon">
              <FaBuilding />
            </div>
            <div className="stat-content">
              <h3>Companies</h3>
              <p className="stat-value">{stats.totalCompanies}</p>
            </div>
          </div>
  
       
          <div className="stat-card flag-card">
            <div className="stat-icon">
              <FaFlag />
            </div>
            <div className="stat-content">
              <h3>Flagged Feedbacks</h3>
              <p className="stat-value">{stats.flaggedFeedbacksCount}</p>
              <button 
                onClick={() => setActiveSection("flaggedFeedbacks")}
                className="btn btn-small btn-view"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )}
        {activeSection === "addUser" && (
          <div className="content-section">
             <h2><FaUserPlus /> Add New User</h2>
            <form onSubmit={handleAddUser} className="admin-form">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input id="name" type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="form-group">
                 <label htmlFor="email">Email</label>
                <input id="email" type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input id="password" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <div className="form-group">
                 <label htmlFor="registerNo">Register Number</label>
                <input id="registerNo" type="text" placeholder="Register Number" value={registerNo} onChange={(e) => setRegisterNo(e.target.value)} required />
              </div>
              <div className="form-group">
                 <label htmlFor="department">Department</label>
                <input id="department" type="text" placeholder="Department" value={department} onChange={(e) => setDepartment(e.target.value)} required />
              </div>
              <div className="form-group">
                 <label htmlFor="batch">Batch</label>
                <input id="batch" type="text" placeholder="Batch (e.g., 2020-2024)" value={batch} onChange={(e) => setBatch(e.target.value)} required />
              </div>
              <button type="submit" className="btn btn-primary">Add User</button>
            </form>
          </div>
        )}

        {activeSection === "addCompany" && (
           <div className="content-section">
             <h2><FaBuilding /> Add New Company</h2>
            <form onSubmit={handleAddCompany} className="admin-form">
              <div className="form-group">
                 <label htmlFor="companyName">Company Name</label>
                <input id="companyName" type="text" placeholder="Company Name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
              </div>
               <div className="form-group">
                 <label htmlFor="companyLocation">Location</label>
                <input id="companyLocation" type="text" placeholder="Location (e.g., City, Country)" value={companyLocation} onChange={(e) => setCompanyLocation(e.target.value)} />
              </div>
               <div className="form-group">
                 <label htmlFor="companyLogo">Logo URL</label>
                <input id="companyLogo" type="text" placeholder="URL to company logo" value={companyLogo} onChange={(e) => setCompanyLogo(e.target.value)} />
              </div>
              <button type="submit" className="btn btn-primary">Add Company</button>
            </form>
          </div>
        )}

        {activeSection === "bulkUpload" && (
          <div className="content-section">
            <h2><FaFileUpload /> Bulk Upload (.xlsx)</h2>
            <div className="bulk-upload-container">
              <label htmlFor="bulk-file-input" className="file-input-label">
                {selectedFile ? selectedFile.name : "Choose Excel File..."}
              </label>
              <input
                 id="bulk-file-input"
                 className="file-input"
                 type="file"
                 accept=".xlsx, .xls"
                 onChange={handleFileChange}
                 ref={fileInputRef}
               />
              {selectedFile && <p className="file-selected-info">Selected: {selectedFile.name}</p>}
              <div className="upload-buttons">
                <button onClick={() => handleBulkUpload("users")} className="btn btn-secondary" disabled={!selectedFile}>
                   Upload Users
                 </button>
                <button onClick={() => handleBulkUpload("companies")} className="btn btn-secondary" disabled={!selectedFile}>
                  Upload Companies
                </button>
              </div>
            </div>
          </div>
        )}

        {activeSection === "AttendiesUpload" && (
           <div className="content-section">
             <h2><FaUsers /> Upload Attendees (.xlsx)</h2>
            <div className="attendees-upload-container">
               <div className="form-group">
                 <label htmlFor="company-select">Select Company</label>
                <select id="company-select" value={selectedCompany} onChange={handleCompanyChange} className="company-select" required>
                  <option value="" disabled>-- Select a company --</option>
                  {companies.map((company) => (
                    <option key={company._id} value={company._id}>{company.name}</option>
                  ))}
                </select>
              </div>
               <div className="form-group">
                <label htmlFor="attendee-file-input" className="file-input-label">
                    {file ? file.name : "Choose Excel File..."}
                 </label>
                <input
                  id="attendee-file-input"
                  className="file-input"
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleFileChange1}
                  ref={fileInputRef1}
                 />
                 {file && <p className="file-selected-info">Selected: {file.name}</p>}
              </div>
              <button onClick={handleUpload} className="btn btn-primary" disabled={!file || !selectedCompany}>
                Upload Attendees
              </button>
            </div>
          </div>
        )}

        {activeSection === "flaggedFeedbacks" && (
          <div className="content-section">
            <h2><FaFlag /> Flagged Feedbacks</h2>
            {isLoadingFlags ? (
              <div className="loading-container">
                <FaSpinner className="spinner" /> Loading flagged feedbacks...
              </div>
            ) : flaggedFeedbacks.length > 0 ? (
               <ul className="flagged-list">
                {flaggedFeedbacks.map((flaggedItem) => {
                  // Ensure nested data exists before trying to access it
                  const feedback = flaggedItem.feedbackId;
                  const user = feedback?.userId; // User who *posted* the feedback

                  if (!feedback) {
                    console.warn("Flagged item missing feedback data:", flaggedItem);
                    return (
                       <li key={flaggedItem._id} className="feedback-card error">
                         <p>Error: Associated feedback data missing.</p>
                       </li>
                     );
                  }

                   // You might want details about the user who *flagged* it too,
                   // if your FlagedSchema's userId refers to the flagger (assuming it references 'User')
                   // const flagger = flaggedItem.userId; // Requires population on backend

                   return (
                     <li key={flaggedItem._id} className="feedback-card">
                       <div className="feedback-card-header">
                         <div className="user-info">
                            {/* Display user who WROTE the feedback */}
                            <span className="user-name">{user?.name ?? 'Unknown User'}</span>
                            <span className="user-dept">{user?.department ?? 'No Department'}</span>
                          </div>
                          <div className="company-info-inline">
                             <span className="company-name">🏢 {feedback.companyName ?? 'N/A'}</span>
                             <span className="company-location">📍 {feedback.companyLocation ?? 'N/A'}</span>
                          </div>
                       </div>

                       {/* Maybe show a snippet of feedback text if available */}
                       {/* <p className="feedback-snippet">{feedback.textSnippet || 'No preview available'}</p> */}

                       <div className="feedback-card-actions">
                         <button
                          onClick={() => navigate(`/feedback/${feedback._id}`)}
                          className="btn btn-small btn-view"
                          title="View Full Feedback"
                         >
                           <FaEye /> View
                         </button>
                         <button
                           onClick={() => handleRemoveFlag(flaggedItem._id, feedback._id)} 
                           className="btn btn-small btn-danger"
                           title="Remove Flag"
                         >
                           <FaTimes /> Unflag
                         </button>
                       </div>
                     </li>
                   );
                })}
              </ul>
            ) : (
              <p className="no-data-message">No feedbacks have been flagged yet.</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPage;