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
        <Tab label="Home" style={{fontWeight: "500", fontFamily: "Inter", textTransform: "capitalize"}} />
        <Tab label="Events" style={{fontWeight: "500", fontFamily: "Inter", textTransform: "capitalize"}}/>
        <Tab label="Recordings" style={{fontWeight: "500", fontFamily: "Inter", textTransform: "capitalize"}}/>
        
        <Tab label="Profile" style={{fontWeight: "500", fontFamily: "Inter", textTransform: "capitalize"}}/>
        <Tab label="Reviews" style={{fontWeight: "500", fontFamily: "Inter", textTransform: "capitalize"}}/>
        <Tab label="Queries" style={{fontWeight: "500", fontFamily: "Inter", textTransform: "capitalize"}}/>
      </Tabs>
    </Paper>
  );
}
