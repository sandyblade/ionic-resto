import {
    IonSearchbar,
    IonChip,
    IonLabel,
    IonIcon,
    IonItem,
    IonList,
    IonGrid,
    IonCol
} from '@ionic/react';

import { iceCream, pizza, wine, star, starOutline } from 'ionicons/icons';
import MenuList from '../stores/Menu';
import { useState, useEffect } from "react";

const Menu: React.FC = () => {

    const [items, setItems] = useState<any[]>([]);
    const [filter, setFilter] = useState("all")

    const generateItems = () => {
        let item = MenuList.sort(() => Math.random() - 0.5);
        const newItems = [];
        for (let i = 0; i < item.length; i++) {
            newItems.push(item[i]);
        }
        setItems(newItems);
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
        }, 1000)
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


    useEffect(() => {
        generateItems();
        return () => {
            setItems([])
        };
    }, []);

    return (
        <>
            <div className='ion-margin' style={{ marginTop: '70px' }}>
                <IonSearchbar placeholder="Search Menu" showClearButton="always" debounce={1000} onIonInput={(event) => handleInput(event)}></IonSearchbar>
            </div>
            <div className='ion-padding'>
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
                <IonList lines="none">
                    {items.map((item, index) => (
                        <IonItem key={index} className="ion-no-padding ion-margin-top">
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
        </>
    );
}

export default Menu;