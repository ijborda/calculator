import React, { type ReactElement } from 'react';
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { ArrowRightIcon } from '@mui/x-date-pickers';
import { Subtitle } from '.';

interface Props {
  list: string[];
}

export default function Component(props: Props): ReactElement {
  return (
    <List sx={{ color: 'text.secondary' }} dense={true}>
      {props.list.map((c, i) => {
        return (
          <>
            <ListItem key={i} dense={true}>
              <ListItemIcon>
                <ArrowRightIcon />
              </ListItemIcon>
              <ListItemText>
                <Subtitle text={c}></Subtitle>
              </ListItemText>
            </ListItem>
          </>
        );
      })}
    </List>
  );
}
