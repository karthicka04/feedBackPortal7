import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const FeedbackDetails = () => {
  const { id } = useParams(); 
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/feedback/${id}`);
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch feedback');
        }
        setFeedback(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [id]);

  if (loading) return <p>Loading feedback details...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h2 className="text-2xl font-bold mb-4">{feedback.companyName} - {feedback.role}</h2>
      <p><strong>Name:</strong> {feedback.name}</p>
      <p><strong>Reg No:</strong> {feedback.rollNumber}</p>
      <p><strong>Email:</strong> {feedback.email}</p>
      <p><strong>Company Location:</strong> {feedback.companyLocation}</p>
      <p><strong>Placement Type:</strong> {feedback.placementType}</p>
      <p><strong>Rounds:</strong> {feedback.totalRounds}</p>
      
      <h3 className="mt-4 font-semibold">Questions Asked:</h3>
      <ul className="list-disc list-inside">
        {feedback.rounds.map((round, index) => (
          <li key={index} className="mt-2">
            <strong>{round.roundName}</strong>
            <ul className="ml-4 list-disc">
              {round.questions.map((question, qIndex) => (
                <li key={qIndex}>{question}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FeedbackDetails;
