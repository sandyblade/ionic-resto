import {
    IonButton,
    IonSpinner,
    IonIcon,
    IonGrid,
    IonRow,
    IonCol,
    IonText,
    IonList,
    IonItem,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonTextarea,
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonContent,
    IonInputPasswordToggle,
    useIonToast,
    useIonLoading
} from '@ionic/react';
import { useState, useEffect } from "react";
import { mailUnread, people, call, navigate, person, map, lockOpen, lockClosed, send, logIn } from 'ionicons/icons';
import { useHistory } from "react-router-dom";

interface userInterface {
    email: string,
    phone: string,
    gender: string,
    name: string,
    address: string
}

const Profile: React.FC = () => {

    const history = useHistory();
    const [present, dismiss] = useIonLoading();
    const [modalPassword, setModalPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [toast] = useIonToast();
    const user: userInterface | null = (localStorage.getItem('auth_user') !== undefined && localStorage.getItem('auth_user') !== null) ? JSON.parse(String(localStorage.getItem('auth_user'))) : {}

    const handleSubmit = () => {
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
            toast({
                message: 'Success, your account profile has been changed !',
                duration: 1500,
                position: 'top',
            });
        }, 3000)
    }

    const handleLogOut = () => {
        present({
            message: 'Sign Out...',
            duration: 3000,
            spinner: "circular",
            onDidDismiss: (() => {
                if (localStorage.getItem('auth_token')) {
                    localStorage.removeItem('auth_token')
                }

                if (localStorage.getItem('auth_user')) {
                    localStorage.removeItem('auth_user')
                }

                history.push("/login")
            })
        });
    }

    const handleSubmitPassword = () => {
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
            setModalPassword(false)
            toast({
                message: 'Success, your account password has been changed. !',
                duration: 1500,
                position: 'top',
            });
        }, 3000)
    }

    useEffect(() => {
        return () => {
            setLoading(false)
        };
    }, []);

    return (
        <>
            <IonGrid>
                <IonRow className="ion-justify-content-center" style={{ marginTop: '40px' }}>
                    <IonCol>
                        <IonList style={{ marginTop: '10px' }}>
                            <IonItem>
                                <IonInput
                                    labelPlacement="stacked"
                                    id="txtName"
                                    clearInput={true}
                                    disabled={loading}
                                    value={user?.name}
                                    type="text"
                                    placeholder="Please Enter Your Name"
                                >
                                    <IonIcon slot="start" icon={person} aria-hidden="true"></IonIcon>
                                    <div slot="label">
                                        Name <IonText color="danger">*</IonText>
                                    </div>
                                </IonInput>
                            </IonItem>
                        </IonList>

                        <IonList style={{ marginTop: '10px' }}>
                            <IonItem>
                                <IonSelect placeholder="Please Select Your Gender" disabled={loading} labelPlacement='stacked' value={user?.gender}>
                                    <IonIcon slot="start" icon={people} aria-hidden="true"></IonIcon>
                                    <div slot="label">
                                        Gender <IonText color="danger">*</IonText>
                                    </div>
                                    <IonSelectOption value="male">Male</IonSelectOption>
                                    <IonSelectOption value="female">Female</IonSelectOption>
                                </IonSelect>
                            </IonItem>
                        </IonList>

                        <IonList style={{ marginTop: '10px' }}>
                            <IonItem>
                                <IonInput
                                    labelPlacement="stacked"
                                    id="txtPhone"
                                    clearInput={true}
                                    disabled={loading}
                                    value={user?.phone}
                                    type="number"
                                    placeholder="Please Enter Your Phone Number"
                                >
                                    <IonIcon slot="start" icon={call} aria-hidden="true"></IonIcon>
                                    <div slot="label">
                                        Phone Number <IonText color="danger">*</IonText>
                                    </div>
                                </IonInput>
                            </IonItem>
                        </IonList>
                        <IonList style={{ marginTop: '10px' }}>
                            <IonItem>
                                <IonInput
                                    labelPlacement="stacked"
                                    id="txtEmail"
                                    clearInput={true}
                                    disabled={loading}
                                    value={user?.email}
                                    type="email"
                                    placeholder="Please Enter Your E-Mail Address"
                                >
                                    <IonIcon slot="start" icon={mailUnread} aria-hidden="true"></IonIcon>
                                    <div slot="label">
                                        E-Mail Address <IonText color="danger">*</IonText>
                                    </div>
                                </IonInput>
                            </IonItem>
                        </IonList>
                        <IonList style={{ marginTop: '10px' }}>
                            <IonItem>
                                <IonTextarea labelPlacement="stacked" disabled={loading} value={user?.address}>
                                    <IonIcon slot="start" icon={map} aria-hidden="true"></IonIcon>
                                    <div slot="label">
                                        Street Address <IonText color="danger">*</IonText>
                                    </div>
                                </IonTextarea>
                            </IonItem>
                        </IonList>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonButton onClick={handleSubmit} disabled={loading} expand="block" >
                            {!loading ? <IonIcon icon={navigate} style={{ marginRight: '2px' }} /> : <IonSpinner name="crescent" style={{ marginRight: '5px' }}></IonSpinner>} Update Profile
                        </IonButton>
                        <IonButton onClick={() => setModalPassword(true)} style={{ marginTop: '2px' }} expand="block" color="danger" >
                            <IonIcon icon={lockOpen} style={{ marginRight: '2px' }} />Change Password
                        </IonButton>
                        <IonButton onClick={handleLogOut} style={{ marginTop: '2px' }} expand="block" color="tertiary" >
                            <IonIcon icon={logIn} style={{ marginRight: '2px' }} />Sign Out Application
                        </IonButton>
                    </IonCol>
                </IonRow>
            </IonGrid>
            <IonModal isOpen={modalPassword}>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>Change Password</IonTitle>
                        <IonButtons slot="end">
                            <IonButton onClick={() => setModalPassword(false)}>Close</IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>
                <IonContent>
                    <IonGrid>
                        <IonRow className="ion-justify-content-center" >
                            <IonCol>
                                <IonText style={{ textAlign: 'center' }}>
                                    <p><small>Enter a new password to reset the password on your account.</small></p>
                                </IonText>
                                <IonList style={{ marginTop: '20px' }}>
                                    <IonItem>
                                        <IonInput disabled={loading} labelPlacement="stacked" clearInput={true} id="txtPasswordOld" type="password" placeholder="Current Password">
                                            <IonIcon slot="start" icon={lockClosed} aria-hidden="true"></IonIcon>
                                            <IonInputPasswordToggle slot="end"></IonInputPasswordToggle>
                                            <div slot="label">
                                                Current Password <IonText color="danger">*</IonText>
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
                                <IonButton onClick={handleSubmitPassword} disabled={loading} style={{ marginTop: '30px' }} expand="block">
                                    {!loading ? <IonIcon icon={send} style={{ marginRight: '2px' }} /> : <IonSpinner name="crescent" style={{ marginRight: '5px' }}></IonSpinner>}  Update Password
                                </IonButton>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                </IonContent>
            </IonModal>
        </>
    );
}

export default Profile;