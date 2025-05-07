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
    IonInputPasswordToggle,
    IonSpinner,
    useIonToast
} from "@ionic/react"
import { useHistory } from "react-router-dom";
import { mailUnread, send, lockClosed } from 'ionicons/icons';
import Logo from '../logo.png'
import { IonThumbnail } from '@ionic/react';
import { useState } from "react";

const ResetPassword: React.FC = () => {

    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [toast] = useIonToast();

    const handleSubmit = () => {
        setLoading(true)
        setTimeout(() => {
            toast({
                message: 'Your password has been reset! Now you can login.',
                duration: 1500,
                position: 'top',
            });
            history.push("/login");
        }, 3000)
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Reset Password</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonGrid>
                    <IonRow className="ion-justify-content-center" >
                        <IonCol>
                            <IonText style={{ textAlign: 'center' }}>
                                <h3>Reset Password</h3>
                                <p><small>Enter a new password to reset the password on your account. We'll ask for this password whenever you log in.</small></p>
                            </IonText>
                            <IonThumbnail style={{ textAlign: 'center' }}>
                                <img alt="Application Logo" src={Logo} />
                            </IonThumbnail>
                            <IonList style={{ marginTop: '20px' }}>
                                <IonItem>
                                    <IonInput disabled={loading} labelPlacement="stacked" clearInput={true} id="txtEmail" type="email" placeholder="E-Mail Address">
                                        <IonIcon slot="start" icon={mailUnread} aria-hidden="true"></IonIcon>
                                        <div slot="label">
                                            E-Mail Address <IonText color="danger">*</IonText>
                                        </div>
                                    </IonInput>
                                </IonItem>
                                <IonItem style={{ marginTop: '2%' }}>
                                    <IonInput disabled={loading} labelPlacement="stacked" clearInput={true} id="txtPassword" type="password" placeholder="New Password">
                                        <IonIcon slot="start" icon={lockClosed} aria-hidden="true"></IonIcon>
                                        <IonInputPasswordToggle slot="end"></IonInputPasswordToggle>
                                        <div slot="label">
                                            New Password <IonText color="danger">*</IonText>
                                        </div>
                                    </IonInput>
                                </IonItem>
                                <IonItem style={{ marginTop: '2%' }}>
                                    <IonInput disabled={loading} labelPlacement="stacked" clearInput={true} id="txtPasswordConfirm" type="password" placeholder="Confirm New Password ">
                                        <IonIcon slot="start" icon={lockClosed} aria-hidden="true"></IonIcon>
                                        <IonInputPasswordToggle slot="end"></IonInputPasswordToggle>
                                        <div slot="label">
                                            Confirm New Password <IonText color="danger">*</IonText>
                                        </div>
                                    </IonInput>
                                </IonItem>
                            </IonList>
                            <IonButton onClick={handleSubmit} disabled={loading} style={{ marginTop: '30px' }} expand="block">
                                {!loading ? <IonIcon icon={send} style={{ marginRight: '2px' }} /> : <IonSpinner name="crescent" style={{ marginRight: '5px' }}></IonSpinner>}  Reset Password
                            </IonButton>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonContent>
        </IonPage>
    )
}

export default ResetPassword;