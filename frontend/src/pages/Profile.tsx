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
import Service from "../Service";

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
    const user: userInterface | null = (localStorage.getItem('auth_user') !== undefined && localStorage.getItem('auth_user') !== null) ? JSON.parse(String(localStorage.getItem('auth_user'))) : null
    const [currentPassword, setCurrentPassword] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')
    const [name, setName] = useState('')
    const [gender, setGender] = useState('')
    const [phone, setPhone] = useState(0)
    const [email, setEmail] = useState('')
    const [address, setAddress] = useState('')

    const validPassword = (input: any): string => {
        if (input === undefined || input === null || input === '') {
            return "Please fill out this password field"
        } else if (input.length <= 6) {
            return "Password must be at least 6 characters long."
        } else {
            return ""
        }
    }

    const handleSubmit = () => {
        let validateEmail = validEmail(email)
        if (!name) {
            toast({
                message: 'Please fill out this full name field',
                duration: 1000,
                position: 'bottom',
                color: 'danger'
            });
        } else if (!gender) {
            toast({
                message: 'Please fill out this gender field',
                duration: 1000,
                position: 'bottom',
                color: 'danger'
            });
        } else if (!phone) {
            toast({
                message: 'Please fill out this phone number field',
                duration: 1000,
                position: 'bottom',
                color: 'danger'
            });
        } else if (validateEmail) {
            toast({
                message: validateEmail,
                duration: 1000,
                position: 'bottom',
                color: 'danger'
            });
        } else if (!address) {
            toast({
                message: 'Please fill out this street address field',
                duration: 1000,
                position: 'bottom',
                color: 'danger'
            });
        } else {
            let formData = {
                email: email,
                name: name,
                gender: gender,
                phone: phone,
                address: address
            }
            setLoading(true)
            setTimeout(async () => {
                await Service.profile.changeProfile(formData)
                    .then(async (response) => {
                        setLoading(false)
                        let messsage = response.data.message

                        console.log(response)

                        toast({
                            message: messsage,
                            duration: 1000,
                            position: 'bottom',
                            color: 'success'
                        });
                    })
                    .catch((error) => {
                        setLoading(false)
                        Object.keys(error.response.data.error).map((key) => {
                            toast({
                                message: error.response.data.error[key][0],
                                duration: 1000,
                                position: 'bottom',
                                color: 'danger'
                            });
                        })
                    })
            }, 2000)
        }
    }

    const handleSubmitPassword = () => {
        let validatePassword = validPassword(password)
        if (!currentPassword) {
            toast({
                message: 'Please fill out this current password field',
                duration: 1000,
                position: 'bottom',
                color: 'danger'
            });
        } else if (validatePassword) {
            toast({
                message: validatePassword,
                duration: 1000,
                position: 'bottom',
                color: 'danger'
            });
        } else if (!passwordConfirm) {
            toast({
                message: 'Please fill out this confirm password field',
                duration: 1000,
                position: 'bottom',
                color: 'danger'
            });
        } else if (password != passwordConfirm) {
            toast({
                message: 'Please make sure your passwords match.',
                duration: 1000,
                position: 'bottom',
                color: 'danger'
            });
        } else {
            let formData = {
                currentPassword: currentPassword,
                password: password,
                confirmPassword: passwordConfirm
            }
            setLoading(true)
            setTimeout(async () => {
                await Service.profile.changePassword(formData)
                    .then(async (response) => {
                        setLoading(false)
                        let messsage = response.data.message
                        toast({
                            message: messsage,
                            duration: 1000,
                            position: 'bottom',
                            color: 'success'
                        });
                        setModalPassword(false)
                    })
                    .catch((error) => {
                        setLoading(false)
                        toast({
                            message: error.response.data?.error,
                            duration: 1000,
                            position: 'bottom',
                            color: 'danger'
                        });
                    })
            }, 2000)
        }
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

    useEffect(() => {
        if (user !== null) {
            setName(user.name)
            setPhone(parseInt(user.phone))
            setEmail(user.email)
            setAddress(user.address)
            setGender(user.gender)
        }
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
                                    value={name}
                                    type="text"
                                    placeholder="Please Enter Your Name"
                                    onIonChange={(e) => { setName(String(e.target.value)) }}
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
                                <IonSelect onIonChange={(e) => { setGender(String(e.target.value)) }} placeholder="Please Select Your Gender" disabled={loading} labelPlacement='stacked' value={gender}>
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
                                    value={phone}
                                    type="number"
                                    placeholder="Please Enter Your Phone Number"
                                    onIonChange={(e) => { setPhone(parseInt(String(e.target.value))) }}
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
                                    value={email}
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
                        </IonList>
                        <IonList style={{ marginTop: '10px' }}>
                            <IonItem>
                                <IonTextarea onIonChange={(e) => { setAddress(String(e.target.value)) }} labelPlacement="stacked" disabled={loading} value={address}>
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
                                        <IonInput disabled={loading} onIonChange={(e) => { setCurrentPassword(String(e.target.value)) }} labelPlacement="stacked" clearInput={true} id="txtPasswordOld" type="password" placeholder="Current Password">
                                            <IonIcon slot="start" icon={lockClosed} aria-hidden="true"></IonIcon>
                                            <IonInputPasswordToggle slot="end"></IonInputPasswordToggle>
                                            <div slot="label">
                                                Current Password <IonText color="danger">*</IonText>
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