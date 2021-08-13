import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
});

export default function CenteredTabs(props) {
  const num = props.activeIndex * 1;
  const classes = useStyles();
  
  return (
    <Paper className={classes.root}>
      <Tabs
        value={num}
        onChange={props.handleChange}
        indicatorColor="primary"
        textColor="primary"
        centered
        variant="fullWidth"
      >
        <Tab label="Home" />
        <Tab label="Events" />
        <Tab label="Recordings" />
        
        <Tab label="Profile" />
        <Tab label="Reviews" />
        <Tab label="Queries" />
      </Tabs>
    </Paper>
  );
}
