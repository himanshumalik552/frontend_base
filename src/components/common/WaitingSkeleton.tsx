import { Grid } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

interface SkeletonRowProps {
    height: number;
}

function SkeletonRow(props: SkeletonRowProps) {

    const countArr = [1, 3, 2, 2, 4];

    return (
        <Grid container direction="row" spacing={1} sx={{ ml: 0 }}>
            {countArr.map((n, index) => 
                <Grid key={`skeleton_${index}`} item xs={n}>
                    <Skeleton animation="wave" variant="rectangular" height={props.height} />
                </Grid>
            )}
        </Grid>
    );
}

export default function SkeletonWaitingTable() {

    const countArr = Array.from(Array(12).keys());

    return (
        <Stack spacing={1} sx={{ m: 2, mr: 2 }}>
            <SkeletonRow height={40} />
            {countArr.map(n =>
                <SkeletonRow key={n} height={20} />
            )}
        </Stack>
    );
}