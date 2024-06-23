// components/EventList.js

import React, { useEffect, useState } from 'react';
import { SportsEvent } from '@/models/SportsEvent';
import styles from '@/styles/HistoryList.module.css';
import HistoryCard from "@/components/historyCard";

const HistoryList = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEventsLocal = async () => {
            const data = JSON.parse(localStorage.getItem('PredictList')) || [];
            const sportsEvents = data.map(event => new SportsEvent(event.id, event.team1, event.team2, event.odds));
            setEvents(sportsEvents);
        };

        fetchEventsLocal();
    }, []);

    return (
        <div className={styles.container}>
            {events.map(event => (
                <HistoryCard currentEvent={event} key={event.id}/>
            ))}
        </div>
    );
};

export default HistoryList;