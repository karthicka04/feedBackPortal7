import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ViewFeedback from "./ViewFeedback";
import Form from "./Form";
import "./CompanyFeedbackPage.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const CompanyFeedbackPage = () => {
    const { companyId } = useParams();
    const [activeTab, setActiveTab] = useState("view");
    const [companyName, setCompanyName] = useState("");
    const [companyLocation, setCompanyLocation] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCompanyData = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/recruiters/company/${companyId}`);
                if (response.status !== 200) throw new Error("Failed to fetch company data");
                
                setCompanyName(response.data.name);
                setCompanyLocation(response.data.location);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching company data:", err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchCompanyData();
    }, [companyId]);

    if (loading) return <div className="loading-spinner"></div>;
    if (error) return <div className="error-message">Error: {error}</div>;

    return (
        <div className="company-feedback-container">
            <header className="company-header">
                <h1>{companyName}</h1>
                <p className="company-location">{companyLocation}</p>
            </header>

            <div className="feedback-tabs">
                <button
                    className={`tab-button ${activeTab === "view" ? "active" : ""}`}
                    onClick={() => setActiveTab("view")}
                >
                    View Feedback
                </button>
                <button
                    className={`tab-button ${activeTab === "post" ? "active" : ""}`}
                    onClick={() => setActiveTab("post")}
                >
                    Post Feedback
                </button>
            </div>

            <div className="tab-content">
                {activeTab === "view" ? (
                    <ViewFeedback companyId={companyId} />
                ) : (
                    <Form 
                        companyId={companyId} 
                        initialCompanyName={companyName} 
                        initialCompanyLocation={companyLocation} 
                    />
                )}
            </div>
        </div>
    );
};

export default CompanyFeedbackPage;