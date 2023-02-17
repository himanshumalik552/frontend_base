import { Fragment } from 'react';
import { getTotal } from '../../utils/commonfunction';
import { RiverWork } from '../../utils/types';
import RiverWorkDetailRow from './RiverWorkDetailRow';

interface RiverWorkDetailsProps {
    riverWorks: RiverWork[];
    showImage?: boolean;
}

export default function RiverWorkDetails(props: RiverWorkDetailsProps) {
    const { riverWorks } = props;
    const showImage = props.showImage || false;

    if (riverWorks.length <= 0) {
        return <Fragment/>
    }

    const rowCount = riverWorks.length * 2;
    const riverWorkLengths = riverWorks.map(f=>f.reachLength)
    const TotalLength = getTotal(riverWorkLengths);
    const firstId = riverWorks[0].id;

    return (
        <Fragment>
            {riverWorks.map((riverWork) => (
                <RiverWorkDetailRow key={riverWork.id} showImage={showImage} riverWork={riverWork} firstRowId={firstId} totalLength={TotalLength} rowCount={rowCount}/>
            ))}
        </Fragment>
    );
}