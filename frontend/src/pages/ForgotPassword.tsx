import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButton,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonText,
    IonIcon,
    IonList,
    IonItem,
    IonInput,
    IonSpinner,
    useIonToast
} from "@ionic/react"
import { useHistory } from "react-router-dom";
import { mailUnread, people, send } from 'ionicons/icons';
import Logo from '../logo.png'
import { IonThumbnail } from '@ionic/react';
import { useState } from "react";

const ForgotPassword: React.FC = () => {

    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [toast] = useIonToast();

    const handleLogin = () => {
        history.push("/login");
    }

    const handleForgotPassword = () => {
        setLoading(true)
        setTimeout(() => {
            toast({
                message: 'We have e-mailed your password reset link!',
                duration: 1500,
                position: 'top',
            });
            history.push("/reset-password");
        }, 3000)
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Forgot Password</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonGrid>
                    <IonRow className="ion-justify-content-center" >
                        <IonCol>
                            <IonText style={{ textAlign: 'center' }}>
                                <h3>Forgot Password</h3>
                                <p><small>We'll e-mail you instructions on how to reset your password.</small></p>
                            </IonText>
                            <IonThumbnail style={{ textAlign: 'center' }}>
                                <img alt="Application Logo" src={Logo} />
                            </IonThumbnail>
                            <IonList style={{ marginTop: '20px' }}>
                                <IonItem>
                                    <IonInput disabled={loading} labelPlacement="stacked" clearInput={true} id="txtEmail" type="email" placeholder="Please Enter Your E-Mail Address">
                                        <IonIcon slot="start" icon={mailUnread} aria-hidden="true"></IonIcon>
                                        <div slot="label">
                                            E-Mail Address <IonText color="danger">*</IonText>
                                        </div>
                                    </IonInput>
                                </IonItem>
                            </IonList>
                            <IonButton onClick={handleForgotPassword} disabled={loading} style={{ marginTop: '30px' }} expand="block">
                                {!loading ? <IonIcon icon={send} style={{ marginRight: '2px' }} /> : <IonSpinner name="crescent" style={{ marginRight: '5px' }}></IonSpinner>} Request Password Reset
                            </IonButton>
                            <IonButton onClick={handleLogin} style={{ marginTop: '2px' }} expand="block" color="dark">
                                <IonIcon icon={people} style={{ marginRight: '2px' }} />Back To Sign In
                            </IonButton>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonContent>
        </IonPage>
    )
}

export default ForgotPassword;