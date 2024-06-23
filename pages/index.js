import {Authenticator, useTheme, View, Image, withAuthenticator} from "@aws-amplify/ui-react";
import BottomNavBar from '@/components/bottomNavBar';
import {useState} from "react";
import styles from "../styles/Home.module.css";
import Header from "@/components/header";
import EventList from "@/components/eventList";
import HistoryList from "@/components/historyList";
import Profile from "@/components/profile";



export function getServerSideProps() {
  const renderedAt = new Date();
  const formattedBuildDate = renderedAt.toLocaleDateString("en-US", {
    dateStyle: "long",
  });
  const formattedBuildTime = renderedAt.toLocaleTimeString("en-US", {
    timeStyle: "long",
  });
  return {
    props: {
      renderedAt: `${formattedBuildDate} at ${formattedBuildTime}`,
    },
  };
}

const components = {
  Header() {
    const {tokens} = useTheme();

    return (
        <View textAlign="center" padding={tokens.space.large} backgroundColor={"#047d95"}>
          <Image
              alt="Amplify logo"
              src="https://docs.amplify.aws/assets/logo-dark.svg"
          />
        </View>
    );
  },
}

export default function Home({ renderedAt }) {
  const [activeComponent, setActiveComponent] = useState('Home');

  return (
      <Authenticator socialProviders={[ 'google']} signUpAttributes={['email', "preferred_username",'birthdate', 'phone_number']} components={components}>
        {({ signOut, user }) => (
      <div className={styles.container}>
        <Header />
        <div>

            {/*<div>
              <button onClick={signOut}>Sign out</button>
            </div>*/}
            <div className={styles.view}>
              {activeComponent === 'Profile' && <Profile><button className={styles.signout} onClick={signOut}>Sign out</button></Profile>}
              {activeComponent === 'Home' && <EventList />}
              {activeComponent === 'History' && <HistoryList/>}
            </div>
        </div>
        <BottomNavBar activeComponent={activeComponent} setActiveComponent={setActiveComponent} />

      </div>

        )}

      </Authenticator>

  );
}

