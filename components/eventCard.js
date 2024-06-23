import React, { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import styles from '../styles/EventCard.module.css';
import Swal from 'sweetalert2'

const EventCard = ({currentEvent}) => {
    const textRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isPredicted, setIsPredicted] = useState(false);

    useEffect(() => {
        let predictList = JSON.parse(localStorage.getItem('PredictList')) || [];
        setIsPredicted(predictList.some(event => event.id === currentEvent.id));
    }, [currentEvent]);

    const handleClick = () => {
        gsap.to(textRef.current, { height: isOpen ? '0' : 'auto', duration: 0.7, ease: 'power2.inOut'});
        setIsOpen(!isOpen);
    };

    const tryToPredict = () => {
        if (isPredicted) return;

        Swal.fire({
            title: "Do you want to predict this match?",
            showCancelButton: true,
            confirmButtonText: "Predict",
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                //enregistre en local storage dans la liste PredictList
                let predictList = JSON.parse(localStorage.getItem('PredictList')) || [];
                predictList.push(currentEvent);
                localStorage.setItem('PredictList', JSON.stringify(predictList));

                Swal.fire("Saved!", "", "success");
                setIsPredicted(true);
            }
        });
    }

    return (
        <div className={styles.card}>
            <div className={styles.img} onClick={handleClick}>

                <p className={styles.head}><img className={styles.flag} src="/france-flag.png" alt="france"/>{currentEvent.team1}</p>
                <p className={styles.vs}>vs</p>
                <p className={styles.head}>{currentEvent.team2}<img className={styles.flag} src="/spain-flag.png" alt="spain"/></p>
            </div>

            <div className={styles.text} ref={textRef}>
                <p className={styles.h3}>Odds</p>
                <p className={styles.p}><span className={styles.odds}>{currentEvent.odds.team1}</span> - <span className={styles.odds}>{currentEvent.odds.team2}</span></p>

                <button className={styles.iconbox} onClick={tryToPredict} disabled={isPredicted}>
                    <p className={styles.span}>{isPredicted ? 'Predicted' : 'Predict'}</p>
                </button>
            </div>
        </div>
    );
};

export default EventCard;