import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Profile.css';
import { FaUserEdit, FaBell, FaCommentAlt, FaBookmark, FaEdit, FaSave, FaTimes,FaLock, FaChevronRight } from 'react-icons/fa';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Profile = () => {
    const [user, setUser] = useState(null);
    const [feedbackList, setFeedbackList] = useState([]);
    const [savedFeedbacks, setSavedFeedbacks] = useState([]);
    const [selectedSection, setSelectedSection] = useState('profile');
    const [editMode, setEditMode] = useState(false);
    const [profileData, setProfileData] = useState({});
    const [changePassword, setChangePassword] = useState(false);

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const loggedInUser = JSON.parse(localStorage.getItem("currentUser"));
        if (!loggedInUser) {
            window.location.href = '/login';
            return;
        }
        setUser(loggedInUser);
        setProfileData(loggedInUser);

        const fetchUserFeedback = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/feedback?userId=${loggedInUser._id}`);
                setFeedbackList(response.data || []);
            } catch (error) {
                console.error('Error fetching feedback:', error);
            }
        };

        fetchUserFeedback();
    }, []);

    useEffect(() => {
        if (user) {
            const fetchSavedFeedbacks = async () => {
                try {
                    console.log('Frontend User ID:', user._id);
                    const userId = user._id.toString();
                    const response = await axios.get(`${API_BASE_URL}/api/viewFeedback/bookmark/${userId}`);
                    console.log("Saved Feedbacks API Response:", response.data);
                    setSavedFeedbacks(Array.isArray(response.data) ? response.data : []);
                } catch (error) {
                    console.error("Error fetching saved feedbacks:", error);
                }
            };
    
            fetchSavedFeedbacks();
        }
    }, [user]);


    if (!user) return <div>Loading...</div>;

    const getInitials = (name) => {
        if (!name) return '';
        const nameParts = name.split(' ');
        let initials = '';
        for (let i = 0; i < Math.min(2, nameParts.length); i++) {
            initials += nameParts[i].charAt(0).toUpperCase();
        }
        return initials;
    };

    const initials = getInitials(user.name);

    const handleSectionClick = (section) => {
        setSelectedSection(section);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    const handleStartEdit = () => {
        setEditMode(true);
    };

    const handleCancelEdit = () => {
        setEditMode(false);
        setProfileData(user);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`${API_BASE_URL}/api/auth/${user._id}`, profileData);

            if (response.status === 200) {
                localStorage.setItem("currentUser", JSON.stringify(response.data.user));
                setUser(response.data.user);
                setEditMode(false);
                alert('Profile updated successfully!');
            } else {
                console.error("Update failed:", response.status, response.data);
                alert('Failed to update profile.');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            if (error.response) {
                console.error("Server responded with error:", error.response.data);
                console.error("Status code:", error.response.status);
                alert(`Update failed: ${error.response.data.error || 'An error occurred'}`);
            } else if (error.request) {
                console.error("No response received:", error.request);
                alert('Update failed: No response from server.');
            } else {
                console.error('Error setting up the request:', error.message);
                alert(`Update failed: ${error.message}`);
            }
        }
    };

    const handlePasswordChangeClick = () => {
        setChangePassword(true);
    };

    const handleCancelPasswordChange = () => {
        setChangePassword(false);
        setNewPassword('');
        setConfirmPassword('');
        setPasswordError('');
    };

    const validatePassword = () => {
        if (newPassword.length < 6) {
            setPasswordError('Password must be at least 6 characters long.');
            return false;
        }
        if (newPassword !== confirmPassword) {
            setPasswordError('Passwords do not match.');
            return false;
        }
        setPasswordError('');
        return true;
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();

        if (!validatePassword()) {
            return;
        }

        try {
            const response = await axios.put(`${API_BASE_URL}/api/auth/${user._id}`, {
                ...profileData,
                password: newPassword
            });

            if (response.status === 200) {
                localStorage.setItem("currentUser", JSON.stringify(response.data.user));
                setUser(response.data.user);
                setEditMode(false);
                setChangePassword(false);
                setNewPassword('');
                setConfirmPassword('');
                alert('Password updated successfully!');
            } else {
                alert('Failed to update password.');
            }
        } catch (error) {
            console.error('Error updating password:', error);
            alert('Error updating password.');
        }
    };

    const renderContent = () => {
        switch (selectedSection) {
            case 'profile':
                return (
                    <div className="profile-details">
                        
                        {editMode ? (
                            <form onSubmit={handleSubmit} className="edit-profile-form">
                                <div className="form-group">
                                    <label htmlFor="name">Name:</label>
                                    <input type="text" id="name" name="name" value={profileData.name || ''} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email:</label>
                                    <input type="email" id="email" name="email" value={profileData.email || ''} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="registerNo">Register No:</label>
                                    <input type="text" id="registerNo" name="registerNo" value={profileData.registerNo || ''} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="department">Department:</label>
                                    <input type="text" id="department" name="department" value={profileData.department || ''} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="batch">Batch:</label>
                                    <input type="text" id="batch" name="batch" value={profileData.batch || ''} onChange={handleInputChange} />
                                </div>

                                <div className="edit-buttons">
                                    <button type="submit" className="save-button">
                                        <FaSave style={{ marginRight: '5px' }} /> Save
                                    </button>
                                    <button type="button" className="cancel-button" onClick={handleCancelEdit}>
                                        <FaTimes style={{ marginRight: '5px' }} /> Cancel
                                    </button>
                                </div>
                                <button type="button" onClick={handlePasswordChangeClick}>
                                    Change Password
                                </button>
                            </form>
                        ) : (
                            <div className="profile-text">
                                <p><span>Name:</span> {user.name}</p>
                                <p><span>Email:</span> {user.email}</p>
                                <p><span>Register No:</span> {user.registerNo}</p>
                                <p><span>Department:</span> {user.department}</p>
                                <p><span>Batch:</span> {user.batch}</p>
                                <FaEdit className="edit-icon" onClick={handleStartEdit} />
                            </div>
                        )}

                        {changePassword && (
                            <div className="change-password-modal">
                                <h3>Change Password</h3>
                                <form onSubmit={handlePasswordUpdate}>
                                    <div className="form-group">
                                        <label htmlFor="newPassword">New Password:</label>
                                        <input
                                            type="password"
                                            id="newPassword"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="confirmPassword">Confirm Password:</label>
                                        <input
                                            type="password"
                                            id="confirmPassword"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                    </div>
                                    {passwordError && <p className="error">{passwordError}</p>}
                                    <div className="edit-buttons">
                                        <button type="submit" className="save-button">Update Password</button>
                                        <button type="button" className="cancel-button" onClick={handleCancelPasswordChange}>Cancel</button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                );
            case 'feedback':
                return (
                    <div className="feedback-section">
                        <h3>Your Feedback:</h3>
                        {feedbackList.length > 0 ? (
                            <ul className="feedback-list">
                                {feedbackList.map((feedback) => (
                                    <li key={feedback._id}>
                                        <div className="feedback-text">
                                            <span className="company">{feedback.companyName}</span>
                                            <span className="role">{feedback.role}</span>
                                        </div>
                                        <FaEdit className="edit-icon" onClick={() => navigate(`/editfeedback/${feedback._id}`)} />
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="no-feedback">No feedback submitted yet.</p>
                        )}
                    </div>
                );
            case 'saved':
                return (
                    <div className="feedback-section">
                        <h3>Your Saved Feedbacks:</h3>
                        {savedFeedbacks.length > 0 ? (
                            <ul className="saved-list">
                                {savedFeedbacks.map((feedback) => (
                                    <div key={feedback._id} className="feedback-card">
                                                <div className="feedback-header">
                                                  <div className="profile-icon">{feedback.name.charAt(0).toUpperCase()}</div>
                                                  <div className="user-info">
                                                    <p className="user-name">{feedback.name}</p>
                                                    <p className="user-details">
                                                      {feedback.rollNumber} | {feedback.department}
                                                    </p>
                                                  </div>
                                                </div>
                                    
                                                <div className="company-info">
                                                  <p><strong>🏢 Company:</strong> {feedback.companyName}</p>
                                                  <p><strong>📍 Location:</strong> {feedback.companyLocation}</p>
                                                </div>
                                    
                                               
                                                <button onClick={() => navigate(`/feedback/${feedback._id}`)} className="view-feedback-btn">
                                                  View Full Feedback →
                                                </button>
                                              </div>
                                ))}
                            </ul>
                        ) : (
                            <p className="no-saved">No saved feedback</p>
                        )}
                    </div>
                );
            case 'notifications':
                return (
                    <div>
                        <h3>Your Notifications</h3>
                    </div>
                );
            default:
                return null; // Or a default content
        }
    };

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h2>Welcome back, {user?.name.split(' ')[0]}!</h2>
                <p>Manage your profile and activities</p>
            </div>
            <div className="profile-layout">
                <div className="sidebar">
                    <div className="user-info-sidebar">
                        <div className="sidebar-avatar">{initials}</div>
                        <div className="sidebar-user-details">
                            <h4>{user?.name}</h4>
                            <p>{user?.email}</p>
                        </div>
                    </div>
                    <ul>
                        <li onClick={() => handleSectionClick('profile')} className={selectedSection === 'profile' ? 'active' : ''}>
                            <div className="sidebar-item-content">
                                <FaUserEdit className="sidebar-icon" />
                                <span>Edit Profile</span>
                            </div>
                            <FaChevronRight className="sidebar-arrow" />
                        </li>
                        <li onClick={() => handleSectionClick('notifications')} className={selectedSection === 'notifications' ? 'active' : ''}>
                            <div className="sidebar-item-content">
                                <FaBell className="sidebar-icon" />
                                <span>Notifications</span>
                            </div>
                            <FaChevronRight className="sidebar-arrow" />
                        </li>
                        <li onClick={() => handleSectionClick('feedback')} className={selectedSection === 'feedback' ? 'active' : ''}>
                            <div className="sidebar-item-content">
                                <FaCommentAlt className="sidebar-icon" />
                                <span>Posted Feedbacks</span>
                            </div>
                            <FaChevronRight className="sidebar-arrow" />
                        </li>
                        <li onClick={() => handleSectionClick('saved')} className={selectedSection === 'saved' ? 'active' : ''}>
                            <div className="sidebar-item-content">
                                <FaBookmark className="sidebar-icon" />
                                <span>Saved Feedbacks</span>
                            </div>
                            <FaChevronRight className="sidebar-arrow" />
                        </li>
                    </ul>
                </div>
                <div className="content-area">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};
export default Profile;