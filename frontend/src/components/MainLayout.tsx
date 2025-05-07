import {
    IonIcon,
    IonTabBar,
    IonTabButton,
    IonTabs,
    IonTab,
    IonFab,
    IonFabButton,
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonMenuButton,
    IonButton,
    IonContent,
    IonModal,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonFabList
} from '@ionic/react';
import { homeSharp, timeSharp, personOutline, search, wallet, restaurant, create, add, fastFood } from 'ionicons/icons';
import Home from '../pages/Home';
import Menu from '../pages/Menu';
import History from '../pages/History';
import Profile from '../pages/Profile';
import DetailOrder from './DetailOrder';
import CreateOrder from './CreateOrder';
import CheckoutOrder from './CheckoutOrder';
import { useState, useEffect, useCallback } from "react";


const MainLayout: React.FC = () => {


    const [title, setTitle] = useState('Home');
    const [modalCart, setModalCart] = useState(false);
    const [modalView, setModalView] = useState(false);
    const [modalCheckout, setModalCheckout] = useState(false);
    const [modalCreate, setModalCreate] = useState(false);
    const [items, setItems] = useState<string[]>([]);


    const generateItems = (max: number) => {
        const newItems = [];
        for (let i = 1; i <= max; i++) {
            let indexNumber = String(i).padStart(2, '0')
            newItems.push(`TABLE ${indexNumber}`);
        }
        setItems(newItems);
    };

    const handleTitle = (event: any) => {
        let tabTitle = event.detail.tab
        let tabName = String(tabTitle).charAt(0).toUpperCase() + String(tabTitle).slice(1);
        setTitle(tabName)
    }

    const finishOrder = useCallback(() => {
        setModalCreate(false)
        setModalCheckout(false)
        setModalCart(false)
        setModalView(false)
    }, []);

    useEffect(() => {
        generateItems(10);
        return () => {
            setItems([])
        };
    }, []);

    return (
        <>
            <IonPage id="main-content">
                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot="start">
                            <IonMenuButton></IonMenuButton>
                        </IonButtons>
                        <IonTitle>{title}</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonTabs>
                    <IonTab tab="home">
                        <div id="home-page">
                            <IonContent fullscreen={true}>
                                <Home />
                            </IonContent>
                        </div>
                    </IonTab>
                    <IonTab tab="history">
                        <div id="history-page">
                            <IonContent fullscreen={true}>
                                <History />
                            </IonContent>
                        </div>
                    </IonTab>
                    <IonTab tab="menu">
                        <div id="menu-page">
                            <IonContent fullscreen={true}>
                                <Menu />
                            </IonContent>
                        </div>
                    </IonTab>
                    <IonTab tab="profile">
                        <div id="profile-page">
                            <IonContent fullscreen={true}>
                                <Profile />
                            </IonContent>
                        </div>
                    </IonTab>
                    <IonTabBar slot="bottom">
                        <IonTabButton tab="home" onClick={handleTitle}>
                            <IonIcon icon={homeSharp} />
                            Home
                        </IonTabButton>
                        <IonTabButton tab="history" onClick={handleTitle}>
                            <IonIcon icon={timeSharp} />
                            History
                        </IonTabButton>
                        <IonTabButton tab="menu" onClick={handleTitle}>
                            <IonIcon icon={fastFood} />
                            Menu
                        </IonTabButton>
                        <IonTabButton tab="profile" onClick={handleTitle}>
                            <IonIcon icon={personOutline} />
                            Profile
                        </IonTabButton>
                    </IonTabBar>
                </IonTabs>
                <IonFab slot="fixed" vertical="bottom" horizontal="center">
                    <IonFabButton size='small'>
                        <IonIcon icon={add}></IonIcon>
                    </IonFabButton>
                    <IonFabList side="top">
                        <IonFabButton color="warning" onClick={() => setModalCart(true)}>
                            <IonIcon icon={restaurant} color='light'></IonIcon>
                        </IonFabButton>
                        <IonFabButton color={"danger"} onClick={() => setModalCreate(true)}>
                            <IonIcon icon={create} color='light'></IonIcon>
                        </IonFabButton>
                    </IonFabList>
                </IonFab>
                <IonModal isOpen={modalCart}>
                    <IonHeader>
                        <IonToolbar>
                            <IonTitle>Dine In</IonTitle>
                            <IonButtons slot="end">
                                <IonButton onClick={() => setModalCart(false)}>Close</IonButton>
                            </IonButtons>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent>
                        {items.map((item, index) => (
                            <IonCard key={index}>
                                <IonCardHeader color={'primary'} style={{ textAlign: 'center' }}>
                                    <IonCardTitle>{item}</IonCardTitle>
                                </IonCardHeader>
                                <IonCardContent>
                                    <DetailOrder />
                                </IonCardContent>
                                <div style={{ textAlign: 'center' }}>
                                    <IonButton onClick={() => setModalView(true)} fill="clear" color={"warning"} size='small'><IonIcon icon={search} />{' '}View</IonButton>
                                    <IonButton onClick={() => setModalCheckout(true)} fill="clear" color={"success"} size='small'><IonIcon icon={wallet} />{' '}Checkout</IonButton>
                                </div>
                            </IonCard>
                        ))}
                    </IonContent>
                </IonModal>
                <IonModal isOpen={modalView}>
                    <IonHeader>
                        <IonToolbar>
                            <IonTitle>Detail Order</IonTitle>
                            <IonButtons slot="end">
                                <IonButton onClick={() => setModalView(false)}>Close</IonButton>
                            </IonButtons>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent>
                        <IonCard>
                            <IonCardHeader color={'primary'} style={{ textAlign: 'center' }}>
                                <IonCardTitle>{"TABLE 01"}</IonCardTitle>
                            </IonCardHeader>
                            <IonCardContent>
                                <DetailOrder />
                            </IonCardContent>
                            <div style={{ textAlign: 'center' }}>
                                <IonButton onClick={() => setModalCheckout(true)} fill="clear" color={"success"} size='small'><IonIcon icon={wallet} />{' '}Checkout</IonButton>
                            </div>
                        </IonCard>
                    </IonContent>
                </IonModal>
                <IonModal isOpen={modalCheckout}>
                    <IonHeader>
                        <IonToolbar>
                            <IonTitle>Checkout Order</IonTitle>
                            <IonButtons slot="end">
                                <IonButton onClick={() => setModalCheckout(false)}>Close</IonButton>
                            </IonButtons>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent>
                        <CheckoutOrder callback={finishOrder} />
                    </IonContent>
                </IonModal>
                <IonModal isOpen={modalCreate}>
                    <IonHeader>
                        <IonToolbar>
                            <IonTitle>Create New Order</IonTitle>
                            <IonButtons slot="end">
                                <IonButton onClick={() => setModalCreate(false)}>Close</IonButton>
                            </IonButtons>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent>
                        <CreateOrder callback={finishOrder} />
                    </IonContent>
                </IonModal>
            </IonPage>
        </>
    )
}

export default MainLayout;