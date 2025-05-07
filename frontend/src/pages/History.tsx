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
} from '@ionic/react';

import { useState, useEffect } from "react";
import { search, fastFood, rocket } from 'ionicons/icons';
import DetailOrder from '../components/DetailOrder';

const History: React.FC = () => {

    const [items, setItems] = useState<any[]>([]);
    const [modalView, setModalView] = useState(false);
    const [order, setOrder] = useState('')

    const generateItems = () => {
        const newItems = [];
        for (let i = 1; i <= 10; i++) {
            let table = randomIntFromInterval(1, 10)
            let indexes = randomIntFromInterval(1, 1000)
            let orderNumber = String(indexes).padStart(5, '0')
            let orderType = randomIntFromInterval(1, 2)
            let totalItem = randomIntFromInterval(1, 20)
            let tax = randomIntFromInterval(1, 10)
            let disc = randomIntFromInterval(1, 10)
            let subtotal = randomIntFromInterval(100, 1000)
            let totalTax = subtotal * (tax / 100)
            let totalDisc = subtotal * (disc / 100)
            let totalPaid = (subtotal + totalTax) - totalDisc
            let order = {
                "customer_name": "Sandy Andryanto",
                "cashier_name": "John Doe",
                "order_type": orderType,
                "code": orderNumber,
                "date": new Date().toLocaleString("en-US", { timeZone: "America/New_York" }),
                "table": String(table).padStart(2, '0'),
                "total_item": totalItem,
                "tax": tax,
                "total_tax": totalTax,
                "subtotal": subtotal,
                "disc": disc,
                "total_disc": totalDisc,
                "total_paid": parseFloat(String(totalPaid)).toFixed(2)
            }
            newItems.push(order);
        }
        setItems(newItems);
    }

    const randomIntFromInterval = (min: number, max: number) => {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    const handleInput = (event: any) => {
        if (event.target.value) {
            let searchValue = event.target.value
            searchValue = searchValue.toLowerCase()
            let searchItems = items.filter((item: any) =>
                item.customer_name.toLowerCase().includes(searchValue) ||
                item.cashier_name.toLowerCase().includes(searchValue) ||
                item.date.toLowerCase().includes(searchValue) ||
                item.code.toLowerCase().includes(searchValue) ||
                item.table.toLowerCase().includes(searchValue) ||
                item.date.toLowerCase().includes(searchValue)
            )
            setItems(searchItems)
        } else {
            generateItems()
        }
    }

    const handleView = (event: any, order: any) => {
        setOrder(order)
        setModalView(true)
    }

    useEffect(() => {
        generateItems();
        return () => {
            setItems([])
        };
    }, []);

    return (
        <>
            <div style={{ marginTop: '70px' }}>
                <IonSearchbar placeholder="Search" showClearButton="always" debounce={1000} onIonInput={(event) => handleInput(event)}></IonSearchbar>
            </div>
            <div className='ion-no-margin'>
                {items.map((item, index) => (
                    <IonCard key={index}>
                        <IonCardHeader color={'primary'} className='ion-padding' style={{ textAlign: 'center' }}>
                            <IonCardSubtitle>
                                <IonText color={'light'}>{`Detail Order ${item.code}`}</IonText>
                            </IonCardSubtitle>
                        </IonCardHeader>
                        <IonCardContent className='ion-no-padding'>
                            <IonList inset={true} lines="none">
                                <IonItem>
                                    <IonLabel>Order ID</IonLabel>
                                    <IonNote slot="end">{item.code}</IonNote>
                                </IonItem>
                                <IonItem>
                                    <IonLabel>Order Type</IonLabel>
                                    <IonNote slot="end" color={item.order_type === 1 ? 'success' : 'primary'}>
                                        <IonIcon style={{ marginRight: '5px' }} icon={item.order_type === 1 ? fastFood : rocket} />{item.order_type === 1 ? 'Dine In' : 'Take Away'}
                                    </IonNote>
                                </IonItem>
                                <IonItem>
                                    <IonLabel>Order Date</IonLabel>
                                    <IonNote slot="end">{item.date}</IonNote>
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
                                        <IonNote slot="end">{item.table}</IonNote>
                                    </IonItem>
                                </> : <></>}
                                <IonItem>
                                    <IonLabel color={'primary'}>Total Item</IonLabel>
                                    <IonNote slot="end" color={'primary'}>{item.total_item}</IonNote>
                                </IonItem>
                                <IonItem>
                                    <IonLabel color={'danger'}>Total Paid</IonLabel>
                                    <IonNote slot="end" color={'danger'}>$ {parseFloat(item.total_paid).toFixed(2)}</IonNote>
                                </IonItem>
                            </IonList>
                        </IonCardContent>
                        <IonButton expand="full" color="dark" onClick={(event) => handleView(event, item.table)}>
                            <IonIcon icon={search} style={{ marginRight: '2px' }} color='light' />
                            <IonText color='light'>View Order</IonText>
                        </IonButton>
                    </IonCard>
                ))}
            </div>
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
                            <IonCardTitle>TABLE {order}</IonCardTitle>
                        </IonCardHeader>
                        <IonCardContent>
                            <DetailOrder />
                        </IonCardContent>
                    </IonCard>
                </IonContent>
            </IonModal>
        </>
    );
}

export default History;