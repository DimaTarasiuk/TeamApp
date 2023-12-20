import { useState, useEffect } from 'react';
import axios from "axios";

import { projectStatusColors } from '../../source/data/MainData';
import { UpdateModal } from '../updateModal/UpdateModal';

import './userProjectList.scss';

interface User {
    id: number;
    userName: string;
    projectTitle: string;
    projectStatus: number;
}

export const UserProjectList = () => {
    const [userData, setUserData] = useState<User[]>([]);
    const [openModal, setOpenModal] = useState(false);
    const [openAlert, setOpenAlert] = useState(false);

    useEffect(() => {
        fetch(`http://localhost:4000/userinfo`)
            .then(response => response.json())
            .then(data => setUserData(data))
            .catch(error => console.error('Error loading data:', error));
    }, []);

    const handleClick = async (e: any, userId: number) => {
        e.preventDefault();
        setOpenAlert(true);

        try {
            await axios.put(`http://localhost:4000/userinfo`, userData.find(user => user.id === userId));
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
                [name]: String(value),
            };
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

    const getStatusColor = (status: number): string => {
        const defaultColor = "#757D8B";

        return projectStatusColors[status] || defaultColor;
    };

    // Ensure that userData is not empty before using it
    if (userData.length === 0) {
        return <p>Loading...</p>;
    }

    return (
        <div className="userProject" onMouseDown={handleMouseDownModal}>
            <UpdateModal
                open={openModal}
                onClose={handleCloseModal}
                userData={userData}
                title={'Update project'}
                handleChange={handleChange}
                handleClick={handleClick}
                openAlert={openAlert}
                setOpenAlert={setOpenAlert}
            />

            <div className="userProject-list">
                {userData.map((user: any) => (
                    <div className="userProject-item" key={user.id}>
                        <p className="item-name">{user.userName}</p>
                        {/* only first word */}
                        {/* <p className="item-name">{user.username.substring(0, user.username.indexOf(' '))}</p> */}
                        <p className="item-project">{user.projectTitle}</p>
                        <p
                            className="item-status"
                            // style={{
                            //     color:
                            //         user.projectStatus === 0
                            //             ? "#757D8B"
                            //             : user.projectStatus === 25
                            //                 ? "tomato"
                            //                 : user.projectStatus === 50
                            //                     ? "yellow"
                            //                     : user.projectStatus === 75
                            //                         ? "orange"
                            //                         : "limegreen",
                            // }}
                            style={{
                                color: getStatusColor(user.projectStatus),
                            }}
                        >
                            {user.projectStatus}%
                        </p>
                    </div>
                ))}
            </div>
        </div>
    )
}
