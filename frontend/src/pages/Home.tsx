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
    IonLabel
} from '@ionic/react';
import { fastFood, restaurant, starOutline, star, wallet, rocket, bag, speedometer } from 'ionicons/icons';
import { useState, useEffect } from "react";
import MenuList from '../stores/Menu';
import Table from '../table.png'

const Home: React.FC = () => {

    const [items, setItems] = useState<any[]>([]);
    const [tables, setTables] = useState<any[]>([]);

    const generateItems = () => {

        let item = MenuList.sort(() => Math.random() - 0.5);

        const newItems = [];
        const newTables = [];

        for (let i = 0; i < item.length; i++) {
            let p = item[i]
            p["rating"] = (10 - (i + 1)) + 1
            newItems.push(p);
        }

        for (let j = 0; j < 12; j++) {
            let tab = {
                code: `Table ${String(j + 1).padStart(2, '0')}`,
                status: randomIntFromInterval(1, 2)
            }
            newTables.push(tab);
        }

        setItems(newItems);
        setTables(newTables);
    }

    const randomIntFromInterval = (min: number, max: number) => {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    useEffect(() => {
        generateItems();
        return () => {
            setItems([])
        };
    }, []);

    let totalSales = randomIntFromInterval(100, 1000)
    let totalOrder = randomIntFromInterval(1, 100)
    let totalDineIn = totalOrder * 0.7
    let totalTakeAway = totalOrder - totalDineIn

    return (
        <div className='ion-no-padding' style={{ marginTop: '4rem' }}>
            <IonCard>
                <IonCardContent className='ion-no-padding'>
                    <div className='ion-margin'>
                        <IonGrid style={{ textAlign: 'center' }}>
                            <IonRow>
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
                            </IonRow>
                        </IonGrid>
                    </div>
                </IonCardContent>
            </IonCard>
            <IonCard>
                <IonCardHeader color={'tertiary'}>
                    <IonCardSubtitle>
                        <IonIcon icon={restaurant} /><IonText color={'light'}> Dine In Tables</IonText>
                    </IonCardSubtitle>
                </IonCardHeader>
                <IonCardContent className='ion-no-padding'>
                    <IonGrid style={{ textAlign: 'center' }}>
                        <IonRow>
                            {tables.slice(0, 3).map((table, index) => (
                                <IonCol size-md="4" key={index}>
                                    <img alt={"table"} className='image-cart' src={Table} />
                                    <br />
                                    <small style={{ fontWeight: 'bold' }}> {table.code}</small>
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
                                    <small style={{ fontWeight: 'bold' }}> {table.code}</small>
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
                                    <small style={{ fontWeight: 'bold' }}> {table.code}</small>
                                    <br />
                                    <IonBadge color={table.status === 1 ? 'primary' : 'danger'}>
                                        <IonText color={'light'}>
                                            <small>{table.status === 1 ? 'Available' : 'Reserved'}</small>
                                        </IonText>
                                    </IonBadge>
                                </IonCol>
                            ))}
                        </IonRow>
                    </IonGrid>
                </IonCardContent>
            </IonCard>
            <IonCard>
                <IonCardHeader color={'danger'}>
                    <IonCardSubtitle>
                        <IonIcon icon={fastFood} /><IonText color={'light'}> Best Seller</IonText>
                    </IonCardSubtitle>
                </IonCardHeader>
                <IonCardContent>
                    <IonList lines="none">
                        {items.map((item, index) => (
                            <IonItem key={index} className="ion-no-padding ion-margin-top">
                                <div className='img-list'>
                                    <img alt={item.name} className='image-cart' src={item.image} />
                                </div>
                                <IonLabel className="ion-text-wrap">
                                    <small style={{ fontWeight: 'bold' }}> {item.name}</small>
                                    {'  '}
                                    {item.rating >= 5 ? <><IonIcon color='primary' icon={fastFood} /></> : <></>}
                                    <br />
                                    <small style={{ fontWeight: 'bold', color: '#28a745' }}>{' '}${parseFloat(item.price).toFixed(2)}</small>
                                    <br />
                                    <IonIcon icon={item.rating >= 1 ? star : starOutline} style={{ fontSize: '10px' }} color='warning'></IonIcon>
                                    <IonIcon icon={item.rating >= 2 ? star : starOutline} style={{ fontSize: '10px' }} color='warning'></IonIcon>
                                    <IonIcon icon={item.rating >= 3 ? star : starOutline} style={{ fontSize: '10px' }} color='warning'></IonIcon>
                                    <IonIcon icon={item.rating >= 4 ? star : starOutline} style={{ fontSize: '10px' }} color='warning'></IonIcon>
                                    <IonIcon icon={item.rating >= 5 ? star : starOutline} style={{ fontSize: '10px' }} color='warning'></IonIcon>
                                    <IonIcon icon={item.rating >= 6 ? star : starOutline} style={{ fontSize: '10px' }} color='warning'></IonIcon>
                                    <IonIcon icon={item.rating >= 7 ? star : starOutline} style={{ fontSize: '10px' }} color='warning'></IonIcon>
                                    <IonIcon icon={item.rating >= 8 ? star : starOutline} style={{ fontSize: '10px' }} color='warning'></IonIcon>
                                    <IonIcon icon={item.rating >= 9 ? star : starOutline} style={{ fontSize: '10px' }} color='warning'></IonIcon>
                                    <IonIcon icon={item.rating >= 10 ? star : starOutline} style={{ fontSize: '10px' }} color='warning'></IonIcon>
                                </IonLabel>
                            </IonItem>
                        ))}
                    </IonList>
                </IonCardContent>
            </IonCard>
        </div>

    );
}

export default Home;