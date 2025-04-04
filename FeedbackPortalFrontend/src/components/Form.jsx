import React, { useState, useEffect } from 'react';
import './Form.css';
import { FaUser, FaIdCard, FaBuilding, FaMapMarkerAlt, FaBriefcase, FaCalendarAlt, FaCode, FaCommentAlt, FaCheckCircle, FaPlusCircle, FaMinusCircle } from 'react-icons/fa';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Form = ({ companyId, initialCompanyName, initialCompanyLocation }) => {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user || !user._id) {
      console.warn("User not logged in or invalid user data. Redirecting to login.");
      window.location.href = '/login';
      return;
    }
  }, [user]);

  const [formData, setFormData] = useState({
    name: '',
    rollNumber: '',
    department: '',
    companyName: initialCompanyName || '',
    companyLocation: initialCompanyLocation || '',
    role: '',
    placementType: '',
    totalRounds: 0,
    rounds: [],
    additionalDetails: '',
    tips: '',
    month: '',
    year: '',
    preparationTime: '',
    skillsUsed: '',
    privacyAgreement: false,
  });

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      companyName: initialCompanyName || '',
      companyLocation: initialCompanyLocation || ''
    }));
  }, [initialCompanyName, initialCompanyLocation]);

  const roundTypes = [
    'Aptitude',
    'Programming',
    'Advanced Programming',
    'Technical HR',
    'General HR',
    'Behavioral',
    'Managerial',
    'System Design',
    'Machine Learning',
    'Other'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleRoundChange = (e, roundIndex) => {
    const { name, value } = e.target;
    const updatedRounds = [...formData.rounds];
    updatedRounds[roundIndex] = {
      ...updatedRounds[roundIndex],
      [name]: value
    };
    setFormData(prev => ({ ...prev, rounds: updatedRounds }));
  };

  useEffect(() => {
    if (formData.totalRounds > 0) {
      const newRounds = [...formData.rounds];
      while (newRounds.length < formData.totalRounds) {
        newRounds.push({ roundName: '', questions: [''] });
      }
      while (newRounds.length > formData.totalRounds) {
        newRounds.pop();
      }
      setFormData(prev => ({ ...prev, rounds: newRounds }));
    } else {
      setFormData(prev => ({ ...prev, rounds: [] }));
    }
  }, [formData.totalRounds]);

  const handleQuestionsChange = (e, roundIndex, questionIndex) => {
    const { value } = e.target;
    const updatedRounds = [...formData.rounds];
    updatedRounds[roundIndex].questions[questionIndex] = value;
    setFormData(prev => ({ ...prev, rounds: updatedRounds }));
  };

  const handleAddQuestion = (roundIndex) => {
    const updatedRounds = [...formData.rounds];
    updatedRounds[roundIndex].questions.push('');
    setFormData(prev => ({ ...prev, rounds: updatedRounds }));
  };

  const handleRemoveQuestion = (roundIndex, questionIndex) => {
    const updatedRounds = [...formData.rounds];
    updatedRounds[roundIndex].questions.splice(questionIndex, 1);
    setFormData(prev => ({ ...prev, rounds: updatedRounds }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.privacyAgreement) {
      alert('Please accept the privacy agreement to submit.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userId: user._id,
          companyId: companyId,
        }),
      });

      if (response.ok) {
        alert('Thank you for your feedback!');
        setFormData({
          name: '',
          rollNumber: '',
          department: '',
          companyName: initialCompanyName || '',
          companyLocation: initialCompanyLocation || '',
          role: '',
          placementType: '',
          totalRounds: 0,
          rounds: [],
          additionalDetails: '',
          tips: '',
          month: '',
          year: '',
          preparationTime: '',
          skillsUsed: '',
          privacyAgreement: false,
        });
      } else {
        alert('Failed to submit feedback. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateRoundInputs = () => {
    return formData.rounds.map((round, i) => (
      <div key={i} className="round-section">
        <h3 className="round-title">Round {i + 1}</h3>
        
        <div className="form-group">
          <label>
            <span className="input-label">Round Type</span>
            <select
              name="roundName"
              value={round.roundName || ''}
              onChange={(e) => handleRoundChange(e, i)}
              required
            >
              <option value="">Select Round Type</option>
              {roundTypes.map((type, idx) => (
                <option key={idx} value={type}>{type}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="questions-section">
          <h4 className="questions-title">Questions Asked:</h4>
          {round.questions.map((question, qIndex) => (
            <div key={qIndex} className="question-group">
              <label>
                <span className="input-label">Question {qIndex + 1}</span>
                <div className="question-input-container">
                  <input
                    type="text"
                    value={question}
                    onChange={(e) => handleQuestionsChange(e, i, qIndex)}
                    placeholder={`Enter question ${qIndex + 1}`}
                    required
                  />
                  {qIndex > 0 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveQuestion(i, qIndex)}
                      className="remove-question-button"
                      title="Remove question"
                    >
                      <FaMinusCircle />
                    </button>
                  )}
                </div>
              </label>
            </div>
          ))}
          <button
            type="button"
            onClick={() => handleAddQuestion(i)}
            className="add-question-button"
          >
            <FaPlusCircle /> Add Question
          </button>
        </div>
      </div>
    ));
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <h1 className="form-title">
          <span className="form-icon">📝</span>Placement Feedback
        </h1>
        <p className="form-subtitle">Share your interview experience to help others</p>

        <form onSubmit={handleSubmit} className="feedback-form">
         
          <div className="form-section">
            <h2 className="section-title">
              <FaUser className="section-icon" />Personal Information
            </h2>
            <div className="form-grid">
              <div className="form-group">
                <label>
                  <span className="input-label">Full Name</span>
                  <div className="input-with-icon">
                    <FaUser className="input-icon" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="       Your full name"
                      required
                    />
                  </div>
                </label>
              </div>

              <div className="form-group">
                <label>
                  <span className="input-label">Roll Number</span>
                  <div className="input-with-icon">
                    <FaIdCard className="input-icon" />
                    <input
                      type="text"
                      name="rollNumber"
                      value={formData.rollNumber}
                      onChange={handleChange}
                      placeholder="    Your roll number"
                      required
                    />
                  </div>
                </label>
              </div>

              <div className="form-group">
                <label>
                  <span className="input-label">Department</span>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Department</option>
                    <option value="CSE">Computer Science</option>
                    <option value="IT">Information Technology</option>
                    <option value="AIDS">AI & Data Science</option>
                    <option value="EEE">Electrical Engineering</option>
                    <option value="ECE">Electronics Engineering</option>
                    <option value="MECH">Mechanical Engineering</option>
                    <option value="CIVIL">Civil Engineering</option>
                  </select>
                </label>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2 className="section-title">
              <FaBuilding  className="section-icon" /> Company Information
            </h2>
            <div className="form-grid">
              <div className="form-group">
                <label>
                  <span className="input-label">Company Name</span>
                  <div className="input-with-icon">
                    <FaBuilding className="input-icon" />
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      placeholder="      Company name"
                      required
                    />
                  </div>
                </label>
              </div>

              <div className="form-group">
                <label>
                  <span className="input-label">Company Location</span>
                  <div className="input-with-icon">
                    <FaMapMarkerAlt className="input-icon" />
                    <input
                      type="text"
                      name="companyLocation"
                      value={formData.companyLocation}
                      onChange={handleChange}
                      placeholder="Company location"
                      required
                    />
                  </div>
                </label>
              </div>

              <div className="form-group">
                <label>
                  <span className="input-label">Role/Position</span>
                  <div className="input-with-icon">
                    <FaBriefcase className="input-icon" />
                    <input
                      type="text"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      placeholder="        Your role"
                      required
                    />
                  </div>
                </label>
              </div>

              <div className="form-group">
                <label>
                  <span className="input-label">Placement Type</span>
                  <select
                    name="placementType"
                    value={formData.placementType}
                    onChange={handleChange}
                    required
                  >
                  <option value="">Select type</option>
                  <option value="Internship">Internship</option>
                  <option value="Full-time">Full-time</option>
                  </select>
                </label>
              </div>
            </div>
          </div>

          
          <div className="form-section">
            <h2 className="section-title">
              <FaCalendarAlt className="section-icon" /> Interview Timeline
            </h2>
            <div className="form-grid">
              <div className="form-group">
                <label>
                  <span className="input-label">Month</span>
                  <select
                    name="month"
                    value={formData.month}
                    onChange={handleChange}
                    required
                  >
                  <option value="">Select Month</option>
                  <option value="January">January</option>
                  <option value="February">February</option>
                  <option value="March">March</option>
                  <option value="April">April</option>
                  <option value="May">May</option>
                  <option value="June">June</option>
                  <option value="July">July</option>
                  <option value="August">August</option>
                  <option value="September">September</option>
                  <option value="October">October</option>
                  <option value="November">November</option>
                    <option value="December">December</option>
                  </select>
                </label>
              </div>

              <div className="form-group">
                <label>
                  <span className="input-label">Year</span>
                  <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    placeholder="2023"
                    min="2000"
                    max="2030"
                    required
                  />
                </label>
              </div>

              <div className="form-group">
                <label>
                  <span className="input-label">Total Rounds</span>
                  <input
                    type="number"
                    name="totalRounds"
                    value={formData.totalRounds}
                    onChange={handleChange}
                    min="1"
                    max="10"
                    required
                  />
                </label>
              </div>
            </div>
          </div>

        
          {formData.totalRounds > 0 && (
            <div className="form-section">
              <h2 className="section-title">
                <FaCode className="section-icon" /> Interview Rounds
              </h2>
              {generateRoundInputs()}
            </div>
          )}

         
          <div className="form-section">
            <h2 className="section-title">
              <FaCommentAlt className="section-icon" /> Additional Information
            </h2>
            <div className="form-group">
              <label>
                <span className="input-label">Skills Used</span>
                <div className="input-with-icon">
                  <FaCode className="input-icon" />
                  <input
                    type="text"
                    name="skillsUsed"
                    value={formData.skillsUsed}
                    onChange={handleChange}
                    placeholder="          e.g., Java, Data Structures, Algorithms"
                  />
                </div>
              </label>
            </div>

            <div className="form-group">
              <label>
                <span className="input-label">Additional Details</span>
                <textarea
                  name="additionalDetails"
                  value={formData.additionalDetails}
                  onChange={handleChange}
                  placeholder="          Describe your interview experience..."
                  rows="4"
                ></textarea>
              </label>
            </div>

            <div className="form-group">
              <label>
                <span className="input-label">Tips for Future Candidates</span>
                <textarea
                  name="tips"
                  value={formData.tips}
                  onChange={handleChange}
                  placeholder="          Share advice for future applicants..."
                  rows="4"
                ></textarea>
              </label>
            </div>
          </div>

          
          <div className="form-section">
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="privacyAgreement"
                  checked={formData.privacyAgreement}
                  onChange={handleChange}
                  required
                />
                <span className="checkmark"></span>
                <span className="checkbox-text">
                  I agree that my feedback can be shared anonymously for educational purposes
                </span>
              </label>
            </div>
          </div>

         
          <div className="form-actions">
            <button type="submit" className="submit-button" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="spinner"></span> Submitting...
                </>
              ) : (
                <>
                  <FaCheckCircle className="button-icon" /> Submit Feedback
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Form;