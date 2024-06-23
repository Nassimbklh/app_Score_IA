// components/EventList.js

import React, { useEffect, useState } from 'react';
import { getSportsEvents } from '@/services/sportsEventService';
import { SportsEvent } from '@/models/SportsEvent';
import styles from '@/styles/EventList.module.css';
import EventCard from "@/components/eventCard";

const EventList = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            const data = await getSportsEvents();
            const sportsEvents = data.map(event => new SportsEvent(event.id, event.team1, event.team2, event.odds));
            setEvents(sportsEvents);
        };

        fetchEvents();
    }, []);

    return (
        <div className={styles.container}>
            {events.map(event => (
                <EventCard currentEvent={event} key={event.id}/>
            ))}
        </div>
    );
};

export default EventList;