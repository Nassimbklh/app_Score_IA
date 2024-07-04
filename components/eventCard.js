import React, { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import styles from "../styles/EventCard.module.css";
import Swal from "sweetalert2";
import { getTeams, sendPrediction } from "@/services/sportsEventService";
import { Team } from "@/models/Team";
import TeamSelect from "./teamSelect";
import { SportsEvent } from "@/models/SportsEvent";
import { createHash } from "crypto";


const EventCard = ({ currentEvent, onSuccess }) => {
  const [teams, setTeams] = useState([]);
  const [selectedTeam1, setSelectedTeam1] = useState();
  const [selectedTeam2, setSelectedTeam2] = useState();
  const [team1odds, setTeam1odds] = useState(currentEvent.odds.team1);
  const [team2odds, setTeam2odds] = useState(currentEvent.odds.team2);
  const textRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  /*   useEffect(() => {
    let predictList = JSON.parse(localStorage.getItem("PredictList")) || [];
    setIsPredicted(predictList.some((event) => event.id === currentEvent.id));
  }, [currentEvent]); */

  useEffect(() => {
    const fetchTeams = async () => {
      const data = await getTeams();
      const teams = data.map((team) => new Team(team.name, team.image));
      setTeams(teams);
    };

    fetchTeams();
  }, []);

  console.log({ teams });
  const handleTeam1Change = (team) => {
    setSelectedTeam1(team);
  };
  const handleTeam2Change = (team) => {
    setSelectedTeam2(team);
  };

  const handleClick = () => {
    gsap.to(textRef.current, {
      height: isOpen ? "0" : "auto",
      duration: 0.9,
      ease: "power2.inOut",
    });
    setIsOpen(!isOpen);
  };

  const generateID = (sportsEvent) => {
    const str = [
      sportsEvent.team1,
      sportsEvent.team2,
      sportsEvent.odds.team1,
      sportsEvent.odds.team2,
      Date.now(),
      Math.random(),
      ].join(":");
    return createHash("sha256").update(str).digest("hex");
  };

  const stringToNumber = (value) => {
    return parseFloat(value);
  };


  const tryToPredict = async () => {
    const [odds1, odds2] = [
      stringToNumber(team1odds),
      stringToNumber(team2odds),
    ];
    //console.log({ odds1, odds2, selectedTeam1, selectedTeam2});
    const response = await sendPrediction({
      selectedTeam1,
      selectedTeam2,
      team1odds,
      team2odds,
    });
    console.log(response);
    
    
    Swal.fire({
      title: "Do you want to predict this match?",
      showCancelButton: true,
      confirmButtonText: "Predict",
    }).then(async(result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        //enregistre en local storage dans la liste PredictList
        let predictList = JSON.parse(localStorage.getItem("PredictList")) || [];
        const sportData = {
          team1: selectedTeam1,
          team2: selectedTeam2,
          odds: { team1: odds1, team2: odds2 },
        };
        const sportsEvent = new SportsEvent(generateID(sportData), sportData.team1, sportData.team2, sportData.odds);
        predictList.push(sportsEvent);

        localStorage.setItem("PredictList", JSON.stringify(predictList));
        //setIsPredicted(true);
        await Swal.fire("Saved!", "", "success");
        onSuccess();
      }
    });
  };
    const handleSubmit = (event) => {
      event.preventDefault();
      tryToPredict();
    };

  return (
    <div className={styles.card}>
      <form onSubmit={handleSubmit}>
        <div className={styles.img} onClick={handleClick}>
          <div onClick={(e) => e.stopPropagation()}>
            <TeamSelect
              teams={teams.filter((team) => team.name !== selectedTeam2)}
              value={selectedTeam1}
              onChange={handleTeam1Change}
              required
            />
          </div>
          <p className={styles.vs}>vs</p>
          <div onClick={(e) => e.stopPropagation()}>
            <TeamSelect
              teams={teams.filter((team) => team.name !== selectedTeam1)}
              value={selectedTeam2}
              onChange={handleTeam2Change}
              required
            />
          </div>
        </div>

        <div className={styles.text} ref={textRef}>
          <p className={styles.h3}>Odds</p>
          <p className={styles.p}>
            <input
              placeholder="0"
              required
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
              placeholder="0"
              required
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

          <button className={styles.iconbox} type="submit">
            <p className={styles.span}>Predict</p>
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventCard;
