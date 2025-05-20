import {
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonText,
    IonIcon,
    IonList,
    IonItem,
    IonRow,
    IonCol,
    IonGrid,
    IonBadge,
    IonLabel,
    IonAlert
} from '@ionic/react';
import { fastFood, restaurant, wallet, rocket, bag, giftSharp } from 'ionicons/icons';
import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import Table from '../table.png'
import { Shimmer } from 'react-shimmer'
import Rating from '../components/Rating';
import Service from "../Service"

const Home = forwardRef((props, ref) => {

    const [products, setProducst] = useState<any[]>([]);
    const [tables, setTables] = useState<any[]>([]);
    const [errorReseponse, setErrorResponse] = useState('')
    const [loading, setLoading] = useState(true)
    const [totalSales, setTotalSales] = useState(0)
    const [totalOrder, setTotalOrder] = useState(0)
    const [totalDineIn, setTotalDineIn] = useState(0)
    const [totalTakeAway, setTotalTakeAway] = useState(0)
    const [maxRating, setMaxRating] = useState(0)

    useImperativeHandle(ref, () => ({
        setLoadData() {
            loadData()
        }
    }));

    const loadData = async () => {
        setLoading(true)
        await Service.home.summary()
            .then((response) => {
                const data = response.data
                setTotalSales(data.total_sales)
                setTotalOrder(data.total_orders)
                setTotalDineIn(data.total_dine_in)
                setTotalTakeAway(data.total_take_away)
                setProducst(data.products)
                setTables(data.tables)

                if (data.products.length > 0) {
                    const top = data.products[0]
                    setMaxRating(top.rating)
                }

                setTimeout(() => {
                    setLoading(false)
                }, 1500)
            })
            .catch((error) => {
                const msg = error.status === 401 ? Service.expiredMessage : (error.message || error.response.data?.message)
                setErrorResponse(msg)
            })
    }

    useEffect(() => {
        loadData();
        return () => {
            setTables([])
            setProducst([])
            setTotalSales(0)
            setTotalOrder(0)
            setTotalDineIn(0)
            setTotalTakeAway(0)
            setLoading(true)
            setErrorResponse('')
            setMaxRating(0)
        };
    }, []);

    return (
        <>
            <div className='ion-no-padding' style={{ marginTop: '4rem' }}>
                <IonCard>
                    <IonCardHeader color={'primary'}>
                        <IonCardSubtitle>
                            <IonIcon icon={giftSharp} /><IonText color={'light'}> Summary</IonText>
                        </IonCardSubtitle>
                    </IonCardHeader>
                    <IonCardContent className='ion-no-padding'>
                        <div className='ion-margin'>
                            <IonGrid style={{ textAlign: 'center' }}>
                                <IonRow>
                                    {loading ? <>
                                        {Array.from(Array(4), (e, i) => {
                                            return (
                                                <IonCol size-md="3" key={i}>
                                                    <Shimmer width={70} height={80} />
                                                </IonCol>
                                            )
                                        })}
                                    </> : <>

                                        <IonCol size-md="4">
                                            <IonIcon icon={bag} color='danger' size='large' />
                                            <br />
                                            <small style={{ fontWeight: 'bold' }}>
                                                <IonText color='dark'>Sales</IonText>
                                            </small>
                                            <br />
                                            <IonBadge color={"danger"}>
                                                <IonText color={'light'}>
                                                    <small>$ {parseFloat(String(totalSales)).toFixed(2)}</small>
                                                </IonText>
                                            </IonBadge>
                                        </IonCol>
                                        <IonCol size-md="4">
                                            <IonIcon icon={wallet} color='secondary' size='large' />
                                            <br />
                                            <small style={{ fontWeight: 'bold' }}>
                                                <IonText color='dark'>Orders</IonText>
                                            </small>
                                            <br />
                                            <IonBadge color={"secondary"}>
                                                <IonText color={'light'}>
                                                    <small>{totalOrder}</small>
                                                </IonText>
                                            </IonBadge>
                                        </IonCol>
                                        <IonCol size-md="4">
                                            <IonIcon icon={restaurant} color='primary' size='large' />
                                            <br />
                                            <small style={{ fontWeight: 'bold' }}>
                                                <IonText color='dark'>Dine In</IonText>
                                            </small>
                                            <br />
                                            <IonBadge color={"primary"}>
                                                <IonText color={'light'}>
                                                    <small>{Math.round(totalDineIn)}</small>
                                                </IonText>
                                            </IonBadge>
                                        </IonCol>
                                        <IonCol size-md="4">
                                            <IonIcon icon={rocket} color='tertiary' size='large' />
                                            <br />
                                            <small style={{ fontWeight: 'bold' }}>
                                                <IonText color='dark'>Take Away</IonText>
                                            </small>
                                            <br />
                                            <IonBadge color={"tertiary"}>
                                                <IonText color={'light'}>
                                                    <small>{Math.round(totalTakeAway)}</small>
                                                </IonText>
                                            </IonBadge>
                                        </IonCol>

                                    </>}
                                </IonRow>
                            </IonGrid>
                        </div>
                    </IonCardContent>
                </IonCard>
                <IonCard>
                    <IonCardHeader color={'primary'}>
                        <IonCardSubtitle>
                            <IonIcon icon={restaurant} /><IonText color={'light'}> Dine In Tables</IonText>
                        </IonCardSubtitle>
                    </IonCardHeader>
                    <IonCardContent className='ion-no-padding'>
                        <IonGrid style={{ textAlign: 'center' }}>
                            {loading ? <>
                                {Array.from(Array(3), (e, i) => {
                                    return (
                                        <IonRow key={i}>
                                            <IonCol size='4'>
                                                <Shimmer width={100} height={80} />
                                            </IonCol>
                                            <IonCol size='4'>
                                                <Shimmer width={100} height={80} />
                                            </IonCol>
                                            <IonCol size='4'>
                                                <Shimmer width={100} height={80} />
                                            </IonCol>
                                        </IonRow>
                                    )
                                })}
                            </> : <>
                                <IonRow>
                                    {tables.slice(0, 3).map((table, index) => (
                                        <IonCol size-md="4" key={index}>
                                            <img alt={"table"} className='image-cart' src={Table} />
                                            <br />
                                            <small style={{ fontWeight: 'bold' }}> {table.name}</small>
                                            <br />
                                            <IonBadge color={table.status === 1 ? 'primary' : 'danger'}>
                                                <IonText color={'light'}>
                                                    <small>{table.status === 1 ? 'Available' : 'Reserved'}</small>
                                                </IonText>
                                            </IonBadge>
                                        </IonCol>
                                    ))}
                                </IonRow>
                                <IonRow>
                                    {tables.slice(3, 6).map((table, index) => (
                                        <IonCol size-md="4" key={index}>
                                            <img alt={"table"} className='image-cart' src={Table} />
                                            <br />
                                            <small style={{ fontWeight: 'bold' }}> {table.name}</small>
                                            <br />
                                            <IonBadge color={table.status === 1 ? 'primary' : 'danger'}>
                                                <IonText color={'light'}>
                                                    <small>{table.status === 1 ? 'Available' : 'Reserved'}</small>
                                                </IonText>
                                            </IonBadge>
                                        </IonCol>
                                    ))}
                                </IonRow>
                                <IonRow>
                                    {tables.slice(6, 9).map((table, index) => (
                                        <IonCol size-md="4" key={index}>
                                            <img alt={"table"} className='image-cart' src={Table} />
                                            <br />
                                            <small style={{ fontWeight: 'bold' }}> {table.name}</small>
                                            <br />
                                            <IonBadge color={table.status === 1 ? 'primary' : 'danger'}>
                                                <IonText color={'light'}>
                                                    <small>{table.status === 1 ? 'Available' : 'Reserved'}</small>
                                                </IonText>
                                            </IonBadge>
                                        </IonCol>
                                    ))}
                                </IonRow>
                            </>}
                        </IonGrid>
                    </IonCardContent>
                </IonCard>
                <IonCard>
                    <IonCardHeader color={'primary'}>
                        <IonCardSubtitle>
                            <IonIcon icon={fastFood} /><IonText color={'light'}> Best Seller</IonText>
                        </IonCardSubtitle>
                    </IonCardHeader>
                    <IonCardContent>
                        {loading ? <>
                            <IonList lines="none">
                                {Array.from(Array(5), (e, i) => {
                                    return (
                                        <IonItem key={i} className="ion-no-padding ion-margin-top">
                                            <Shimmer width={500} height={80} />
                                        </IonItem>
                                    )
                                })}
                            </IonList>
                        </> : <>
                            <IonList lines="none">
                                {products.map((item, index) => {
                                    return (
                                        <IonItem key={index} className="ion-no-padding ion-margin-top">
                                            <div className='img-list'>
                                                <img alt={item.name} className='image-cart' src={item.image} />
                                            </div>
                                            <IonLabel className="ion-text-wrap">
                                                <small style={{ fontWeight: 'bold' }}> {item.name}</small>
                                                {'  '}
                                                {item.rating >= 5 ? <><IonIcon color='primary' icon={fastFood} /></> : <></>}
                                                <br />
                                                <small style={{ fontWeight: 'bold', color: '#28a745' }}>{' '}${parseFloat(item.price['$numberDecimal'].toLocaleString()).toFixed(2)}</small>
                                                <br />
                                                <Rating maxRating={maxRating} rating={item.rating} />
                                            </IonLabel>
                                        </IonItem>
                                    )
                                })}
                            </IonList>
                        </>}
                    </IonCardContent>
                </IonCard>
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
    );

})

export default Home;