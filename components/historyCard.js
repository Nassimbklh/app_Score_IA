import React, { useRef, useState, useEffect } from 'react';
import styles from '../styles/HistoryCard.module.css';
import Swal from 'sweetalert2'
import { getTeams } from '@/services/sportsEventService';
import { Team } from '@/models/Team';


const HistoryCard = ({currentEvent}) => {
    const [isPredicted, setIsPredicted] = useState(true);
    const [teams , setTeams] = useState({});
    useEffect(()=>{
        const fetchTeams = async () => {
            const data = await getTeams();
            const teams = data.reduce((acc, team) => {
                if (![currentEvent.team1, currentEvent.team2].includes(team.name)) {
                  return acc;
                }
                return {
                  ...acc,
                  [team.name]: new Team(team.name, team.image)
                };   
            }, {});
            
            setTeams(teams);
        };
        fetchTeams();
    },[currentEvent]);



    const deletePredict = () => {

        Swal.fire({
            title: "Do you want to delete this prediction?",
            showCancelButton: true,
            confirmButtonText: "Delete",
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                //enregistre en local storage dans la liste PredictList
                let predictList = JSON.parse(localStorage.getItem('PredictList')) || [];
                predictList = predictList.filter(event => event.id !== currentEvent.id);
                localStorage.setItem('PredictList', JSON.stringify(predictList));

                Swal.fire("Deleted !", "", "success");
                setIsPredicted(false);
            }
        });
    }

    return (
      isPredicted &&
      teams && (
        <div className={styles.card}>
          <div className={styles.img}>
            <div className={styles.predict}>
              <p className={styles.head}>
                <img
                  className={styles.flag}
                  src={teams[currentEvent.team1]?.image}
                  alt={currentEvent.team1}
                />
              </p>
              <p className={styles.vs}>vs</p>
              <p className={styles.head}>
                <img
                  className={styles.flag}
                  src={teams[currentEvent.team2]?.image}
                  alt={currentEvent.team2}
                />
              </p>
            </div>
            <div>
              <span className={styles.cote}>{currentEvent.odds.team1}</span>
              <span className={styles.coteSeparator}>:</span>
              <span className={styles.cote}>{currentEvent.odds.team2}</span>
            </div>
            <img className={styles.arrow} src="/arrow.svg" alt="to" />
            <img className={styles.flag} src="/france-flag.png" alt="france" />
            <img
              className={styles.trash}
              src="/trash.svg"
              alt="delete"
              onClick={deletePredict}
            />
          </div>
        </div>
      )
    );
};

export default HistoryCard;