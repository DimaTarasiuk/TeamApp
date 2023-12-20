import axios from "axios";
import React, { useState, useEffect } from 'react';

import { userColors } from "../../source/data/MainData";
import { UpdateModal } from '../updateModal/UpdateModal';

import Switch from '@mui/material/Switch';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

import './pieChartBox.scss';

interface Chart {
    id: number;
    userName: string;
    mistake: number;
    color: string;
}

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ value, cx, cy, midAngle, innerRadius, outerRadius }:
    {
        value: number, cx: any, cy: any, midAngle: any, innerRadius: any, outerRadius: any
    }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.3;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {`${value}`}
        </text>
    );
};

export const PieChartBox: React.FC<{ title: string }> = ({ title }) => {
    const [userData, setUserData] = useState<Chart[]>([]);
    const [checked, setChecked] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [openAlert, setOpenAlert] = useState(false);

    useEffect(() => {
        fetch(`http://localhost:4000/mistake`)
            .then(response => response.json())
            .then(data => setUserData(data))
            .catch(error => console.error('Error loading data:', error));
    }, []);

    const handleClick = async (e: any, userId: number) => {
        e.preventDefault();
        setOpenAlert(true);

        try {
            await axios.put(`http://localhost:4000/mistake`, userData.find(user => user.id === userId));
        } catch (err) {
            console.log(err);
        }
    };

    const handleChange = (e: any, index: number) => {
        const { value } = e.target;

        setUserData((prev) => {
            const updatedUserData = [...prev];
            updatedUserData[index].mistake = Number(value);
            return updatedUserData;
        });
    };

    const handleMouseDownModal = (event: React.KeyboardEvent | React.MouseEvent) => {
        if (event.altKey || event.detail === 3) {
            setOpenModal(true);
        }
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleChangeSwitch = () => {
        setChecked((prev) => !prev);
    };

    // Ensure that userData is not empty before using it
    if (userData.length === 0) {
        return <p>Loading...</p>;
    }

    return (
        <div className="pieChartBox" onMouseDown={handleMouseDownModal}>
            <div className="pieChartBox-row">
                <h4>{title}</h4>

                <div className="pieChartBox-switch">
                    <p className="switch-text">Month</p>
                    <Switch checked={checked} onChange={handleChangeSwitch} color="default" />
                    <p className="switch-text">Year</p>
                </div>
            </div>

            <UpdateModal
                open={openModal}
                onClose={handleCloseModal}
                userData={userData}
                title={'Update amount of mistake'}
                handleChange={handleChange}
                handleClick={handleClick}
                openAlert={openAlert}
                setOpenAlert={setOpenAlert}
            />

            <div className="chart">
                <ResponsiveContainer width="99%" height="99%">
                    <PieChart>
                        <Pie
                            //need change
                            data={checked ? userData : userData}
                            dataKey="mistake"
                            cx={150}
                            cy={110}
                            startAngle={180}
                            endAngle={0}
                            innerRadius={40}
                            outerRadius={100}
                            labelLine={false}
                            label={renderCustomizedLabel}
                            paddingAngle={5}
                        >
                            {userData.map((item, key) => (
                                <Cell key={item.userName} stroke={userColors[key % userColors.length]} fill={userColors[key % userColors.length]} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

