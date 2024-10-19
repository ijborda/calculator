import React, { type ReactElement } from 'react';
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface Props {
	defaultExpanded?: boolean;
	children: React.ReactNode;
	accordionTitle: React.ReactNode;
}

export default function Component(props: Props): ReactElement {
	return (
		<Accordion
			defaultExpanded={props.defaultExpanded ?? false}
			sx={{ padding: 2 }}
		>
			<AccordionSummary
				expandIcon={<ExpandMoreIcon />}
				aria-controls='panel1-content'
				id='panel1-header'
			>
				{props.accordionTitle}
			</AccordionSummary>
			<AccordionDetails sx={{ padding: 2 }}>{props.children}</AccordionDetails>
		</Accordion>
	);
}
