import {
    IonSearchbar,
    IonChip,
    IonLabel,
    IonIcon,
    IonItem,
    IonList,
    IonCard
} from '@ionic/react';

import { iceCream, pizza, wine, star, starOutline, refreshCircle } from 'ionicons/icons';
import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import Service from "../Service"
import { Shimmer } from 'react-shimmer'
import Rating from '../components/Rating';

const Menu = forwardRef((props, ref) => {

    useImperativeHandle(ref, () => ({
        setLoadData() {
            loadData()
        }
    }));

    const [items, setItems] = useState<any[]>([]);
    const [itemOriginal, setItemOriginial] = useState<any[]>([]);
    const [filter, setFilter] = useState("all")
    const [loading, setLoading] = useState(true)
    const [errorReseponse, setErrorResponse] = useState('')
    const [maxRating, setMaxRating] = useState(0)

    const handleInput = (event: any) => {
        if (event.target.value) {
            let searchValue = event.target.value
            searchValue = searchValue.toLowerCase()
            let searchItems = itemOriginal.filter((item) => item.name.toLowerCase().includes(searchValue) || item.category.toLowerCase().includes(searchValue))
            setItems(searchItems)
        } else {
            setItems(itemOriginal)
        }
    }

    const handleFilter = (event: any, category: string) => {
        const e = event
        e.preventDefault();
        setFilter(category)
        if (category === 'all') {
            setItems(itemOriginal)
        } else {
            setItems(itemOriginal)
            let searchItems = itemOriginal.filter((item) => item.category.toLowerCase().includes(category.toLowerCase()))
            if (searchItems.length > 0) {
                setItems(searchItems)
            }
        }
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
        } else if (name === 'Dessert') {
            return (
                <IonChip color={"tertiary"}>
                    <IonIcon icon={wine}></IonIcon>
                    <IonLabel>Dessert</IonLabel>
                </IonChip>
            )
        } else {
            return (
                <IonChip color={"secondary"}>
                    <IonIcon icon={refreshCircle}></IonIcon>
                    <IonLabel>All</IonLabel>
                </IonChip>
            )
        }
    }

    const loadData = async () => {
        setLoading(true)
        await Service.menu.list()
            .then((response) => {
                const data = response.data
                setItems(data)
                setItemOriginial(data)

                if (data.length > 0) {
                    const top = data[0]
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
            setItems([])
            setItemOriginial([])
            setFilter('all')
            setLoading(true)
            setErrorResponse('')
            setMaxRating(0)
        };
    }, []);

    return (
        <>
            <div className='ion-margin' style={{ marginTop: '70px' }}>
                <IonSearchbar onIonClear={() => { setItems(itemOriginal) }} placeholder="Search Menu" showClearButton="always" debounce={1000} onIonInput={(event) => handleInput(event)}></IonSearchbar>
            </div>
            <div className='ion-padding'>
                {loading ? <>
                    {Array.from(Array(10), (e, i) => {
                        return (
                            <IonCard key={i} className='ion-margin-top'>
                                <Shimmer width={500} height={80} />
                            </IonCard>
                        )
                    })}
                </> : <>

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
                        <IonChip color={"secondary"} onClick={(event) => handleFilter(event, 'all')} disabled={filter === 'all'}>
                            <IonIcon icon={refreshCircle}></IonIcon>
                            <IonLabel>All Category</IonLabel>
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
                                    <small style={{ fontWeight: 'bold', color: '#28a745' }}>{' '}${parseFloat(item.price['$numberDecimal'].toLocaleString()).toFixed(2)}</small>
                                    <br />
                                    <Rating maxRating={maxRating} rating={item.rating} />
                                </IonLabel>
                                {getCategory(item.category)}
                            </IonItem>
                        ))}
                    </IonList>

                </>}
            </div>
        </>
    );
})

export default Menu;