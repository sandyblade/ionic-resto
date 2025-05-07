import React from "react";
import { IonContent, IonPage, IonGrid, IonRow, IonCol } from "@ionic/react";
import { Player } from '@lottiefiles/react-lottie-player';
import AnimationSplash from '../Animation.json'

const SplashScreen: React.FC = () => {

    const AppName: string = import.meta.env.VITE_APP_TITLE

    return (
        <IonPage >
            <IonContent fullscreen color="primary">
                <IonGrid>
                    <IonRow className="ion-justify-content-center" style={{ marginTop: '50%' }}>
                        <IonCol size="6" style={{ textAlign: 'center' }}>
                            <Player src={AnimationSplash} className="player" loop autoplay />
                            <span style={{ fontSize: '20px', display: 'block', marginTop: '10px' }}>{AppName}</span>
                            <small>Version 1.0</small>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonContent>
        </IonPage>
    )
}

export default SplashScreen;