import Page from '../components/Page';
import UnitTable from '../components/UnitTable';
import WeekBrowser from '../components/WeekBrowser';
import { getWeekInterval, TIME_ZONE } from '../model/dates';
import {
  FLOOD_RESCUE,
  FLOOD_RESCUE_L2,
  FLOOD_RESCUE_L3,
  VERTICAL_RESCUE,
} from '../model/qualifications';
import {
  GET_MEMBERS_AVAILABILITIES_QUERY,
  GetMembersAvailabilitiesData,
  GetMembersAvailabilitiesVars,
  MemberWithAvailabilityData,
} from '../queries/availability';

import { DateTime, Interval } from 'luxon';
import React from 'react';
import { useQuery } from 'react-apollo';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import { LinkContainer } from 'react-router-bootstrap';
import Nav from 'react-bootstrap/Nav';
import { useParams } from 'react-router-dom';

interface RescueProps {
  title: string;
  qualifications: string[];
  sort?: (a: MemberWithAvailabilityData, b: MemberWithAvailabilityData) => number;
}

interface Params {
  week?: string;
}

const Rescue: React.FC<RescueProps> = props => {
  const { title, qualifications, sort } = props;
  const params = useParams<Params>();

  let week: Interval;

  if (params.week === undefined) {
    week = getWeekInterval();
  } else {
    week = getWeekInterval(DateTime.fromISO(params.week, { zone: TIME_ZONE }));
  }

  const { loading, error, data } = useQuery<GetMembersAvailabilitiesData, GetMembersAvailabilitiesVars>(
    GET_MEMBERS_AVAILABILITIES_QUERY,
    {
      variables: {
        filter: { qualificationsAny: qualifications },
        start: week.start.toJSDate(),
        end: week.end.toJSDate(),
      },
    },
  );

  const handleWeekChange = () => {
  };

  return (
    <Page title={title}>
      <Nav variant='tabs' className='mt-1'>
        <Nav.Item>
          <LinkContainer to='/unit/vr'><Nav.Link>Vertical Rescue</Nav.Link></LinkContainer>
        </Nav.Item>
        <Nav.Item>
        <LinkContainer to='/unit/fr'><Nav.Link>Flood Rescue</Nav.Link></LinkContainer>
        </Nav.Item>
      </Nav>
      <div className='border-bottom p-3'>
        <WeekBrowser value={week} onChange={handleWeekChange} />
      </div>
      {(() => {
        if (loading) {
          return (
            <Alert variant='info' className='m-3'>
              <Spinner size='sm' animation='border' /> Loading rescue availabilty&hellip;
            </Alert>
          );
        }

        if (error || !data) {
          return (
            <Alert variant='danger' className='m-3'> Error loading rescue availability.</Alert>
          );
        }

        return (
          <UnitTable
            interval={week}
            members={data.members}
            featuredQualifications={qualifications.length > 1 ? qualifications : []}
            sort={sort}
          />
        );
      })()}
    </Page>
  );
};

export const FloodRescue: React.FC = () => {
  const level = ({ qualifications }: MemberWithAvailabilityData) => {
    if (qualifications.includes(FLOOD_RESCUE_L3)) {
      return 3;
    } else if (qualifications.includes(FLOOD_RESCUE_L2)) {
      return 2;
    } else {
      return 1;
    }
  };

  return (
    <Rescue
      title='Flood Rescue'
      qualifications={FLOOD_RESCUE}
      sort={(a, b) => (
        level(b) - level(a) || a.team.localeCompare(b.team) || a.surname.localeCompare(b.surname)
      )}
    />
  );
};

export const VerticalRescue: React.FC = () => (
  <Rescue title='Vertical Rescue' qualifications={VERTICAL_RESCUE} />
);