import { Redirect, Route } from 'react-router-dom';
import { IonApp, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { useEffect, useState, useCallback } from "react";
import Service from "./Service";
// import Home from './pages/Home';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import SplashScreen from './components/SplashScreen';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import MainLayout from './components/MainLayout';
import DisconnectScreen from './components/DisconnectScreen';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

const MainApp: React.FC = () => {
    return (
        <IonReactRouter>
            <Route exact path="/login">
                <Login />
            </Route>
            <Route exact path="/forgot-password">
                <ForgotPassword />
            </Route>
            <Route exact path="/reset-password">
                <ResetPassword />
            </Route>
            <Route exact path="/main">
                <MainLayout />
            </Route>
            <Route exact path="/">
                <Redirect to="/login" />
            </Route>
        </IonReactRouter>
    )
}

const App: React.FC = () => {

    const logged: boolean = localStorage.getItem('auth_token') !== undefined && localStorage.getItem('auth_token') !== null
    const [loading, setLoading] = useState(true);
    const [connected, setConnected] = useState(false);

    const loadContent = useCallback(async () => {
        await Service.ping()
            .then(() => {
                setTimeout(() => {
                    setLoading(false)
                    setConnected(true)
                }, 1500)
            })
            .catch(() => {
                setLoading(false)
                setConnected(false)
            })

    }, [loading, connected])

    const auth = async () => {
        if (logged) {
            await Service.profile.detail()
                .catch((error) => {
                    if (error.status === 401) {
                        if (localStorage.getItem('auth_token')) {
                            localStorage.removeItem('auth_token')
                        }
                        if (localStorage.getItem('auth_user')) {
                            localStorage.removeItem('auth_user')
                        }
                    }
                })
        }
    }

    useEffect(() => {
        auth()
        loadContent()
    }, [])

    return (
        <IonApp>
            {loading ? <SplashScreen /> : <>
                {connected ? <MainApp /> : <>
                    <DisconnectScreen />
                </>}
            </>}
        </IonApp>
    )
};

export default App;
