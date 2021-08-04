import React, { useEffect } from 'react';

import SessionDetailCardsList from '../HelperComponents/SessionDetailCardsList';
import EventBanner from '../HelperComponents/EventBanner';

import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import NoteIcon from '@material-ui/icons/Note';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import Button from '@material-ui/core/Button';

import {fade, makeStyles} from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSessions, fetchSessionsForUser } from '../../../actions';
import { useParams } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
  button: {
    margin: theme.spacing(1),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    color: '#ffffff',
    backgroundColor: fade(theme.palette.common.white, 0.12),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

const LobbyAgenda = ({socket}) => {
  const dispatch = useDispatch();

  const role = useSelector((state) => state.eventAccessToken.role);
  const id = useSelector((state) => state.eventAccessToken.id);
  
  console.log(role, id);

  const params = useParams();
  
  const eventId = params.eventId;
  const communityId = params.communityId;

  useEffect(() => {
    dispatch(fetchSessionsForUser(eventId));
  }, []);

  const sessions = useSelector((state) => state.session.sessions);

  console.log(sessions);

  const classes = useStyles();
  return (
    <>
      <EventBanner />

      <div className="lobby-navigation-wrapper d-flex flex-row mb-4">
        <div className="me-5 lobby-nav-btn lobby-nav-btn-active">Agenda</div>
        <div className="lobby-nav-btn">Sponsors</div>
      </div>

      <div className="session-btn-and-filter-search-wrapper d-flex flex-row justify-content-between mb-5">
        <div className="all-and-my-sessions-w d-flex flex-row">
          <Button
            variant="contained"
            color="primary"
            className="session-switch session-switch-active me-3"
            startIcon={<CalendarTodayIcon />}
          >
            All Sessions
          </Button>

          <Button
            variant="contained"
            className="session-switch"
            startIcon={<NoteIcon />}
          >
            My Sessions
          </Button>
        </div>

        <div className="search-box-and-filter-icon-btn-w d-flex flex-row">
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{'aria-label': 'search'}}
            />
          </div>
        </div>
      </div>

      <SessionDetailCardsList socket={socket} sessions={sessions} role={role} id={id} eventId={eventId} communityId={communityId} />
    </>
  );
};

export default LobbyAgenda;
