import React from 'react';
import styles from '../styles/Profile.module.css';

const Profile = (props) => {
    return (
        <div className={styles.container}>
            {props.children}
        </div>
    );
};

export default Profile;