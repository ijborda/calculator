import * as React from 'react';

import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';

import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import MuiDrawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';

import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import Name from '@/widgets/Navigation/Name';
import { Constants } from '@/constants/constants';
import { SecondaryTitle } from '@/components';
import { Tooltip } from '@mui/material';

interface Props {
  sidebarLinks: {
    text: string;
    icon: React.ReactNode;
    link: string;
  }[];
  children: React.ReactNode;
}

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const drawerWidth = Constants.DRAWER_WIDTH_PX;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

export default function Widget(props: Props) {
  /**
   * Declarations
   */
  const theme = useTheme();

  /**
   * States
   */
  const [open, setOpen] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);

  /**
   * Side effects
   */
  React.useEffect(() => {
    // TODO: Find way to display headers better
    setIsMounted(true);
  }, []);

  /**
   * Handlers
   */
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position='fixed' open={open}>
        <Toolbar
          style={{ flexDirection: 'row', justifyContent: 'space-between' }}
        >
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <IconButton
              color='inherit'
              aria-label='open drawer'
              onClick={handleDrawerOpen}
              edge='start'
              sx={{
                marginRight: 5,
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <SecondaryTitle
              title={isMounted ? document.title : ''}
              sx={{ margin: 'auto' }}
            />
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        variant='permanent'
        open={open}
        sx={{
          transition:
            'width 195ms cubic-bezier(0.4, 0, 0.6, 1) 0ms, transform 195ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
          ...(!open && {
            [theme.breakpoints.down('sm')]: {
              width: '0px',
              '& .MuiDrawer-paper': {
                transform: 'translate(-65px, 0)',
              },
            },
          }),
        }}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {props.sidebarLinks.map((item, index) => (
            <ListItem key={index} disablePadding sx={{ display: 'block' }}>
              <Tooltip title={item.text} placement='right'>
                <ListItemButton
                  href={item.link}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                      justifyContent: 'center',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
              </Tooltip>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box
        component='main'
        sx={{
          flexGrow: 1,
          p: 3,
          [theme.breakpoints.down('md')]: {
            p: 2,
          },
          [theme.breakpoints.down('sm')]: {
            p: 1,
          },
        }}
      >
        <DrawerHeader />
        {props.children}
      </Box>
    </Box>
  );
}
