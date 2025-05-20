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
    IonAlert
} from '@ionic/react';

import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { search, fastFood, rocket } from 'ionicons/icons';
import DetailOrder from '../components/DetailOrder';
import { Shimmer } from 'react-shimmer'
import Service from "../Service"

const History = forwardRef((props, ref) => {

    const [loading, setLoading] = useState(true)
    const [loadingOrder, setLoadingOrder] = useState(true)
    const [items, setItems] = useState<any[]>([]);
    const [errorReseponse, setErrorResponse] = useState('')

    useImperativeHandle(ref, () => ({
        setLoadData() {
            loadData()
        }
    }));

    const loadData = async () => {
        setLoading(true)
        await Service.history.list()
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

    const handleInput = (event: any) => {
        if (event.target.value) {

        } else {
            loadData()
        }
    }

    const handleView = (event: any, order: any) => {

    }

    useEffect(() => {
        loadData();
        return () => {
            setItems([])
            setLoading(false)
            setLoadingOrder(false)
        };
    }, []);

    return (
        <>
            <div style={{ marginTop: '70px' }}>
                <IonSearchbar placeholder="Search" showClearButton="always" debounce={1000} onIonInput={(event) => handleInput(event)}></IonSearchbar>
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
                                        <IonLabel>Order ID</IonLabel>
                                        <IonNote slot="end">{item.order_number}</IonNote>
                                    </IonItem>
                                    <IonItem>
                                        <IonLabel>Order Type</IonLabel>
                                        <IonNote slot="end" color={item.order_type === 1 ? 'success' : 'primary'}>
                                            <IonIcon style={{ marginRight: '5px' }} icon={item.order_type === 1 ? fastFood : rocket} />{item.order_type === 1 ? 'Dine In' : 'Take Away'}
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
                                    {item.order_type === 1 ? <>
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
                            <IonButton expand="full" color="dark" onClick={(event) => handleView(event, item.table)}>
                                <IonIcon icon={search} style={{ marginRight: '2px' }} color='light' />
                                <IonText color='light'>View Order</IonText>
                            </IonButton>
                        </IonCard>
                    ))}
                </>}
            </div>
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