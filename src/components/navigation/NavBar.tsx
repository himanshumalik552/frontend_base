import AccountBoxIcon from '@mui/icons-material/AccountBox';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import PasswordIcon from '@mui/icons-material/Password';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { AppBar, Box, Divider, IconButton, Menu, MenuItem, Toolbar, Tooltip, Typography } from '@mui/material';
import { AppBarProps } from '@mui/material/AppBar';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { AppContext } from '../../App';
import DialogChangePassword from '../user/DialogChangePassword';
import DialogUpdateUserProfile from '../user/DialogUpdateUserProfile';
import BadgeAvatars from './BadgeAvatars';
import NavBreadcrumbs from './NavBreadcrumbs';

const StyledAppBar = styled(AppBar)<AppBarProps>(({ theme }) => ({
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    backgroundColor: '#0086A8',
    '& .MuiTypography-root, svg': {
        color: theme.palette.common.white,
    }
}));

export default function NavBar() {
    const appContext = React.useContext(AppContext);
    const { dispatch ,state} = appContext;
    const [t] = useTranslation(["navigation"]);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
    const [openProfileDialog, setOpenProfileDialog] = React.useState(false);
    const [openChangePasswordDialog, setOpenChangePasswordDialog] = React.useState(false);
    const tooltipUserManagement = t('user.management');
    const tooltipHome = t('home');
    const tooltipOpenSettings = t('open.settings');
    const {currentUser} =state

    const isUserAdmin = currentUser?.roles.some(f=>f.key==='administrator')

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleLogout = () => {
        dispatch({ type: "setToken", value: "" });
    };

    const handleOpenUserManagement = () => {
        dispatch({ type: "setSelectedPage", value: "user-management" });
    }

    const handleOpenHome = () => {
        dispatch({ type: "setSelectedPage", value: "dashboard" });
    }

    const handleEditProfile = () => {
        setAnchorElUser(null);
        setOpenProfileDialog(true);
    }

    const handleChangePassword = () => {
        setAnchorElUser(null);
        setOpenChangePasswordDialog(true);
    }

    return (
        <React.Fragment>
            <StyledAppBar position="sticky" color='default'>
                <Toolbar disableGutters>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        <Tooltip title={tooltipHome} >
                            <IconButton size="large" onClick={handleOpenHome}>
                                <HomeIcon />
                            </IconButton>
                        </Tooltip>
                        <Typography
                            variant="h3"
                            noWrap
                            component="a"
                            href="/"
                            sx={{
                                mr: 2,
                                display: { xs: 'none', md: 'flex' },
                                fontFamily: 'monospace',
                                fontWeight: 600,
                                fontSize: 24,
                                letterSpacing: '.2rem',
                                color: 'GrayText',
                                textDecoration: 'none',
                                mt: 1.4
                            }}
                        >
                            Fremaa Dashboard
                        </Typography>
                        <NavBreadcrumbs/>
                    </Box>
                        {isUserAdmin && 
                            <Box sx={{ flexGrow: 0, mr: 2 }}>
                            <Tooltip title={tooltipUserManagement} >
                                <IconButton size="large" onClick={handleOpenUserManagement}>
                                    <PeopleAltIcon />
                                </IconButton>
                            </Tooltip>
                        </Box>
                        }
                
                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title={tooltipOpenSettings} >
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <BadgeAvatars />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            <MenuItem onClick={handleEditProfile}>
                                <AccountBoxIcon sx={{ mr: 2 }} />
                                <Typography>{t('update.profile')}</Typography>
                            </MenuItem>

                            <MenuItem onClick={handleChangePassword}>
                                <PasswordIcon sx={{ mr: 2 }} />
                                <Typography>{t('change.password')}</Typography>
                            </MenuItem>
                            <Divider/>
                            <MenuItem onClick={handleLogout}>
                                <LogoutIcon sx={{ mr: 2 }} />
                                <Typography textAlign="center">{t('logout')}</Typography>
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </StyledAppBar>

            <DialogUpdateUserProfile open={openProfileDialog} setOpen={setOpenProfileDialog} />
            <DialogChangePassword open={openChangePasswordDialog} setOpen={setOpenChangePasswordDialog} />

        </React.Fragment>
    );
}