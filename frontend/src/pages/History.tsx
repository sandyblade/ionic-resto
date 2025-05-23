import {
    IonSearchbar,
    IonButton,
    IonLabel,
    IonIcon,
    IonItem,
    IonList,
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonCardSubtitle,
    IonNote,
    IonHeader,
    IonTitle,
    IonButtons,
    IonToolbar,
    IonContent,
    IonCardTitle,
    IonModal,
    IonText,
    IonAlert,
    useIonLoading,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
} from '@ionic/react';

import queryString from 'query-string'
import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { fastFood, rocket } from 'ionicons/icons';
import DetailOrder from '../components/DetailOrder';
import { Shimmer } from 'react-shimmer'
import Service from "../Service"

const History = forwardRef((props, ref) => {

    const [loading, setLoading] = useState(true)
    const [items, setItems] = useState<any[]>([]);
    const [cart, setCart] = useState<any[]>([]);
    const [order, setOrder] = useState<any>();
    const [errorReseponse, setErrorResponse] = useState('')
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState('')
    const [modalView, setModalView] = useState(false);
    const [present, dismiss] = useIonLoading();
    const limit: number = 10

    useImperativeHandle(ref, () => ({
        setLoadData() {
            loadData()
        }
    }));

    const addMore = async (pageMore: number) => {

        let params: any = {
            page: pageMore,
            limit: limit
        }

        if (search) {
            params = {
                ...params,
                search: search
            }
        }

        const filterQueryParam = decodeURIComponent(queryString.stringify(params))
        await Service.history.list(filterQueryParam)
            .then((response) => {
                const data = response.data
                setItems([...items, ...data])
            })
            .catch((error) => {
                const msg = error.status === 401 ? Service.expiredMessage : (error.message || error.response.data?.message)
                setErrorResponse(msg)
            })

    }

    const loadData = async () => {

        let params: any = {
            page: page,
            limit: limit
        }

        if (search) {
            params = {
                ...params,
                search: search
            }
        }

        const filterQueryParam = decodeURIComponent(queryString.stringify(params))

        setLoading(true)
        await Service.history.list(filterQueryParam)
            .then((response) => {
                const data = response.data
                setItems(data)
                setTimeout(() => {
                    setLoading(false)
                }, 1500)
            })
            .catch((error) => {
                const msg = error.status === 401 ? Service.expiredMessage : (error.message || error.response.data?.message)
                setErrorResponse(msg)
            })
    }

    const handleView = async (event: any, id: string) => {
        const e = event
        e.preventDefault();
        present({ message: 'Please Wait.....', duration: 0 });
        await Service.order.detail(id)
            .then((response) => {
                const data = response.data
                setOrder(data.order)
                setCart(data.cart)
                setTimeout(() => {
                    dismiss()
                    setModalView(true)
                }, 1500)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    useEffect(() => {
        loadData();
        return () => {
            setItems([])
            setLoading(false)
            setSearch('')
            setCart([])
            setOrder({})
        };
    }, []);

    return (
        <>
            <div style={{ marginTop: '70px' }}>
                <IonSearchbar
                    onIonClear={() => {
                        setSearch('')
                        setTimeout(loadData)
                    }} onIonInput={(event: Event) => {
                        const value = (event.target as HTMLIonInputElement).value as string
                        if (value !== null && value !== '') {
                            setSearch(value)
                            setTimeout(loadData)
                        }
                    }} placeholder="Search" showClearButton="always" debounce={1000}></IonSearchbar>
            </div>
            <div className='ion-no-margin'>
                {loading ? <>
                    {Array.from(Array(10), (e, i) => {
                        return (
                            <IonCard key={i} className='ion-margin-top'>
                                <Shimmer width={500} height={80} />
                            </IonCard>
                        )
                    })}
                </> : <>
                    {items.map((item, index) => (
                        <IonCard key={index}>
                            <IonCardHeader color={'primary'} className='ion-padding' style={{ textAlign: 'center' }}>
                                <IonCardSubtitle>
                                    <IonText color={'light'}>{`Detail Order ${item.order_number}`}</IonText>
                                </IonCardSubtitle>
                            </IonCardHeader>
                            <IonCardContent className='ion-no-padding'>
                                <IonList inset={true} lines="none">
                                    <IonItem>
                                        <IonLabel>Order ID </IonLabel>
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
                            <IonButton expand="full" color="dark" onClick={(event) => handleView(event, item._id)}>
                                <IonIcon icon={search} style={{ marginRight: '2px' }} color='light' />
                                <IonText color='light'>View Order</IonText>
                            </IonButton>
                        </IonCard>
                    ))}
                </>}
            </div>
            <IonModal isOpen={modalView && cart.length > 0}>
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
                            <IonCardTitle>TABLE {order?.table_number}</IonCardTitle>
                        </IonCardHeader>
                        <IonCardContent>
                            <DetailOrder items={cart} totalPaid={order?.total_paid} />
                        </IonCardContent>
                    </IonCard>
                </IonContent>
            </IonModal>
            <IonInfiniteScroll
                onIonInfinite={(event) => {
                    const nextPage = page + 1
                    setPage(nextPage)
                    setTimeout(() => {
                        addMore(nextPage)
                    }, 500)
                    setTimeout(() => event.target.complete(), 500);
                }}
            >
                <IonInfiniteScrollContent>
                    <IonInfiniteScrollContent loadingText="Please wait..." ></IonInfiniteScrollContent>
                </IonInfiniteScrollContent>
            </IonInfiniteScroll>
            <IonAlert
                isOpen={errorReseponse !== ''}
                header="Request Failed"
                subHeader="Could not get status."
                message={errorReseponse}
                buttons={['Ok']}
                onDidDismiss={() => setErrorResponse('')}
            ></IonAlert>
        </>
    )

})

export default History;