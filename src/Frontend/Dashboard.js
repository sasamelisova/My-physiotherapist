import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    // Object containing exercises categorized by pain types
    const exercises = {
        kneePain: [
            { name: "Straight Leg Raise", description: "Lie on your back, one leg bent and the other straight. Raise the straight leg slightly off the floor. Hold and then lower it back down." },
            { name: "Quad Set", description: "Sit with your leg straight and tighten the muscle on the top of your thigh. Hold the contraction before releasing." },
            { name: "Hamstring Curl", description: "Stand and bend one knee as if trying to kick your buttock with the heel. Hold and then return to the starting position." },
            { name: "Prone Straight Leg Raises", description: "Lie on your stomach with your legs straight. Lift one leg off the ground, hold it, and then lower it back down." },
            { name: "Wall Squat", description: "Stand with your back against a wall, feet shoulder-width apart. Slowly bend your knees, sliding down the wall, then straighten up." },
            { name: "Step-Ups", description: "Step up on a platform or stair, then step down with the same leg. Alternate your leading leg with each set." },
            { name: "Calf Raises", description: "Stand upright, then push through the balls of your feet to raise your heel until you are standing on your toes. Lower slowly back to the start." },
            { name: "Leg Press", description: "Sit on a leg press machine with your feet on the platform. Extend your legs until they are straight, then return to the starting position." },
            { name: "Walking Lunge", description: "Step forward with one leg, lowering your hips until both knees are bent at a 90-degree angle. Push up and step forward with your other leg." },
            { name: "Bicycle Exercise", description: "Lie on your back and mimic a bicycle pedaling motion with your legs in the air, engaging your abdominal muscles." }
        ],
        shoulderPain: [
            { name: "Pendulum Stretch", description: "Lean over slightly and let your affected arm hang down. Swing the arm gently in circles clockwise and counterclockwise." },
            { name: "Towel Stretch", description: "Hold a towel behind your back with one hand, and grab the opposite end with your other hand. Pull the towel up and down gently." },
            { name: "Outward Rotation", description: "Hold a band between your hands with your elbows at your side, rotated outward against the band’s resistance." },
            { name: "Inward Rotation", description: "Hold a band between your hands with your elbows at your side, rotate inward against the band’s resistance." },
            { name: "Reverse Fly", description: "Bend forward slightly and, with a dumbbell in each hand, lift your arms to the side until they are parallel with the ground." },
            { name: "Shoulder Blade Squeeze", description: "Sit or stand with your arms at your sides. Squeeze your shoulder blades together and hold for a few seconds before releasing." },
            { name: "Standing Wall Stretch", description: "Face a wall and stretch your arms up to touch the wall, holding the position to stretch your shoulders." },
            { name: "Diagonal Extension", description: "Hold a band with both hands, stretch your arms out and up in a diagonal pattern, and then return to the starting position." },
            { name: "Seated Rotation", description: "Sit with your arm at a right angle and rotated outward, hold for a few seconds, and then switch arms." },
            { name: "Arm Circles", description: "Extend your arms parallel to the ground and make small circles, gradually increasing the diameter of the circles." }
        ],
        backPain: [
            { name: "Cat-Cow Stretch", description: "Get on your hands and knees. Arch your back towards the ceiling and hold, then dip it towards the floor and hold." },
            { name: "Child’s Pose", description: "Sit back on your heels with your hands stretched forward on the floor. Hold this position to stretch your back." },
            { name: "Pelvic Tilt", description: "Lie on your back with your knees bent. Tighten your stomach and buttock muscles to press your lower back against the floor." },
            { name: "Bird-Dog Stretch", description: "From a hands and knees position, extend one arm and the opposite leg straight out. Hold and then switch sides." },
            { name: "Knee-to-Chest Stretch", description: "Lie on your back and pull one knee towards your chest, holding it with your hands. Repeat with the other leg." },
            { name: "Bridging", description: "Lie on your back with your knees bent and lift your hips to create a straight line from your knees to shoulders." },
            { name: "Back Extension", description: "Lie face down and press your palms against the floor to lift your upper body while keeping your hips grounded." },
            { name: "Superman Exercise", description: "Lie face down and simultaneously raise your arms, legs, and chest off the floor, holding this position before releasing." },
            { name: "Partial Crunches", description: "Lie on your back with knees bent and feet flat. Tighten your stomach muscles and lift your head and shoulders off the floor." },
            { name: "Wall Sits", description: "Slide down a wall until your knees are at a 90-degree angle while keeping your back flat against the wall." }
        ]
    };

    // State variables
    const [userData, setUserData] = useState({ painIntensity: '', painLocation: '' });
    const [finishedTherapies, setFinishedTherapies] = useState(0);
    const [therapyHistory, setTherapyHistory] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    const [lastSessionDate, setLastSessionDate] = useState(null);
    const token = localStorage.getItem('token');

    // Fetch user data from API
    useEffect(() => {
        const username = localStorage.getItem('username');

        const fetchUserData = async () => {
            try {
                const response = await axios.get(`${baseURL}/user/${username}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUserData(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user data:', error);
                setError('Failed to fetch user data. Please try again.');
                setLoading(false);
            }
        };

        fetchUserData();
    }, [token, baseURL]);

    // Fetch therapy history from API
    useEffect(() => {
        const fetchTherapyHistory = async () => {
            try {
                const response = await axios.get(`${baseURL}/history`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTherapyHistory(response.data);
                
            } catch (error) {
                console.error('Error fetching therapy history:', error);
            }
        };

        fetchTherapyHistory();
    }, [token, baseURL]);

    // Select exercises based on user's pain location
    const selectedExercises = useMemo(() => {
        const painType = userData.painLocation + 'Pain';
        const availableExercises = exercises[painType] || [];
        let selected = [];
        while (selected.length < 3 && availableExercises.length > selected.length) {
            const randomIndex = Math.floor(Math.random() * availableExercises.length);
            const exercise = availableExercises[randomIndex];
            if (!selected.some(e => e.name === exercise.name)) {
                selected.push(exercise);
            }
        }
        return selected;
    }, [userData.painLocation]);

    const handleViewHistory = () => {
        navigate('/history', { state: { history: therapyHistory } });
    };

    // Handle click event for "Done" button
    const handleDoneClick = async () => {
        try {
            const response = await axios.post(`${baseURL}/history`, {
                date: new Date().toISOString(),
                exercises: selectedExercises.map(ex => ({ name: ex.name, description: ex.description }))
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.status === 201) {
                console.log('Therapy history saved:', response.data);
                setFinishedTherapies(finishedTherapies + 1);
            } else {
                throw new Error('Failed to save therapy history');
            }
        } catch (error) {
            console.error('Error saving therapy history:', error);
            setError('Failed to save therapy session. Please check console for more details.');
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }
    // Check if "Done" button should be disabled
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isButtonDisabled = lastSessionDate && lastSessionDate >= today;

    return (
        <div className='app'>
            <h1>Today's Therapy</h1>
            <p>Date: {new Date().toLocaleDateString()}</p>
            {error && <p>{error}</p>}
            <p>Pain Intensity: {userData.painIntensity}</p>
            <p>Pain Location: {userData.painLocation}</p>
            <p>Finished Therapies: {finishedTherapies}</p>
            <div className='exercises'>
                <h2 className='name'>Recommended Exercises</h2>
                <ul className='each_exercise'>
                    {selectedExercises.map((exercise, index) => (
                        <li key={index}>
                            <strong>{exercise.name}</strong>: {exercise.description}
                        </li>
                    ))}
                </ul>
            </div>
            
            <button className='button' onClick={handleDoneClick} disabled={isButtonDisabled}>Done</button>
            <button className='button' onClick={handleViewHistory}>View History</button>
        </div>
    );
};

export default Dashboard;











