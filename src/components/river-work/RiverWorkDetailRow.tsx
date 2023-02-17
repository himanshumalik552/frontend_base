import HideImageIcon from '@mui/icons-material/HideImage';
import ImageIcon from '@mui/icons-material/Image';
import { Grid, IconButton, Tooltip, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import TableCell, { TableCellProps } from '@mui/material/TableCell';
import TableRow, { TableRowProps } from '@mui/material/TableRow';
import { Fragment, useContext, useState } from 'react';
import { AppContext } from '../../App';
import { riverWorkImages } from '../../utils/river-work-image';
import { RiverWork, RiverWorkImage } from '../../utils/types';

const StyledSumCell = styled(TableCell)<TableCellProps>(() => ({
    borderLeft: '1px solid #e6e6e6',
    fontSize: 18,
}));

const StyledCell = styled(TableCell)<TableCellProps>(() => ({
    borderLeft: '1px solid #e6e6e6',
}));

const StyledImageRow = styled(TableRow)<TableRowProps>(({ theme }) => ({
    backgroundColor: theme.palette.common.white,
    maxHeight: '50px !important',
    '& img': {
        marginTop: theme.spacing(1),
    },
    '& .MuiTableCell-root': {
        border: 'none',
        height: '50px !important',
    }
}));

interface MapImageProps {
    alt: string;
    imageScale: number;
    path: string
}

function MapImage(props: MapImageProps) {
    const { alt, path, imageScale } = props;
    return (
        <Grid item>
            <Grid container justifyContent="center" alignContent="center">
                <img alt={alt} src={path} width={`${imageScale}%`} height="auto" style={{ display: "flex" }} />
            </Grid>
        </Grid>);
}

interface MapRowProps {
    images: RiverWorkImage[];
    imageScale: number;
    riverWorkName: string
}

function MapRow(props: MapRowProps) {

    const { images, riverWorkName, imageScale } = props;
    const location = window.location.origin;

    return (
        <StyledImageRow>
            <TableCell colSpan={4}>
                <Grid container justifyContent="center">
                    {images.map(image =>
                        <Grid key={image.code} direction="column" container justifyContent="center" alignContent="center">
                            <Grid item>
                                <Grid container justifyContent="center" alignContent="center">
                                    <Typography variant="h2">
                                        {`Map (${riverWorkName})`}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <MapImage path={`${location}${image.path}`} alt={image.code} imageScale={imageScale} />
                        </Grid>
                    )}
                </Grid>
            </TableCell>
        </StyledImageRow>);
}

interface SummaryCellProps {
    effectiveRowCount: number;
    TotalLengthKm: number;
}

function SummaryCell(props: SummaryCellProps) {
    const { effectiveRowCount, TotalLengthKm } = props;
    return (
        <StyledSumCell align='center' rowSpan={effectiveRowCount}>
            {TotalLengthKm.toLocaleString('en')}
        </StyledSumCell>
    );
}

interface RiverWorkDetailRowProps {
    riverWork: RiverWork;
    firstRowId: string;
    totalLength: number;
    rowCount: number;
    showImage?: boolean;
}

export default function RiverWorkDetailRow(props: RiverWorkDetailRowProps) {

    const appContext = useContext(AppContext);
    const { state } = appContext;
    const { imageScale } = state;
    const { riverWork, firstRowId, totalLength, rowCount } = props;
    const [open, setOpen] = useState(false);
    const TotalLengthKm = (totalLength / 1000);
    const showImage = props.showImage || false;

    const effectiveRowCount = rowCount;
    const images = riverWorkImages.filter(r => r.basinCode === riverWork.basinCode && r.code === riverWork.code);
    
    const handleOpen = () => {
        setOpen(!open);
        console.log({ rowCount })
    }

    return (
        <Fragment>
            <TableRow key={riverWork.name}
                sx={{ '&:last-child td, &:last-child th': { border: 0, borderLeft: '1px solid #e6e6e6' } }}>
                <StyledCell component="th" scope="row">
                    {riverWork.code}
                    {showImage && images.length > 0 &&
                        <Tooltip title="Show map image">
                            <IconButton color="primary" onClick={handleOpen}>
                                {open ? <HideImageIcon /> : <ImageIcon />}
                            </IconButton>
                        </Tooltip>}
                </StyledCell>
                <StyledCell component="th" scope="row">
                    {riverWork.name}
                </StyledCell>
                <StyledCell component="th" scope="row">
                    {riverWork.lat}
                </StyledCell>
                <StyledCell component="th" scope="row">
                    {riverWork.lon}
                </StyledCell>
                <StyledCell component="th" scope="row" align='center'>
                    {riverWork.reachLength.toLocaleString('en')}
                </StyledCell >
                {firstRowId === riverWork.id &&
                    <SummaryCell effectiveRowCount={effectiveRowCount} TotalLengthKm={TotalLengthKm}/>}
            </TableRow>

            {!open ? <TableRow /> :
                <MapRow images={images} imageScale={imageScale} riverWorkName={riverWork.name} />}
        </Fragment>
    );
}