import { useState, useEffect } from 'react';
import axios from "axios";

import { userColors } from '../../source/data/MainData';
import { UpdateModal } from '../updateModal/UpdateModal';

import Switch from '@mui/material/Switch';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

import './bigChartBox.scss';

interface Chart {
    id: number;
    userName: string;
    week1: number;
    week2: number;
    week3: number;
    week4: number;
    [key: string]: any;
}

const incidentTotals = {
    'week1': 0,
    'week2': 0,
    'week3': 0,
    'week4': 0,
};

export const BigChartBox = ({ title }: { title: string }) => {
    const [userData, setUserData] = useState<Chart[]>([]);
    const [checked, setChecked] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [openAlert, setOpenAlert] = useState(false);

    useEffect(() => {
        fetch('http://localhost:4000/incident')
            .then(response => response.json())
            .then(data => setUserData(data))
            .catch(error => console.error('Error loading data:', error));
    }, []);

    const handleClick = async (e: any, userId: number) => {
        e.preventDefault();
        setOpenAlert(true);

        try {
            await axios.put(`http://localhost:4000/incident`, userData.find(user => user.id === userId));
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
            totals.week1 += user.week1;
            totals.week2 += user.week2;
            totals.week3 += user.week3;
            totals.week4 += user.week4;
            return totals;
        },
        { week1: 0, week2: 0, week3: 0, week4: 0 }
    );

    const bigBoxData = Object.keys(incidentTotals).map(incident => ({
        weeks: incident,
        ...Object.fromEntries(
            userData.map(user => [user.userName, user[incident]])
        ),
    }));

    const keys = Object.keys(bigBoxData[0]).filter(key => key !== 'weeks');

    const handleChangeSwitch = () => {
        setChecked((prev) => !prev);
    };

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
        <div className="bigChartBox" onMouseDown={handleMouseDownModal}>
            <div className="bigChartBox-row">
                <h4>{title}</h4>

                <div className="bigChartBox-switch">
                    <p className="switch-text">Month</p>
                    <Switch checked={checked} onChange={handleChangeSwitch} color="default" />
                    <p className="switch-text">Year</p>
                </div>

            </div>

            <UpdateModal
                open={openModal}
                onClose={handleCloseModal}
                userData={userData}
                title={'Update amount of incident'}
                handleChange={handleChange}
                handleClick={handleClick}
                openAlert={openAlert}
                setOpenAlert={setOpenAlert}
            />

            <div className="chart">
                <ResponsiveContainer width="99%" height="100%">
                    <AreaChart
                        //need change
                        data={checked ? bigBoxData : bigBoxData}
                        margin={{
                            top: 10,
                            right: 30,
                            left: 0,
                            bottom: 0,
                        }}
                    >
                        <XAxis dataKey="weeks" />
                        <YAxis />
                        <Tooltip />
                        {keys.map((key, index) => (
                            <Area
                                key={key}
                                dataKey={key}
                                type="monotone"
                                stackId="1"
                                stroke={userColors[index % userColors.length]}
                                fill={userColors[index % userColors.length]}
                            />
                        ))}
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
