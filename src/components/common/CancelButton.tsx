import { Button, ButtonProps, styled } from '@mui/material';

const CancelButton = styled(Button)<ButtonProps>(({ theme }) => ({
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    color: theme.palette.common.black,
    backgroundColor: '#e6e6e6',
    borderColor: 'lightgray',
    '&:hover': {
        backgroundColor: '#cccccc',
        borderColor: 'gray',
    },
}));

export default CancelButton;