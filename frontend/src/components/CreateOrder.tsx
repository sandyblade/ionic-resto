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

const CreateOrder: React.FC<ICreateOrder> = (props: ICreateOrder) => {

    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState<any[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [totalPaid, setTotalPaid] = useState(0.0)
    const [filter, setFilter] = useState("all")
    const [orderType, setOrderType] = useState('1');
    const [tableSelected, setTableSelected] = useState("");
    const [tables, setTables] = useState<any[]>([]);
    const [orderNumber, setOrderNumber] = useState("0")
    const [checkoutAlert] = useIonAlert();
    const [saveOrderAlert] = useIonAlert();
    const [present, dismiss] = useIonLoading();
    const [toast] = useIonToast();

    const generateItems = () => {
        let item = MenuList.sort(() => Math.random() - 0.5);
        const newItems = [];
        const tableItems = []
        for (let i = 0; i < item.length; i++) {
            let menu = item[i]
            let tableCode = String(i + 1).padStart(2, '0')
            menu["qty"] = 1
            menu["total"] = menu.price
            newItems.push(menu);
            tableItems.push(`TABLE ${tableCode}`)
        }
        let indexes = randomIntFromInterval(1, 1000)
        let orderNumberGenerate = String(indexes).padStart(5, '0')
        setOrderNumber(orderNumberGenerate)
        setItems(newItems);
        setTables(tableItems);
    }

    const handleInput = (event: any) => {
        if (event.target.value) {
            let searchValue = event.target.value
            searchValue = searchValue.toLowerCase()
            let searchItems = items.filter((item) => item.name.toLowerCase().includes(searchValue) || item.category.toLowerCase().includes(searchValue))
            setItems(searchItems)
        } else {
            generateItems()
        }
    }

    const handleFilter = (event: any, type: string) => {
        setFilter(type)
        setTimeout(() => {
            type = type.toLowerCase()
            let searchItems = items.filter((item) => item.category.toLowerCase().includes(type))
            if (searchItems.length > 0) {
                setItems(searchItems)
            } else {
                generateItems()
                setFilter("all")
            }
        }, 500)
    }

    const handleItem = (event: any, menu: any) => {
        let newOrder = menu
        if (orders.length === 0) {
            setOrders((x) => [...x, newOrder]);
            setTotalPaid(menu.price)
        } else {
            let filter = orders.filter((item) => item.name === menu.name)
            if (filter.length === 0) {
                setOrders((x) => [...x, newOrder]);
                setTotalPaid(totalPaid + menu.price);
            } else {
                let sum = 0
                let updateOrders = orders.map(mn => {
                    if (mn.name === menu.name) {
                        let qty = parseInt(mn.qty) + 1
                        let total = parseFloat(mn.price) * qty
                        mn.qty = qty
                        mn.total = total
                    }
                    sum = sum + mn.total
                    return mn;
                });
                setOrders(updateOrders)
                setTotalPaid(sum)
            }
        }

    }

    const handlePlus = (event: any, item: any) => {
        let sum = 0
        let updateOrders = orders.map(mn => {
            if (mn.name === item.name) {
                let qty = parseInt(mn.qty) + 1
                let total = parseFloat(mn.price) * qty
                mn.qty = qty
                mn.total = total
            }
            sum = sum + mn.total
            return mn;
        });
        setOrders(updateOrders)
        setTotalPaid(sum)
    }

    const handleMinus = (event: any, item: any) => {
        let sum = 0
        let updateOrders = orders.map(mn => {
            if (mn.name === item.name && parseInt(item.qty) > 1) {
                let qty = parseInt(mn.qty) - 1
                let total = parseFloat(mn.price) * qty
                mn.qty = qty
                mn.total = total
            }
            sum = sum + mn.total
            return mn;
        });
        setOrders(updateOrders)
        setTotalPaid(sum)
    }

    const handleRemove = (event: any, item: any) => {
        let sum = 0
        let updateOrders = orders.filter((order) => order.name !== item.name);
        orders.map(mn => {
            if (mn.name === item.name) {
                let qty = parseInt(mn.qty) - 1
                let total = parseFloat(mn.price) * qty
                mn.qty = qty
                mn.total = total
            }
            sum = sum + mn.total
            return mn;
        });
        setOrders(updateOrders)
        setTotalPaid(sum)
    }

    const handleSelected = (event: any) => {
        setTableSelected(event.target.value)
    }

    const handleSaveDraft = (event: any) => {
        saveOrderAlert({
            header: 'Save Confirmation',
            message: 'Are you sure to save this entry ?',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                },
                {
                    text: 'Yes',
                    role: 'confirm',
                    handler: () => {
                        present({
                            message: 'Saving Order....',
                            duration: 3000,
                            spinner: "circular",
                            onDidDismiss: (() => {
                                toast({
                                    message: 'Success, your order has been saved. !',
                                    duration: 1500,
                                    position: 'top',
                                });
                                props.callback()
                            })
                        });
                    },
                },
            ],
        })
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
                            message: 'Order Checkout....',
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


    const getCategory = (name: string) => {
        if (name === 'Appetizer') {
            return (
                <IonChip color={"danger"}>
                    <IonIcon icon={iceCream}></IonIcon>
                    <IonLabel>Appetizer</IonLabel>
                </IonChip>
            )
        } else if (name === 'Main Course') {
            return (
                <IonChip color={"warning"}>
                    <IonIcon icon={pizza}></IonIcon>
                    <IonLabel>Main Course</IonLabel>
                </IonChip>
            )
        } else {
            return (
                <IonChip color={"tertiary"}>
                    <IonIcon icon={wine}></IonIcon>
                    <IonLabel>Dessert</IonLabel>
                </IonChip>
            )
        }
    }

    const randomIntFromInterval = (min: number, max: number) => {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }



    useEffect(() => {
        generateItems();
        return () => {
            setItems([])
            setOrders([])
            setTotalPaid(0.0)
        };
    }, []);

    return (
        <>
            <IonTabs>
                <IonTab tab="order-menu">
                    <div id="order-menu-page">
                        <IonContent fullscreen={true}>
                            <div>
                                <IonSearchbar placeholder="Search Menu" showClearButton="always" debounce={1000} onIonInput={(event) => handleInput(event)}></IonSearchbar>
                                <div style={{ textAlign: 'center' }}>
                                    <IonChip color={"danger"} onClick={(event) => handleFilter(event, 'Appetizer')} disabled={filter === 'Appetizer'}>
                                        <IonIcon icon={iceCream}></IonIcon>
                                        <IonLabel>Appetizer</IonLabel>
                                    </IonChip>
                                    <IonChip color={"warning"} onClick={(event) => handleFilter(event, 'Main Course')} disabled={filter === 'Main Course'}>
                                        <IonIcon icon={pizza}></IonIcon>
                                        <IonLabel>Main Course</IonLabel>
                                    </IonChip>
                                    <IonChip color={"tertiary"} onClick={(event) => handleFilter(event, 'Dessert')} disabled={filter === 'Dessert'}>
                                        <IonIcon icon={wine}></IonIcon>
                                        <IonLabel>Dessert</IonLabel>
                                    </IonChip>
                                </div>
                            </div>
                            <div className='ion-padding'>
                                <IonList lines="none">
                                    {items.map((item, index) => (
                                        <IonItem key={index} className="ion-no-padding ion-margin-top" button={true} onClick={(event) => handleItem(event, item)}>
                                            <div className='img-list'>
                                                <img alt={item.name} className='image-cart' src={item.image} />
                                            </div>
                                            <IonLabel className="ion-text-wrap">
                                                <small style={{ fontWeight: 'bold' }}> {item.name}</small>
                                                <br />
                                                <small style={{ fontWeight: 'bold', color: '#28a745' }}>{' '}${parseFloat(item.price).toFixed(2)}</small>
                                                <br />
                                                <IonIcon icon={star} style={{ fontSize: '10px' }} color='warning'></IonIcon>
                                                <IonIcon icon={star} style={{ fontSize: '10px' }} color='warning'></IonIcon>
                                                <IonIcon icon={star} style={{ fontSize: '10px' }} color='warning'></IonIcon>
                                                <IonIcon icon={starOutline} style={{ fontSize: '10px' }} color='warning'></IonIcon>
                                                <IonIcon icon={starOutline} style={{ fontSize: '10px' }} color='warning'></IonIcon>
                                            </IonLabel>
                                            {getCategory(item.category)}
                                        </IonItem>
                                    ))}
                                </IonList>
                            </div>
                        </IonContent>
                    </div>
                </IonTab>
                <IonTab tab="order-payment">
                    <div id="order-payment-page">
                        <IonContent fullscreen={true} className='ion-padding'>
                            {orders.length === 0 ? <>
                                <div style={{ marginTop: '10px', textAlign: 'center' }}>
                                    <IonNote>No Orders</IonNote>
                                </div>
                            </> : <>
                                <IonList lines="none">
                                    {orders.map((item, index) => (
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
                                    <IonText color="danger" style={{ fontWeight: 'bold' }}>Total Paid : ${totalPaid.toFixed(2)}</IonText>
                                </div>
                            </>}
                        </IonContent>
                    </div>
                </IonTab>
                <IonTab tab='order-checkout'>
                    <div id="order-checkout-page">
                        {orders.length === 0 ? <>
                            <div style={{ marginTop: '10px', textAlign: 'center' }}>
                                <IonNote>No Orders</IonNote>
                            </div>
                        </> : <>
                            <IonList className='ion-padding'>
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
                                        disabled={loading}
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
                                    <IonSelect placeholder="Please Select Your Order Type" disabled={loading} labelPlacement='stacked' value={orderType} onIonChange={(e) => setOrderType(e.target.value)}>
                                        <IonIcon slot="start" icon={cart} aria-hidden="true"></IonIcon>
                                        <div slot="label">
                                            Order Type <IonText color="danger">*</IonText>
                                        </div>
                                        <IonSelectOption value="1">Dine In</IonSelectOption>
                                        <IonSelectOption value="2">Take Away</IonSelectOption>
                                    </IonSelect>
                                </IonItem>
                                {orderType === '1' ? <>
                                    <IonItem className='ion-no-padding' style={{ marginBottom: '10px' }}>
                                        <IonSelect placeholder="Please Select Your Table" disabled={loading} labelPlacement='stacked' value={tableSelected} onIonChange={handleSelected}>
                                            <IonIcon slot="start" icon={wineOutline} aria-hidden="true"></IonIcon>
                                            <div slot="label">
                                                Table<IonText color="danger">*</IonText>
                                            </div>
                                            {tables.map((aa, index) => (
                                                <IonSelectOption key={index} value={aa}>{aa}</IonSelectOption>
                                            ))}
                                        </IonSelect>
                                    </IonItem>
                                </> : <></>}
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
                            {orderType === '1' ? <>
                                <IonButton onClick={handleSaveDraft} expand="block">
                                    <IonIcon icon={create} style={{ marginRight: '2px' }} />  Save Order
                                </IonButton>
                            </> : <></>}
                            <IonButton onClick={handleCheckOut} color={"danger"} expand="block">
                                <IonIcon icon={bagCheck} color='light' style={{ marginRight: '2px' }} />  <IonText color='light'>Checkout Payment</IonText>
                            </IonButton>
                        </>}
                    </div>
                </IonTab>
                <IonTabBar slot="bottom">
                    <IonTabButton tab="order-menu" >
                        <IonIcon icon={fastFood} />
                        List Menu
                    </IonTabButton>
                    <IonTabButton tab="order-payment">
                        <IonIcon icon={cart} />
                        Detail Order ($ {parseFloat(String(totalPaid)).toFixed(2)})
                    </IonTabButton>
                    <IonTabButton tab="order-checkout">
                        <IonIcon icon={bagCheck} />
                        Checkout
                    </IonTabButton>
                </IonTabBar>
            </IonTabs>
        </>
    )
}

export default CreateOrder