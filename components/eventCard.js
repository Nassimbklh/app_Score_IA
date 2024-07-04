import React, { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import styles from "../styles/EventCard.module.css";
import Swal from "sweetalert2";
import { getTeams, sendPrediction } from "@/services/sportsEventService";
import { Team } from "@/models/Team";
import TeamSelect from "./teamSelect";


const EventCard = ({ currentEvent }) => {
  const [teams, setTeams] = useState([]);
  const [selectedTeam1, setSelectedTeam1] = useState();
  const [selectedTeam2, setSelectedTeam2] = useState();
  const [team1odds, setTeam1odds] = useState(currentEvent.odds.team1);
  const [team2odds, setTeam2odds] = useState(currentEvent.odds.team2);
  const textRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isPredicted, setIsPredicted] = useState(false);

  useEffect(() => {
    let predictList = JSON.parse(localStorage.getItem("PredictList")) || [];
    setIsPredicted(predictList.some((event) => event.id === currentEvent.id));
  }, [currentEvent]);

  useEffect(() => {
    const fetchTeams = async () => {
      const data = await getTeams();
      const teams = data.map(
        (team) =>
          new Team(team.name, team.image)
      );
      setTeams(teams);
    };

    fetchTeams();
  }, []);

  console.log({teams});
  const handleTeam1Change = (team) => {
    setSelectedTeam1(team);
  };
  const handleTeam2Change = (team) => {
    setSelectedTeam2(team);
    };

  const handleClick = () => {
    gsap.to(textRef.current, {
      height: isOpen ? "0" : "auto",
      duration: 0.7,
      ease: "power2.inOut",
    });
    setIsOpen(!isOpen);
  };

  const stringToNumber = (value) => {
    return parseFloat(value);
  }

  const tryToPredict = async () => {
    const [odds1 , odds2] = [
      stringToNumber(team1odds),
      stringToNumber(team2odds)
    ] ;
    //console.log({ odds1, odds2, selectedTeam1, selectedTeam2});
    const response = await sendPrediction({
      selectedTeam1,
      selectedTeam2,
      team1odds,
      team2odds,
    });
    console.log(response);
    if (isPredicted) {
      return;
    }

    Swal.fire({
      title: "Do you want to predict this match?",
      showCancelButton: true,
      confirmButtonText: "Predict",
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        //enregistre en local storage dans la liste PredictList
        let predictList = JSON.parse(localStorage.getItem("PredictList")) || [];
        predictList.push(currentEvent);
        localStorage.setItem("PredictList", JSON.stringify(predictList));

        Swal.fire("Saved!", "", "success");
        setIsPredicted(true);
      }
    });
  };

  return (
    <div className={styles.card}>
      <div className={styles.img} onClick={handleClick}>

        <TeamSelect 
          teams={teams}
          value={selectedTeam1}
          onChange={handleTeam1Change}
        />
        <p className={styles.vs}>vs</p>
        <TeamSelect 
          teams={teams}
          value={selectedTeam2}
          onChange={handleTeam2Change}
        />
      </div>

      <div className={styles.text} ref={textRef}>
        <p className={styles.h3}>Odds</p>
        <p className={styles.p}>
          <input
            value={team1odds}
            className={styles.odds}
            onChange={(event) => {
              setTeam1odds(event.target.value);
            }}
            type="number"
            step={0.1}
            max={10}
            min={0}
          />{" "}
          -{" "}
          <input
            value={team2odds}
            className={styles.odds}
            onChange={(event) => {
              setTeam2odds(event.target.value);
            }}
            type="number"
            step={0.1}
            max={10}
            min={0}
          />
        </p>

        <button
          className={styles.iconbox}
          onClick={tryToPredict}
          disabled={isPredicted}
        >
          <p className={styles.span}>{isPredicted ? "Predicted" : "Predict"}</p>
        </button>
      </div>
    </div>
  );
};

export default EventCard;
