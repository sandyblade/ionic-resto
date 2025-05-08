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
import Service from "../Service";


const ForgotPassword: React.FC = () => {

    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('')
    const [present] = useIonToast();

    const handleLogin = () => {
        history.push("/login");
    }

    const handleForgotPassword = () => {
        let validateEmail = validEmail(email)
        if (validateEmail) {
            presentToast(validateEmail, 'bottom', 'danger')
        } else {
            let form = {
                email: email
            }
            setLoading(true)
            setTimeout(async () => {
                await Service.auth.forgot(form)
                    .then(async (response) => {
                        setLoading(false)
                        let messsage = response.data.message
                        let token = response.data.token
                        presentToast(messsage, 'bottom', 'success')
                        setTimeout(() => {
                            history.push(`/reset-password/${token}`);
                        }, 2000)
                    })
                    .catch((error) => {
                        setLoading(false)
                        presentToast(error.response.data?.error, 'bottom', 'danger')
                    })
            }, 2000)
        }
    }

    const presentToast = (message: string, position: 'top' | 'middle' | 'bottom', color: string) => {
        present({
            message: message,
            duration: 1000,
            position: position,
            color: color
        });
    };

    const validEmail = (input: any): string => {
        if (input === undefined || input === null || input === '') {
            return "Please fill out this email field"
        } else if (!formatEmail(input)) {
            return "Invalid email format"
        } else {
            return ""
        }
    }

    const formatEmail = (email: string) => {
        return email.match(
            /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
        );
    };

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
                                    <IonInput disabled={loading} onIonChange={(e) => { setEmail(String(e.target.value)) }} labelPlacement="stacked" clearInput={true} id="txtEmail" type="email" placeholder="Please Enter Your E-Mail Address">
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