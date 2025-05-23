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
    IonFabList,
    IonList,
    IonItem,
    IonLabel,
    IonNote,
    IonText
} from '@ionic/react';
import { homeSharp, timeSharp, personOutline, search, wallet, restaurant, create, add, fastFood, rocket } from 'ionicons/icons';
import Home from '../pages/Home';
import Menu from '../pages/Menu';
import History from '../pages/History';
import Profile from '../pages/Profile';
import CreateOrder from './CreateOrder';
import CheckoutOrder from './CheckoutOrder';
import DetailOrder from './DetailOrder';
import { useState, useEffect, useCallback, useRef } from "react";
import Service from '../Service';
import { Shimmer } from 'react-shimmer'

const MainLayout: React.FC = () => {

    const [title, setTitle] = useState('Home');
    const [tab, setTab] = useState('home');
    const [modalCart, setModalCart] = useState(false);
    const [modalView, setModalView] = useState(false);
    const [modalCheckout, setModalCheckout] = useState(false);
    const [modalCreate, setModalCreate] = useState(false);
    const [items, setItems] = useState<string[]>([]);
    const homeRef = useRef<any>(null);
    const historyRef = useRef<any>(null);
    const menuRef = useRef<any>(null);
    const [order, setOrder] = useState<any[]>([]);
    const [loadingOrder, setLoadingOrder] = useState(true)
    const [detail, setDetail] = useState<any>();
    const [cart, setCart] = useState<any[]>([]);
    const [loadingCart, setLoadingCart] = useState(true)

    const handleTitle = (event: any) => {
        let tabTitle = event.detail.tab
        let tabName = String(tabTitle).charAt(0).toUpperCase() + String(tabTitle).slice(1);
        setTitle(tabName)
        setTab(tabTitle)
        if (tabTitle === 'home') {
            homeRef.current?.setLoadData()
        } else if (tabTitle === 'history') {
            historyRef.current?.setLoadData()
        } else if (tabTitle === 'menu') {
            menuRef.current?.setLoadData()
        }
    }

    const finishOrder = useCallback(() => {
        setModalCreate(false)
        setModalCheckout(false)
        setModalCart(false)
        setModalView(false)
        if (tab === 'home') {
            homeRef.current?.setLoadData()
        } else if (tab === 'history') {
            historyRef.current?.setLoadData()
        } else if (tab === 'menu') {
            menuRef.current?.setLoadData()
        }
    }, []);

    const loadPending = async () => {
        setLoadingOrder(true)
        await Service.order.pending()
            .then((response) => {
                const data = response.data
                setOrder(data)
                setTimeout(() => {
                    setLoadingOrder(false)
                }, 1500)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const loadCart = async (id: string) => {
        setLoadingCart(true)
        await Service.order.detail(id)
            .then((response) => {
                const data = response.data.cart
                setCart(data)
                setTimeout(() => {
                    setLoadingCart(false)
                }, 1500)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    useEffect(() => {
        return () => {
            setItems([])
            setOrder([])
            setDetail({})
            setCart([])
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
                                <Home ref={homeRef} />
                            </IonContent>
                        </div>
                    </IonTab>
                    <IonTab tab="history">
                        <div id="history-page">
                            <IonContent fullscreen={true}>
                                <History ref={historyRef} />
                            </IonContent>
                        </div>
                    </IonTab>
                    <IonTab tab="menu">
                        <div id="menu-page">
                            <IonContent fullscreen={true}>
                                <Menu ref={menuRef} />
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
                        <IonFabButton color="warning" onClick={() => {
                            setModalCart(true)
                            loadPending()
                        }}>
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
                        {loadingOrder ? <>
                            {Array.from(Array(10), (e, i) => {
                                return (
                                    <IonCard key={i} className='ion-margin-top'>
                                        <Shimmer width={500} height={80} />
                                    </IonCard>
                                )
                            })}
                        </> : <>
                            {order.map((item, index) => (
                                <IonCard key={index}>
                                    <IonCardHeader color={'primary'} style={{ textAlign: 'center' }}>
                                        <IonCardTitle>{`TABLE ${item.table_number}`}</IonCardTitle>
                                    </IonCardHeader>
                                    <IonCardContent>
                                        <IonList inset={true} lines="none">
                                            <IonItem>
                                                <IonLabel>Order ID {++index}</IonLabel>
                                                <IonNote slot="end">{item.order_number}</IonNote>
                                            </IonItem>
                                            <IonItem>
                                                <IonLabel>Order Type</IonLabel>
                                                <IonNote slot="end" color={item.order_type === 'Dine In' ? 'success' : 'primary'}>
                                                    <IonIcon style={{ marginRight: '5px' }} icon={item.order_type === 'Dine In' ? fastFood : rocket} />{item.order_type}
                                                </IonNote>
                                            </IonItem>
                                            <IonItem>
                                                <IonLabel>Order Date</IonLabel>
                                                <IonNote slot="end">{item.created_at}</IonNote>
                                            </IonItem>
                                            <IonItem>
                                                <IonLabel>Customer Name</IonLabel>
                                                <IonNote slot="end">{item.customer_name}</IonNote>
                                            </IonItem>
                                            <IonItem>
                                                <IonLabel>Casheir Name</IonLabel>
                                                <IonNote slot="end">{item.cashier_name}</IonNote>
                                            </IonItem>
                                            {item.order_type === 'Dine In' ? <>
                                                <IonItem>
                                                    <IonLabel>Table</IonLabel>
                                                    <IonNote slot="end">{item.table_number}</IonNote>
                                                </IonItem>
                                            </> : <></>}
                                            <IonItem>
                                                <IonLabel color={'primary'}>Total Item</IonLabel>
                                                <IonNote slot="end" color={'primary'}>{item.total_item}</IonNote>
                                            </IonItem>
                                            <IonItem>
                                                <IonLabel color={'danger'}>Total Paid</IonLabel>
                                                <IonNote slot="end" color={'danger'}>{' '}${parseFloat(item.total_paid).toFixed(2)}</IonNote>
                                            </IonItem>
                                        </IonList>
                                    </IonCardContent>
                                    <div style={{ textAlign: 'center' }}>
                                        <IonButton onClick={() => {
                                            setModalView(true)
                                            setDetail(item)
                                            loadCart(item._id)
                                        }} fill="clear" color={"warning"} size='small'><IonIcon icon={search} />{' '}View</IonButton>
                                        <IonButton onClick={() => {
                                            setModalCheckout(true)
                                            setDetail(item)
                                        }} fill="clear" color={"success"} size='small'><IonIcon icon={wallet} />{' '}Checkout</IonButton>
                                    </div>
                                </IonCard>
                            ))}
                        </>}
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
                                <IonCardTitle>{`TABLE ${detail?.table_number}`}</IonCardTitle>
                            </IonCardHeader>
                            <IonCardContent>
                                {loadingCart ? <>
                                    {Array.from(Array(10), (e, i) => {
                                        return (
                                            <IonCard key={i} className='ion-margin-top'>
                                                <Shimmer width={500} height={80} />
                                            </IonCard>
                                        )
                                    })}
                                </> : <>
                                    <DetailOrder items={cart} totalPaid={detail?.total_paid} />
                                </>}
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
                        <CheckoutOrder callback={finishOrder} orderId={detail?._id} />
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