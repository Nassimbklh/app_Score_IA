import React from 'react';
import styles from '../styles/Header.module.css';

const Header = () => {
    return (
        <div className={styles.container}>
            <img src="/icon.png" className={styles.logo}/>
        </div>
    );
};

export default Header;