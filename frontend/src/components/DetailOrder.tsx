import {
    IonItem,
    IonLabel,
    IonList,
    IonText
} from '@ionic/react';

interface IProduct {
    menu_name: string,
    menu_image: string,
    price: any,
    qty: number,
    total: any
}

interface ICart {
    items: Array<IProduct>,
    totalPaid: number
}

const DetailOrder: React.FC<ICart> = (props: ICart) => {
    return (
        <>
            <IonList lines="none">
                {props.items.map((item, index) => (
                    <IonItem key={index} className="ion-no-padding ion-margin-top">
                        <div className='img-list'>
                            <img alt={item.menu_name} className='image-cart' src={item.menu_image} />
                        </div>
                        <IonLabel className="ion-text-wrap">
                            <small style={{ fontWeight: 'bold' }}> {item.menu_name} {' '} (${parseFloat(item.price['$numberDecimal'].toLocaleString()).toFixed(2)} x {item.qty} )</small>
                            <br />
                            <small style={{ fontWeight: 'bold', color: '#28a745' }}>{' '}${parseFloat(item.total['$numberDecimal'].toLocaleString()).toFixed(2)}</small>
                        </IonLabel>
                    </IonItem>
                ))}
            </IonList>
            <div style={{ marginTop: '10px', textAlign: 'center' }}>
                <IonText color="danger" style={{ fontWeight: 'bold' }}>Total Paid : ${parseFloat(String(props.totalPaid)).toFixed(2)}</IonText>
            </div>
        </>
    )
}

export default DetailOrder