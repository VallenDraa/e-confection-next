import React from 'react';
import { WorkHistoryItem, WorkHistoryItemProps } from './work-history-item';
import { List, ListItem } from '@mui/material';

type WorkHistoryListProps = {
  workHistory: WorkHistoryItemProps[];
};

export default function WorkHistoryList(props: WorkHistoryListProps) {
  const { workHistory } = props;

  return (
    <List
      sx={{
        flexGrow: 1,
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      {workHistory.map(item => {
        return (
          <ListItem disablePadding key={item.noSeri}>
            <WorkHistoryItem {...item} />
          </ListItem>
        );
      })}
    </List>
  );
}
