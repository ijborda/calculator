import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import CalculateIcon from '@mui/icons-material/Calculate';
import RequestQuoteOutlinedIcon from '@mui/icons-material/RequestQuoteOutlined';

export const sidebarItems = [
  {
    text: 'Sahod Calculator',
    icon: <CalculateIcon />,
    link: '/sahod-calculator',
  },
  {
    text: 'Tax Annual Calculator',
    icon: <RequestQuoteOutlinedIcon />,
    link: '/tax-annual-calculator',
  },
  {
    text: 'Contact',
    icon: <PersonRoundedIcon />,
    link: '/contact',
  },
];
