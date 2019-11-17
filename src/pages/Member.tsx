import MemberTable from '../components/MemberTable';
import Page from '../components/Page';
import WeekBrowser from '../components/WeekBrowser';
import { getWeekInterval } from '../model/dates';

import Divider from '@material-ui/core/Divider';
import Fab from '@material-ui/core/Fab';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import AddIcon from '@material-ui/icons/Add';
import { DateTime } from 'luxon';
import React, { useState } from 'react';

const useStyles = makeStyles(theme => ({
  fab: {
    bottom: theme.spacing(2),
    position: 'absolute',
    right: theme.spacing(2),
  },
}));

const Member: React.FC = () => {
  const [week, setWeek] = useState(DateTime.local());
  const interval = getWeekInterval(week);

  const classes = useStyles();

  return (
    <Page title="My Availability">
      <Toolbar>
        <WeekBrowser value={week} onChange={week => setWeek(week)} />
      </Toolbar>
      <Divider />
      <MemberTable interval={interval} />
      <Fab color="secondary" className={classes.fab}>
        <AddIcon />
      </Fab>
    </Page>
  );
};

export default Member;
