import React from "react";
import { IonContent, IonPage, IonGrid, IonRow, IonCol } from "@ionic/react";
import { Player } from '@lottiefiles/react-lottie-player';
import DisconnectSplash from '../Disconnect.json'

const DisconnectScreen: React.FC = () => {

    return (
        <IonPage >
            <IonContent fullscreen color="primary">
                <IonGrid>
                    <IonRow className="ion-justify-content-center" style={{ marginTop: '50%' }}>
                        <IonCol size="8" style={{ textAlign: 'center' }}>
                            <Player src={DisconnectSplash} className="player" loop autoplay />
                            <p><small>Sorry, An Http error has occurred. Please close the client and try again.</small></p>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonContent>
        </IonPage>
    )
}

export default DisconnectScreen;