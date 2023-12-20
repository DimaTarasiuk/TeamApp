import { useState, useEffect } from 'react';
import moment from 'moment';

import './userCard.scss';

interface Employee {
  id: number;
  image: string;
  userName: string;
  startWorkDate: string;
  position: string;
  timeDayWork: object | any;
  workDuration?: string;
}

export const UserCard = ({ userInfoData }: { userInfoData: Employee[] }) => {
  // export const UserCard = () => {
  const [userData, setUserData] = useState<Employee[]>(userInfoData);

  useEffect(() => {
    setUserData(userInfoData);
  });

  const calculateWorkDuration = (startWorkDate: string): string => {
    const start = moment(startWorkDate);
    const today = moment();

    const years = today.diff(start, 'years');
    const months = today.diff(start, 'months') % 12;
    const days = today.diff(start, 'days') % 30;

    if (years === 0) {
      return `${months} month ${days} days`;
    } else {
      return `${years} years ${months} month ${days} days`;
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setUserData((employees) =>
        employees.map((user) => ({
          ...user,
          workDuration: calculateWorkDuration(user.startWorkDate),
        }))
      );
    }, 86400000); // 86400000 ms in a day

    return () => clearInterval(intervalId);
  }, [userInfoData]);

  const timeDayWork = (position: string) => {
    const arrayMidExpJun = ["7:00", "15:00", "23:00"];
    const arraySenLead = ["8:00", "16:00", "00:00"];

    const timeArray = position === 'Senior' || position === 'TeamLead' ? arraySenLead : arrayMidExpJun;

    return (
      timeArray.map((item, key) => (
        <span key={key} className="timeDayWork-color">
          {item}
        </span>
      ))
    );
  }

  return (
    <>
      {userData.map((user, key) => {
        return (
          <div className="box userInfo" key={key}>
            <div className="userInfo-title">
              <img className="icon" src={user.image} alt="icon" />
              <h2 className="name">{user.userName}</h2>
            </div>

            <div className="box-row">
              <div className="userInfo-aboutWork">
                <p className='userInfo-workData'>{calculateWorkDuration(user.startWorkDate)}</p>
                <p className="userInfo-position">{user.position}</p>
              </div>

              <div className="userInfo-timeDayWork">
                {timeDayWork(user.position)}
              </div>
            </div>
          </div>
        )
      }
      )
      }
    </>
  )
}
