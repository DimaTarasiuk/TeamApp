import { useState, useEffect } from 'react';
import axios from "axios";

import { userColors } from '../../source/data/MainData';
import { UpdateModal } from '../updateModal/UpdateModal';

import { ComposedChart, XAxis, YAxis, Tooltip, Bar, ResponsiveContainer } from 'recharts';

import './stackedBarChart.scss';

interface Chart {
    id: number;
    userName: string;
    oneOnone: number;
    weekly: number;
    training: number;
    [key: string]: any;
}

const meetingTotals = {
    'oneOnone': 0,
    'weekly': 0,
    'training': 0,
};

export const StackedBarChart = ({ title }: { title: string }) => {
    const [userData, setUserData] = useState<Chart[]>([]);
    const [openModal, setOpenModal] = useState(false);
    const [openAlert, setOpenAlert] = useState(false);

    useEffect(() => {
        fetch('http://localhost:4000/meeting')
            .then(response => response.json())
            .then(data => setUserData(data))
            .catch(error => console.error('Error loading data:', error));
    }, []);

    const handleClick = async (e: any, userId: number) => {
        e.preventDefault();
        setOpenAlert(true);

        try {
            await axios.put(`http://localhost:4000/meeting`, userData.find(user => user.id === userId));
        } catch (err) {
            console.log(err);
        }
    };

    const handleChange = (e: any, index: number) => {
        const { name, value } = e.target;

        setUserData((prev) => {
            const updatedUserData = [...prev];
            updatedUserData[index] = {
                ...updatedUserData[index],
                [name]: Number(value),
            };
            return updatedUserData;
        });
    };

    userData.reduce(
        (totals, user) => {
            totals.oneOnone += user.oneOnone;
            totals.weekly += user.weekly;
            totals.training += user.training;
            return totals;
        },
        { oneOnone: 0, weekly: 0, training: 0 }
    );

    const stackedBarData = Object.keys(meetingTotals).map(meeting => ({
        nameMeeting: meeting,
        ...Object.fromEntries(
            userData.map(user => [user.userName, user[meeting]])
        ),
    }));

    const keys = Object.keys(stackedBarData[0]).filter(key => key !== 'nameMeeting');

    const handleMouseDownModal = (event: React.KeyboardEvent | React.MouseEvent) => {
        if (event.altKey || event.detail === 3) {
            setOpenModal(true);
        }
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    // Ensure that userData is not empty before using it
    if (userData.length === 0) {
        return <p>Loading...</p>;
    }

    return (
        <div className="starkedBarChart" onMouseDown={handleMouseDownModal}>
            <h4>{title}</h4>
            <UpdateModal
                open={openModal}
                onClose={handleCloseModal}
                userData={userData}
                title={'Update amount of meeting'}
                handleChange={handleChange}
                handleClick={handleClick}
                openAlert={openAlert}
                setOpenAlert={setOpenAlert}
            />

            <div className="chart">
                <ResponsiveContainer width="99%" height="100%">
                    <ComposedChart
                        layout="vertical"
                        data={stackedBarData}
                        margin={{ top: 5, right: 0, bottom: 0, left: 20 }}
                    >
                        <XAxis type="number" />
                        <YAxis dataKey="nameMeeting" type="category" />
                        <Tooltip />

                        {keys.map((key, index) => (
                            <Bar key={key} dataKey={key} stackId="a" fill={userColors[index % userColors.length]} />
                        ))}
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
