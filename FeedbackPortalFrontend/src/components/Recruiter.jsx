import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Recruiters.css";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaBuilding, FaMapMarkerAlt } from "react-icons/fa";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const Recruiters = () => {
    const [companies, setCompanies] = useState([]);
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/recruiters`);
                setCompanies(response.data);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching companies:", error);
                setIsLoading(false);
            }
        };
        fetchCompanies();
    }, []);

    const handleCompanyClick = (companyId) => {
        navigate(`/company/${companyId}`);
    };

    const filteredCompanies = companies.filter(company => 
        company.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="recruiters-container">
            <div className="recruiters-header">
                <h1 className="title">Top Recruiters</h1>
                <p className="subtitle">Browse through our Recruiters</p>
                
                <div className="search-container">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        className="search-bar"
                        placeholder="          Search companies..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {isLoading ? (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading companies...</p>
                </div>
            ) : filteredCompanies.length === 0 ? (
                <div className="no-results">
                    <FaBuilding className="no-results-icon" />
                    <h3>No companies found</h3>
                    <p>Try adjusting your search query</p>
                </div>
            ) : (
                <div className="company-list">
                    {filteredCompanies.map(company => (
                        <div
                            key={company._id}
                            className="company-card"
                            onClick={() => handleCompanyClick(company._id)}
                        >
                            <div className="company-logo-container">
                                <img
                                    src={company.logo || "https://via.placeholder.com/150?text=Company"}
                                    alt={company.name}
                                    className="company-logo"
                                    onError={(e) => {
                                        e.target.src = "https://via.placeholder.com/150?text=Company";
                                    }}
                                />
                            </div>
                            <div className="company-info">
                                <h3 className="company-name">{company.name}</h3>
                                <p className="company-location">
                                    <FaMapMarkerAlt className="location-icon" />
                                    {company.location || "Location not specified"}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
export default Recruiters;
