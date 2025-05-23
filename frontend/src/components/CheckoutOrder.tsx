import {
    IonItem,
    IonLabel,
    IonList,
    IonText,
    IonButton,
    IonTabBar,
    IonContent,
    IonInput,
    IonTab,
    IonTabs,
    IonIcon,
    IonTabButton,
    IonNote,
    useIonAlert,
    IonSelect,
    IonSelectOption,
    useIonLoading,
    useIonToast
} from '@ionic/react';
import { useState, useEffect } from "react";
import {
    bagCheck,
    wineOutline,
    clipboard,
    iceCream,
    fastFood,
    cash,
    add,
    close,
    remove,
    person
} from 'ionicons/icons';
import Service from '../Service';
import { Shimmer } from 'react-shimmer'

interface ICreateOrder {
    callback: any,
    orderId: any
}

interface userInterface {
    email: string,
    phone: string,
    gender: string,
    name: string,
    address: string
}

const CheckoutOrder: React.FC<ICreateOrder> = (props: ICreateOrder) => {

    const [tableSelected, setTableSelected] = useState("");
    const [totalPaid, setTotalPaid] = useState(0.0)
    const [orderNumber, setOrderNumber] = useState("0")
    const [items, setItems] = useState<any[]>([]);
    const [tables, setTables] = useState<any[]>([]);
    const [checkoutAlert] = useIonAlert();
    const [present, dismiss] = useIonLoading();
    const [toast] = useIonToast();
    const [customerName, setCustomerName] = useState('')
    const [maxRating, setMaxRating] = useState(0)
    const [loadingData, setLoadingData] = useState(false);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const user: userInterface | null = (localStorage.getItem('auth_user') !== undefined && localStorage.getItem('auth_user') !== null) ? JSON.parse(String(localStorage.getItem('auth_user'))) : null

    const loadData = async () => {
        setLoadingData(true)
        await Service.order.detail(props.orderId)
            .then((response) => {
                const data = response.data
                const order = data.order
                const cart = data.cart
                const tables = data.tables
                const additional = data.additional
                const menu: Array<any> = []
                const menu_names: Array<string> = []

                cart.map((m: any) => {
                    const obj = {
                        id: m._id,
                        name: m.menu_name,
                        image: m.menu_image,
                        price: parseFloat(m.price['$numberDecimal']),
                        qty: m.qty,
                        total: parseFloat(m.total['$numberDecimal'])
                    }
                    menu.push(obj)
                    menu_names.push(m.menu_name)
                })

                additional.map((a: any) => {
                    if (!menu_names.includes(a.name)) {
                        const obj = {
                            id: a._id,
                            name: a.name,
                            image: a.image,
                            price: parseFloat(a.price['$numberDecimal']),
                            qty: 0,
                            total: 0,
                        }
                        menu.push(obj)
                    }
                })

                setTotalPaid(order.total_paid)
                setOrderNumber(order.order_number)
                setItems(menu)
                setTables(tables)
                setTableSelected(order.table_number)
                setCustomerName(order.customer_name)
                setTimeout(() => {
                    setLoadingData(false)
                }, 1500)
            })
            .catch((error) => {
                console.log(error)
            })
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
                    handler: async () => {
                        const orders = items.filter((x) => x.qty > 0)
                        const formData = {
                            order_number: orderNumber,
                            customer_name: customerName,
                            order_type: 'Dine In',
                            status: 1,
                            cart: orders,
                            table_number: tableSelected,
                            cashier_name: user?.name
                        }
                        present({ message: 'Please Wait.....', duration: 0, spinner: "circular" });
                        await Service.order.save(formData)
                            .then(() => {
                                setTimeout(() => {
                                    toast({
                                        message: 'Success, your order has been checkout. !',
                                        duration: 1500,
                                        position: 'bottom',
                                    });
                                    setTimeout(() => {
                                        props.callback()
                                        dismiss()
                                    }, 500)
                                }, 1500)
                            })
                            .catch((error) => {
                                const msg = error.status === 401 ? Service.expiredMessage : (error.message || error.response.data?.message)
                                toast({
                                    message: msg,
                                    duration: 1500,
                                    position: 'top',
                                });
                            })
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
        let updateOrders = items.map((order) => {
            if (order.name === item.name) {
                return { ...order, qty: 0, total: 0 };
            }
            return order;
        });
        updateOrders.map(mn => {
            let qty = parseInt(mn.qty)
            let total = parseFloat(mn.price) * qty
            mn.qty = qty
            mn.total = total
            sum = sum + mn.total
            return mn;
        });
        setItems(updateOrders)
        setTotalPaid(sum)
    }

    useEffect(() => {
        loadData()
        return () => {
            setItems([])
            setCustomerName('')
            setTableSelected('')
            setTables([])
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
                                    value={customerName}
                                    type="text"
                                    placeholder="Please Enter Customer Name"
                                    onIonChange={(event: any) => {
                                        if (event.target.value) {
                                            setCustomerName(event.target.value)
                                        } else {
                                            setCustomerName('')
                                        }
                                    }}
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
                                        <IonSelectOption key={index} value={aa.name}>{aa.name}</IonSelectOption>
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
                        <IonButton disabled={totalPaid === 0 || tableSelected === '' || customerName === ''} onClick={handleCheckOut} color={"danger"} expand="block">
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