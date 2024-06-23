import React, { useRef, useState, useEffect } from 'react';
import styles from '../styles/HistoryCard.module.css';
import Swal from 'sweetalert2'

const HistoryCard = ({currentEvent}) => {
    const [isPredicted, setIsPredicted] = useState(true);



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
        //if isPredicted is true, show component
        isPredicted &&
        <div className={styles.card}>
            <div className={styles.img}>
                <div className={styles.predict}>
                    <p className={styles.head}><img className={styles.flag} src="/france-flag.png" alt="france"/></p>
                    <p className={styles.vs}>vs</p>
                    <p className={styles.head}><img className={styles.flag} src="/spain-flag.png" alt="spain"/></p>
                </div>
                <img className={styles.arrow} src="/arrow.svg" alt="to"/>
                <img className={styles.flag} src="/france-flag.png" alt="france"/>
                <img className={styles.trash} src="/trash.svg" alt="delete" onClick={deletePredict}/>

            </div>

        </div>
    );
};

export default HistoryCard;