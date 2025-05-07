import {
    IonItem,
    IonLabel,
    IonList,
    IonText
} from '@ionic/react';
import MenuList from '../stores/Menu';
import { useState, useEffect } from "react";

const DetailOrder: React.FC = () => {

    const [items, setItems] = useState<any[]>([]);
    const [totalPaid, setTotalPaid] = useState(0.0)

    const generateItems = () => {
        let item = MenuList.sort(() => Math.random() - 0.5);
        const newItems = [];
        let totalPaidTemp = 0
        for (let i = 0; i < 3; i++) {
            let qty = randomIntFromInterval(1, 10)
            let p = item[i]
            let total = parseFloat(item[i].price) * qty
            p["qty"] = qty
            p["total"] = total
            newItems.push(p);
            totalPaidTemp = totalPaidTemp + total
        }
        setItems(newItems);
        setTotalPaid(totalPaidTemp)
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

    return (
        <>
            <IonList lines="none">
                {items.map((item, index) => (
                    <IonItem key={index} className="ion-no-padding ion-margin-top">
                        <div className='img-list'>
                            <img alt={item.name} className='image-cart' src={item.image} />
                        </div>
                        <IonLabel className="ion-text-wrap">
                            <small style={{ fontWeight: 'bold' }}> {item.name} {' '} (${parseFloat(item.price).toFixed(2)} x {item.qty} )</small>
                            <br />
                            <small style={{ fontWeight: 'bold', color: '#28a745' }}>{' '}${parseFloat(item.total).toFixed(2)}</small>
                        </IonLabel>
                    </IonItem>
                ))}
            </IonList>
            <div style={{ marginTop: '10px', textAlign: 'center' }}>
                <IonText color="danger" style={{ fontWeight: 'bold' }}>Total Paid : ${totalPaid.toFixed(2)}</IonText>
            </div>
        </>
    )
}

export default DetailOrder