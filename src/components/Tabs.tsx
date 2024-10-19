import React, { type ReactElement } from 'react';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Tab } from '@mui/material';

interface Props {
	currentTabValue: string;
	setCurrentTabValue: (value: React.SetStateAction<string>) => void;
	tabLabels: string[];
	tabComponents: (ReactElement | React.JSX.Element)[];
}

export default function Component(props: Props): ReactElement {
	return (
		<TabContext value={props.currentTabValue}>
			<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
				<TabList
					onChange={(_: React.SyntheticEvent, newValue: string) =>
						props.setCurrentTabValue(newValue)
					}
					aria-label='Taps'
					variant='scrollable'
				>
					{props.tabLabels.map((tabLabel, i) => {
						return <Tab key={i} label={tabLabel} value={(i + 1).toString()} />;
					})}
				</TabList>
			</Box>
			{props.tabComponents.map((tabComponent, i) => {
				return (
					<TabPanel key={i} value={(i + 1).toString()}>
						{tabComponent}
					</TabPanel>
				);
			})}
		</TabContext>
	);
}
