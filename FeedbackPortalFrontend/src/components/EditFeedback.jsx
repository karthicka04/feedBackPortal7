import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './Form.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const EditFeedback = () => {
    const { feedbackId } = useParams();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("currentUser"));
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        rollNumber: '',
        department: '',
        companyName: '',
        companyLocation: '',
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
        if (!user || !user._id) {
            console.warn("User not logged in or invalid user data. Redirecting to login.");
            window.location.href = '/login';
            return;
        }

        const fetchFeedbackData = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/feedback/${feedbackId}`);
                // Initialize rounds with empty arrays if they don't exist
                const feedbackData = response.data;
                if (!feedbackData.rounds) {
                    feedbackData.rounds = [];
                }
                setFormData(feedbackData);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching feedback data:", error);
                setIsLoading(false);
            }
        };

        fetchFeedbackData();
    }, [feedbackId]);

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
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleRoundChange = (e, roundIndex) => {
        const { name, value } = e.target;
        setFormData(prevFormData => {
            const updatedRounds = [...prevFormData.rounds];
            if (!updatedRounds[roundIndex]) {
                updatedRounds[roundIndex] = {};
            }
            updatedRounds[roundIndex] = { ...updatedRounds[roundIndex], [name]: value };
            return { ...prevFormData, rounds: updatedRounds };
        });
    };

    useEffect(() => {
        // Ensure that the 'rounds' array has the correct number of elements based on 'totalRounds'
        if (formData.totalRounds > formData.rounds.length) {
            const newRounds = [...formData.rounds];
            for (let i = formData.rounds.length; i < formData.totalRounds; i++) {
                newRounds.push({ roundName: '', questions: [] }); // Initialize questions to []
            }
            setFormData(prevFormData => ({ ...prevFormData, rounds: newRounds }));
        }
    }, [formData.totalRounds]);

    const handleQuestionsChange = (e, roundIndex, questionIndex) => {
        const { value } = e.target;
        setFormData(prevFormData => {
            const updatedRounds = [...prevFormData.rounds];
            if (!updatedRounds[roundIndex]) {
                updatedRounds[roundIndex] = { questions: [] }; // Initialize questions to []
            }
            if (!updatedRounds[roundIndex].questions) {
                updatedRounds[roundIndex].questions = []; // Ensure questions array exists
            }
            const updatedQuestions = [...updatedRounds[roundIndex].questions];
            updatedQuestions[questionIndex] = value;
            updatedRounds[roundIndex].questions = updatedQuestions;
            return { ...prevFormData, rounds: updatedRounds };
        });
    };

    const handleAddQuestion = (roundIndex) => {
        setFormData(prevFormData => {
            const updatedRounds = [...prevFormData.rounds];
            if (!updatedRounds[roundIndex]) {
                updatedRounds[roundIndex] = { questions: [] }; // Initialize questions to []
            }
            if (!updatedRounds[roundIndex].questions) {
                updatedRounds[roundIndex].questions = []; // Ensure questions array exists
            }
            updatedRounds[roundIndex].questions = [...updatedRounds[roundIndex].questions, ''];
            return { ...prevFormData, rounds: updatedRounds };
        });
    };

    const handleRemoveQuestion = (roundIndex, questionIndex) => {
        setFormData(prevFormData => {
            const updatedRounds = [...prevFormData.rounds];
            updatedRounds[roundIndex].questions.splice(questionIndex, 1);
            return { ...prevFormData, rounds: updatedRounds };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.privacyAgreement) {
            alert('Please accept the privacy agreement to submit.');
            return;
        }

        setIsLoading(true);
        try {
            await axios.put(`${API_BASE_URL}/api/feedback/${feedbackId}`, formData);

            alert('Feedback updated successfully!');
            navigate('/profile');
        } catch (error) {
            console.error('Error updating feedback:', error);
            alert('An error occurred while updating feedback. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const generateRoundInputs = () => {
        const roundInputs = [];
        for (let i = 0; i < formData.totalRounds; i++) {
            const round = formData.rounds[i] || { roundName: '', questions: [] }; // Ensure round exists

            roundInputs.push(
                <div key={i}>
                    <h3>Round {i + 1}</h3>
                    <label>
                        Round Name:
                        <select
                            name="roundName"
                            value={round.roundName || ''}
                            onChange={(e) => handleRoundChange(e, i)}
                            required
                        >
                            <option value="">Select Round Type</option>
                            {roundTypes.map((roundType, index) => (
                                <option key={index} value={roundType}>
                                    {roundType}
                                </option>
                            ))}
                        </select>
                    </label>

                    <h4>Questions Asked in Round {i + 1}:</h4>
                    {(round.questions || []).map((question, questionIndex) => (
                        <div key={questionIndex}>
                            <label>
                                Question {questionIndex + 1}:
                                <input
                                    type="text"
                                    value={question || ''}
                                    onChange={(e) => handleQuestionsChange(e, i, questionIndex)}
                                    placeholder={`Enter Question ${questionIndex + 1}`}
                                    required
                                />
                            </label>
                            {questionIndex > 0 && (
                                <button type="button" onClick={() => handleRemoveQuestion(i, questionIndex)}>
                                    Remove Question
                                </button>
                            )}
                        </div>
                    ))}
                    {round.questions && (
                        <button
                            type="button"
                            onClick={() => handleAddQuestion(i)}
                            style={{ fontSize: '20px', padding: '5px 10px', border: '1px solid #000' }}
                        >
                            Add another question
                        </button>
                    )}
                </div>
            );
        }
        return roundInputs;
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <form onSubmit={handleSubmit} className={'feedback-form'}>
            <h2>Edit Placement Feedback</h2>
            <label>
                Name:
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    required
                />
            </label>
            <label>
                Roll Number:
                <input
                    type="text"
                    name="rollNumber"
                    value={formData.rollNumber}
                    onChange={handleChange}
                    placeholder="Enter your roll number"
                    required
                />
            </label>

            {/* Department Dropdown */}
            <label>
                Department:
                <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select Department</option>
                    <option value="CSE">CSE</option>
                    <option value="IT">IT</option>
                    <option value="AIDS">AIDS</option>
                    <option value="EEE">EEE</option>
                    <option value="ECE">ECE</option>
                    <option value="MECH">MECH</option>
                    <option value="CIVIL">CIVIL</option>
                </select>
            </label>
            <label>
                Company Name:
                <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="Enter the company name"
                    required
                />
            </label>

            <label>
                Company Location:
                <input
                    type="text"
                    name="companyLocation"
                    value={formData.companyLocation}
                    onChange={handleChange}
                    placeholder="Enter the company location"
                    required
                />
            </label>

            <label>
                Role/Position:
                <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    placeholder="Enter the role (e.g., Software Developer)"
                    required
                />
            </label>
            <label>
                Placement Type:
                <select name="placementType" value={formData.placementType} onChange={handleChange} required>
                    <option value="">Select placement type</option>
                    <option value="Internship">Internship</option>
                    <option value="Full-time">Full-time</option>
                </select>
            </label>

            {/* Month and Year of Placement */}
            <label>
                Month of Placement:
                <select name="month" value={formData.month} onChange={handleChange} required>
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
            <label>
                Year of Placement:
                <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    placeholder="Enter year (e.g., 2025)"
                    required
                />
            </label>

            {/* Total Rounds Input */}
            <label>
                Total Number of Rounds:
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
            {formData.totalRounds > 0 && generateRoundInputs()}

            <label>
                Skills Used:
                <input
                    type="text"
                    name="skillsUsed"
                    value={formData.skillsUsed}
                    onChange={handleChange}
                    placeholder="Skills you used in the interview (e.g., Java, Data Structures)"
                />
            </label>

            <label>
                Additional Details (optional):
                <textarea
                    name="additionalDetails"
                    value={formData.additionalDetails}
                    onChange={handleChange}
                    placeholder="Provide additional context or experience details..."
                ></textarea>
            </label>
            <label>
                Tips for Future Candidates (optional):
                <textarea
                    name="tips"
                    value={formData.tips}
                    onChange={handleChange}
                    placeholder="Share advice for future candidates..."
                ></textarea>
            </label>

            <label>
                <input
                    type="checkbox"
                    name="privacyAgreement"
                    checked={formData.privacyAgreement}
                    onChange={handleChange}
                    required
                />
                I agree that my feedback can be shared anonymously for educational purposes.
            </label>

            <button type="submit" disabled={isLoading}>
                {isLoading ? 'Updating...' : 'Update Feedback'}
            </button>
        </form>
    );
};

export default EditFeedback;