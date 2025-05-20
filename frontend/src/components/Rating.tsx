import { IonIcon } from '@ionic/react';
import { starOutline, star } from 'ionicons/icons';

interface IRating {
    maxRating: number,
    rating: number
}

const Rating: React.FC<IRating> = (props: IRating) => {
    const maxStar = 10
    const maxRating = props.maxRating
    const rating = props.rating
    const current = (((rating / maxRating) * 100) / maxStar)
    const currentRound = Math.round(current)
    const less = maxStar - currentRound
    return (
        <>
            {Array.from(Array(currentRound), (e, i) => {
                return (<IonIcon key={i} icon={star} style={{ fontSize: '10px' }} color='warning'></IonIcon>)
            })}
            {Array.from(Array(less), (e, i) => {
                return (<IonIcon key={i} icon={starOutline} style={{ fontSize: '10px' }} color='warning'></IonIcon>)
            })}
        </>
    )
}

export default Rating