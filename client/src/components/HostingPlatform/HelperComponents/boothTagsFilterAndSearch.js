import React from 'react';
import './../Styles/booth.scss';

import Select from 'react-select';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';

import {fade, makeStyles} from '@material-ui/core/styles';

const options = [
  {value: 'All', label: 'All Tags'},
  {value: 'sass', label: 'sass'},
  {value: 'ed-tech', label: 'ed-tech'},
  {value: 'education', label: 'education'},
  {value: 'green-energy', label: 'green-energy'},
  {value: 'automobile', label: 'automobile'},
  {value: 'automation', label: 'automation'},
];

const styles = {
  control: (base) => ({
    ...base,
    fontFamily: 'Ubuntu',
    fontWeight: '500',
    color: '#A7A7A7',
  }),
  menu: (base) => ({
    ...base,
    fontFamily: 'Ubuntu',
    fontWeight: '500',
    color: '#292929',
  }),
};

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

const BoothTagsFilterAndSearch = () => {
    const classes = useStyles();
    return (
<> 
<div className="tags-filter-and-search-box-container mb-5 d-flex flex-row justify-content-between">
        <div className="booth-tags-filter">
          <Select
            isMulti
            menuPlacement="auto"
            styles={styles}
            options={options}
            defaultValue={options[0]}
          />
        </div>
        <div>

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
</>
    );
}

export default BoothTagsFilterAndSearch;