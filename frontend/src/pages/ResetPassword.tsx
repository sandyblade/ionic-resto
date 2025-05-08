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
import { useHistory, useParams } from "react-router-dom";
import { mailUnread, send, lockClosed } from 'ionicons/icons';
import Logo from '../logo.png'
import { IonThumbnail } from '@ionic/react';
import { useState } from "react";
import Service from "../Service";

const ResetPassword: React.FC = () => {

    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [present] = useIonToast();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')
    const params: any = useParams();

    const handleSubmit = () => {
        const token = params.token
        let validateEmail = validEmail(email)
        let validatePassword = validPassword(password)
        if (validateEmail) {
            presentToast(validateEmail, 'bottom', 'danger')
        } else if (validatePassword) {
            presentToast(validatePassword, 'bottom', 'danger')
        } else if (!passwordConfirm) {
            presentToast("Please fill out this password field", 'bottom', 'danger')
        } else if (password != passwordConfirm) {
            presentToast("Please make sure your passwords match.", 'bottom', 'danger')
        } else {
            let form = {
                email: email,
                confirmPassword: passwordConfirm,
                password: password
            }
            setLoading(true)
            setTimeout(async () => {
                await Service.auth.reset(token, form)
                    .then(async (response) => {
                        setLoading(false)
                        let messsage = response.data.message
                        presentToast(messsage, 'bottom', 'success')
                        setTimeout(() => {
                            history.push("/login");
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

    const validPassword = (input: any): string => {
        if (input === undefined || input === null || input === '') {
            return "Please fill out this password field"
        } else if (input.length <= 6) {
            return "Password must be at least 6 characters long."
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
                                    <IonInput disabled={loading} onIonChange={(e) => { setEmail(String(e.target.value)) }} labelPlacement="stacked" clearInput={true} id="txtEmail" type="email" placeholder="E-Mail Address">
                                        <IonIcon slot="start" icon={mailUnread} aria-hidden="true"></IonIcon>
                                        <div slot="label">
                                            E-Mail Address <IonText color="danger">*</IonText>
                                        </div>
                                    </IonInput>
                                </IonItem>
                                <IonItem style={{ marginTop: '2%' }}>
                                    <IonInput disabled={loading} onIonChange={(e) => { setPassword(String(e.target.value)) }} labelPlacement="stacked" clearInput={true} id="txtPassword" type="password" placeholder="New Password">
                                        <IonIcon slot="start" icon={lockClosed} aria-hidden="true"></IonIcon>
                                        <IonInputPasswordToggle slot="end"></IonInputPasswordToggle>
                                        <div slot="label">
                                            New Password <IonText color="danger">*</IonText>
                                        </div>
                                    </IonInput>
                                </IonItem>
                                <IonItem style={{ marginTop: '2%' }}>
                                    <IonInput disabled={loading} onIonChange={(e) => { setPasswordConfirm(String(e.target.value)) }} labelPlacement="stacked" clearInput={true} id="txtPasswordConfirm" type="password" placeholder="Confirm New Password ">
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