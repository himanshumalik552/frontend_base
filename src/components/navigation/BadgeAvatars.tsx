import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import { useContext } from 'react';
import { AppContext } from '../../App';

const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        backgroundColor: '#44b700',
        color: '#44b700',
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
        '&::after': {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            animation: 'ripple 1.2s infinite ease-in-out',
            border: '1px solid currentColor',
            content: '""',
        },
    },
    '@keyframes ripple': {
        '0%': {
            transform: 'scale(.8)',
            opacity: 1,
        },
        '100%': {
            transform: 'scale(2.4)',
            opacity: 0,
        },
    },
}));

export default function BadgeAvatars() {
    const appContext = useContext(AppContext);
    const { state } = appContext;
    const { currentUser } = state;

    const userName = currentUser
        ? `${currentUser.firstName} ${currentUser.lastName}`
        : "N A";
    const avatarName = userName
        ? userName.split(" ").map((str) => str[0]).join("")
        : "";

    return (
        <Stack direction="row" spacing={2}>
            <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
            >
                <Avatar >
                    {avatarName}
                </Avatar>
            </StyledBadge>
        </Stack>
    );
}