import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import CalculateIcon from '@mui/icons-material/Calculate';
import RequestQuoteOutlinedIcon from '@mui/icons-material/RequestQuoteOutlined';

const PREFIX = '/calculator';

export const sidebarItems = [
  {
    text: 'Sahod Calculator',
    icon: <CalculateIcon />,
    link: `${PREFIX}/sahod-calculator`,
  },
  {
    text: 'Tax Annual Calculator',
    icon: <RequestQuoteOutlinedIcon />,
    link: `${PREFIX}/tax-annual-calculator`,
  },
  {
    text: 'Contact',
    icon: <PersonRoundedIcon />,
    link: `${PREFIX}/contact`,
  },
];
