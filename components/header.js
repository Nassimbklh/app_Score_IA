import React from 'react';
import styles from '../styles/Header.module.css';

const Header = () => {
    return (
        <div className={styles.container}>
            <img src="https://docs.amplify.aws/assets/logo-dark.svg" className={styles.logo}/>
        </div>
    );
};

export default Header;