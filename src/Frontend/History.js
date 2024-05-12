import React from 'react';
import { useLocation } from 'react-router-dom';

const History = () => {
    const location = useLocation();
    const history = location.state ? location.state.history : [];
// should display the history from mongo db - not working yet
    return (
        <section style={{ padding: '20px' }}>
            <h1>Therapy History</h1>
            {history.length > 0 ? (
                <ul style={{ listStyleType: 'none', paddingLeft: '0' }}>
                    {history.map((session, index) => (
                        <li key={index} style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
                            <strong>Date:</strong> {session.date}
                            <ul>
                                {session.exercises.map((exercise, index) => (
                                    <li key={index}>
                                        <strong>Exercise:</strong> {exercise.name}
                                        <br />
                                        <strong>Description:</strong> {exercise.description}
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No therapy history available.</p>
            )}
        </section>
    );
};

export default History;






