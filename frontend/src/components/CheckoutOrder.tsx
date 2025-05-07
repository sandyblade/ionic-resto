import {
    IonItem,
    IonLabel,
    IonList,
    IonText,
    IonChip,
    IonButton,
    IonTabBar,
    IonContent,
    IonInput,
    IonTab,
    IonTabs,
    IonIcon,
    IonTabButton,
    IonSearchbar,
    IonNote,
    useIonAlert,
    IonSelect,
    IonSelectOption,
    useIonLoading,
    useIonToast
} from '@ionic/react';
import MenuList from '../stores/Menu';
import { useState, useEffect } from "react";
import {
    create,
    bagCheck,
    wineOutline,
    clipboard,
    iceCream,
    pizza,
    wine,
    star,
    starOutline,
    fastFood,
    cash,
    add,
    close,
    remove,
    person,
    cart
} from 'ionicons/icons';

interface ICreateOrder { callback: any }

const CheckoutOrder: React.FC<ICreateOrder> = (props: ICreateOrder) => {

    const [tableSelected, setTableSelected] = useState("");
    const [totalPaid, setTotalPaid] = useState(0.0)
    const [orderNumber, setOrderNumber] = useState("0")
    const [items, setItems] = useState<any[]>([]);
    const [tables, setTables] = useState<any[]>([]);
    const [checkoutAlert] = useIonAlert();
    const [present, dismiss] = useIonLoading();
    const [toast] = useIonToast();


    const generateItems = () => {
        let totalPaidTemp = 0
        let item = MenuList.sort(() => Math.random() - 0.5);
        const newItems = [];
        const tableItems = []
        for (let i = 0; i < item.length; i++) {
            let qty = randomIntFromInterval(1, 10)
            let menu = item[i]
            let tableCode = String(i + 1).padStart(2, '0')
            let exists = randomIntFromInterval(1, 2)
            let total = menu.price * qty
            menu["qty"] = exists === 1 ? qty : 0
            menu["total"] = exists === 1 ? total : 0.0
            newItems.push(menu);
            tableItems.push(`TABLE ${tableCode}`)
            totalPaidTemp = totalPaidTemp + total
        }
        let indexes = randomIntFromInterval(1, 1000)
        let orderNumberGenerate = String(indexes).padStart(5, '0')
        let tableCode = randomIntFromInterval(0, 10)

        setOrderNumber(orderNumberGenerate)
        setItems(newItems);
        setTables(tableItems);
        setTotalPaid(totalPaidTemp)

        if (tableItems[tableCode]! == undefined) {
            setTableSelected(tableItems[tableCode])
        }
    }

    const randomIntFromInterval = (min: number, max: number) => {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    const handleSelected = (event: any) => {
        setTableSelected(event.target.value)
    }

    const handleCheckOut = (event: any) => {
        checkoutAlert({
            header: 'Checkout Confirmation',
            message: 'Are you sure to checkout this order ?',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel'
                },
                {
                    text: 'Yes',
                    role: 'confirm',
                    handler: () => {
                        present({
                            message: 'Checkout....',
                            duration: 3000,
                            spinner: "circular",
                            onDidDismiss: (() => {
                                toast({
                                    message: 'Success, your order has been checkout. !',
                                    duration: 1500,
                                    position: 'top',
                                });
                                props.callback()
                            })
                        });
                    },
                },
            ]
        })
    }

    const handlePlus = (event: any, item: any) => {
        let sum = 0
        let updateOrders = items.map(mn => {
            if (mn.name === item.name) {
                let qty = parseInt(mn.qty) + 1
                let total = parseFloat(mn.price) * qty
                mn.qty = qty
                mn.total = total
            }
            sum = sum + mn.total
            return mn;
        });
        setItems(updateOrders)
        setTotalPaid(sum)
    }

    const handleMinus = (event: any, item: any) => {
        let sum = 0
        let updateOrders = items.map(mn => {
            if (mn.name === item.name && parseInt(item.qty) > 1) {
                let qty = parseInt(mn.qty) - 1
                let total = parseFloat(mn.price) * qty
                mn.qty = qty
                mn.total = total
            }
            sum = sum + mn.total
            return mn;
        });
        setItems(updateOrders)
        setTotalPaid(sum)
    }

    const handleRemove = (event: any, item: any) => {
        let sum = 0
        let updateOrders = items.filter((order) => order.name !== item.name);
        items.map(mn => {
            if (mn.name === item.name) {
                let qty = parseInt(mn.qty) - 1
                let total = parseFloat(mn.price) * qty
                mn.qty = qty
                mn.total = total
            }
            sum = sum + mn.total
            return mn;
        });
        setItems(updateOrders)
        setTotalPaid(sum)
    }

    useEffect(() => {
        generateItems();
        return () => {
            setItems([])
        };
    }, []);

    return (
        <>
            <IonTabs>
                <IonTab tab="order-menu">
                    <div id="order-menu-page">
                        <IonContent fullscreen={true} className='ion-padding'>
                            {items.length === 0 ? <>
                                <div style={{ marginTop: '10px', textAlign: 'center' }}>
                                    <IonNote>No Orders</IonNote>
                                </div>
                            </> : <>
                                <IonText color={"primary"}>
                                    <h4><IonIcon icon={fastFood} style={{ marginRight: '2px' }} />Primary Items</h4>
                                </IonText>
                                <IonList lines="none">
                                    {items.filter(item => item.qty > 0).map((item, index) => (
                                        <IonItem key={index} className="ion-no-padding ion-margin-top">
                                            <div className='img-list'>
                                                <img alt={item.name} className='image-cart' src={item.image} />
                                            </div>
                                            <IonLabel className="ion-text-wrap">
                                                <small style={{ fontWeight: 'bold' }}> {item.name} {' '} (${parseFloat(item.price).toFixed(2)} x {item.qty} )</small>
                                                <br />
                                                <small style={{ fontWeight: 'bold', color: '#28a745' }}>{' '}${parseFloat(item.total).toFixed(2)}</small>
                                            </IonLabel>
                                            <div style={{ clear: 'both' }}>
                                                <IonButton size='small' onClick={(event) => handlePlus(event, item)} shape="round" color={'success'}>
                                                    <IonIcon slot="icon-only" color={'light'} icon={add}></IonIcon>
                                                </IonButton>
                                                <IonButton size='small' onClick={(event) => handleMinus(event, item)} shape="round" color={'warning'}>
                                                    <IonIcon slot="icon-only" color={'light'} icon={remove}></IonIcon>
                                                </IonButton>
                                                <IonButton size='small' onClick={(event) => handleRemove(event, item)} shape="round" color={'danger'}>
                                                    <IonIcon slot="icon-only" icon={close}></IonIcon>
                                                </IonButton>
                                            </div>
                                        </IonItem>
                                    ))}
                                </IonList>
                                <div style={{ marginTop: '10px', textAlign: 'center' }}>
                                    <IonText color="danger" style={{ fontWeight: 'bold' }}>
                                        <h2>
                                            <strong>TOTAL PAID: ${totalPaid.toFixed(2)}</strong>
                                        </h2>
                                    </IonText>
                                </div>
                                <IonText color={"tertiary"}>
                                    <h4><IonIcon icon={iceCream} style={{ marginRight: '2px' }} />Other Additionals</h4>
                                </IonText>
                                <IonList lines="none">
                                    {items.filter(item => item.qty === 0).map((item, index) => (
                                        <IonItem key={index} className="ion-no-padding ion-margin-top">
                                            <div className='img-list'>
                                                <img alt={item.name} className='image-cart' src={item.image} />
                                            </div>
                                            <IonLabel className="ion-text-wrap">
                                                <small style={{ fontWeight: 'bold' }}> {item.name}</small>
                                                <br />
                                                <small style={{ fontWeight: 'bold' }}>{' '}${parseFloat(item.price).toFixed(2)}</small>
                                            </IonLabel>
                                            <div style={{ clear: 'both' }}>
                                                <IonButton size='small' onClick={(event) => handlePlus(event, item)} shape="round" color={'success'}>
                                                    <IonIcon slot="icon-only" color={'light'} icon={add}></IonIcon>
                                                </IonButton>
                                            </div>
                                        </IonItem>
                                    ))}
                                </IonList>


                            </>}
                        </IonContent>
                    </div>
                </IonTab>
                <IonTab tab="order-payment">
                    <div id="order-payment-menu" className='ion-padding'>
                        <IonList>
                            <IonItem className='ion-no-padding' style={{ marginBottom: '10px' }}>
                                <IonInput
                                    labelPlacement="stacked"
                                    id="txtOrderNumer"
                                    clearInput={true}
                                    readonly={true}
                                    value={orderNumber}
                                    type="text"
                                    placeholder="Please Enter Your Name"
                                >
                                    <IonIcon slot="start" icon={clipboard} aria-hidden="true"></IonIcon>
                                    <div slot="label">
                                        Order Number <IonText color="danger">*</IonText>
                                    </div>
                                </IonInput>
                            </IonItem>
                            <IonItem className='ion-no-padding' style={{ marginBottom: '10px' }}>
                                <IonInput
                                    labelPlacement="stacked"
                                    id="txtCustomerName"
                                    clearInput={true}
                                    value={"John Doe"}
                                    type="text"
                                    placeholder="Please Enter Customer Name"
                                >
                                    <IonIcon slot="start" icon={person} aria-hidden="true"></IonIcon>
                                    <div slot="label">
                                        Customer Name <IonText color="danger">*</IonText>
                                    </div>
                                </IonInput>
                            </IonItem>
                            <IonItem className='ion-no-padding' style={{ marginBottom: '10px' }}>
                                <IonSelect placeholder="Please Select Your Table" labelPlacement='stacked' value={tableSelected} onIonChange={handleSelected}>
                                    <IonIcon slot="start" icon={wineOutline} aria-hidden="true"></IonIcon>
                                    <div slot="label">
                                        Table<IonText color="danger">*</IonText>
                                    </div>
                                    {tables.map((aa, index) => (
                                        <IonSelectOption key={index} value={aa}>{aa}</IonSelectOption>
                                    ))}
                                </IonSelect>
                            </IonItem>
                            <IonItem className='ion-no-padding' style={{ marginBottom: '10px' }}>
                                <IonInput
                                    labelPlacement="stacked"
                                    id="txtTotalPaid"
                                    clearInput={true}
                                    readonly={true}
                                    value={parseFloat(String(totalPaid)).toFixed(2)}
                                    type="text"
                                    placeholder="Please Enter Total Paid"
                                >
                                    <IonIcon slot="start" icon={cash} aria-hidden="true"></IonIcon>
                                    <div slot="label">
                                        Total Paid <IonText color="danger">*</IonText>
                                    </div>
                                </IonInput>
                            </IonItem>
                        </IonList>
                        <IonButton onClick={handleCheckOut} color={"danger"} expand="block">
                            <IonIcon icon={bagCheck} color='light' style={{ marginRight: '2px' }} />  <IonText color='light'>Checkout Payment</IonText>
                        </IonButton>
                    </div>
                </IonTab>
                <IonTabBar slot="bottom">
                    <IonTabButton tab="order-menu" >
                        <IonIcon icon={fastFood} />
                        List Menu
                    </IonTabButton>
                    <IonTabButton tab="order-payment">
                        <IonIcon icon={bagCheck} />
                        Checkout
                    </IonTabButton>
                </IonTabBar>
            </IonTabs>
        </>
    )

}

export default CheckoutOrder