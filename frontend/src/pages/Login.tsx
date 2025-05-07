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
    IonInputPasswordToggle
} from "@ionic/react"
import { useHistory } from "react-router-dom";
import { lockClosed, logIn, mailSharp, mailUnread } from 'ionicons/icons';
import Logo from '../logo.png'
import { IonThumbnail, useIonToast } from '@ionic/react';
import { useState } from "react";
import Service from "../Service";



const Login: React.FC = () => {

    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [present] = useIonToast();

    const handleLogin = () => {
        let validateEmail = validEmail(email)
        let validatePassword = validPassword(password)
        if (validateEmail) {
            presentToast(validateEmail, 'bottom')
        } else if (validatePassword) {
            presentToast(validatePassword, 'bottom')
        } else {
            let form = {
                email: email,
                password: password
            }
            setLoading(true)
            setTimeout(async () => {
                await Service.auth.login(form)
                    .then(async (response) => {
                        setLoading(false)

                        const token = response.data.token
                        if (!localStorage.getItem('auth_token')) {
                            localStorage.setItem('auth_token', token)
                        }

                        const profile = await Service.profile.detail()
                        if (!localStorage.getItem('auth_user')) {
                            localStorage.setItem('auth_user', JSON.stringify(profile.data))
                        }

                        setTimeout(() => {
                            history.push("/main");
                        }, 1500)

                    })
                    .catch((error) => {
                        setLoading(false)
                        presentToast(error.response.data?.error, 'bottom')
                    })
            }, 2000)
        }
    }

    const presentToast = (message: string, position: 'top' | 'middle' | 'bottom') => {
        present({
            message: message,
            duration: 1000,
            position: position,
            color: 'danger'
        });
    };

    const handleForgotPassword = () => {
        history.push("/forgot-password");
    }

    const validPassword = (input: any): string => {
        if (input === undefined || input === null || input === '') {
            return "Please fill out this password field"
        } else {
            return ""
        }
    }

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
        <>
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>Sign In</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent>
                    <IonGrid>
                        <IonRow className="ion-justify-content-center" >
                            <IonCol>
                                <IonText style={{ textAlign: 'center' }}>
                                    <h3>Login to your account</h3>
                                    <p style={{ textAlign: 'center' }}><small>Please sign in with your e-mail address and correct password.</small></p>
                                </IonText>
                                <IonThumbnail style={{ textAlign: 'center' }}>
                                    <img alt="Application Logo" src={Logo} />
                                </IonThumbnail>
                                <IonList style={{ marginTop: '20px' }}>
                                    <IonItem>
                                        <IonInput
                                            labelPlacement="stacked"
                                            id="txtEmail"
                                            clearInput={true}
                                            disabled={loading}
                                            type="email"
                                            placeholder="Please Enter Your E-Mail Address"
                                            onIonChange={(e) => { setEmail(String(e.target.value)) }}
                                        >
                                            <IonIcon slot="start" icon={mailUnread} aria-hidden="true"></IonIcon>
                                            <div slot="label">
                                                E-Mail Address <IonText color="danger">*</IonText>
                                            </div>
                                        </IonInput>
                                    </IonItem>
                                    <IonItem style={{ marginTop: '2%' }}>
                                        <IonInput
                                            labelPlacement="stacked"
                                            disabled={loading}
                                            clearInput={true}
                                            id="txtPassword"
                                            type="password"
                                            onIonChange={(e) => { setPassword(String(e.target.value)) }}
                                            placeholder="Please Enter Your Password">
                                            <IonIcon slot="start" icon={lockClosed} aria-hidden="true"></IonIcon>
                                            <IonInputPasswordToggle slot="end"></IonInputPasswordToggle>
                                            <div slot="label">
                                                Password <IonText color="danger">*</IonText>
                                            </div>
                                        </IonInput>
                                    </IonItem>
                                </IonList>
                                <IonButton onClick={handleLogin} disabled={loading} style={{ marginTop: '30px' }} expand="block" >
                                    {!loading ? <IonIcon icon={logIn} style={{ marginRight: '2px' }} /> : <IonSpinner name="crescent" style={{ marginRight: '5px' }}></IonSpinner>} Sign In Now
                                </IonButton>
                                <IonButton onClick={handleForgotPassword} style={{ marginTop: '2px' }} expand="block" color="dark" >
                                    <IonIcon icon={mailSharp} style={{ marginRight: '2px' }} />Forgot Password ?
                                </IonButton>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                </IonContent>
            </IonPage>
        </>
    )
}

export default Login;