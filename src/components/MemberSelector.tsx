import TeamBadge from './TeamBadge';

import gql from 'graphql-tag';
import React from 'react';
import { Query } from 'react-apollo';
import { Typeahead, Highlighter } from 'react-bootstrap-typeahead';

const GET_MEMBERS_QUERY = gql`
  {
    members(filter: { unit: "WOL" }) {
      _id
      fullName
      number
      surname
      team
    }
  }
`;

interface MemberData {
  _id: string;
  fullName: string;
  number: number;
  surname: string;
  team: string;
}

interface GetMembersData {
  members: MemberData[];
}

interface MemberSelectorProps {
  id: string;
  onChange: (value: number | undefined) => void;
  allowNone?: boolean;
}

interface Model {
  id: number;
  label: string;
  team?: string;
}

const MemberSelector: React.FC<MemberSelectorProps> = ({ id, onChange, allowNone }) => {
  return (
    <Query<GetMembersData> query={GET_MEMBERS_QUERY}>
      {({ loading, error, data }) => {
        let placeholder: string;
        let disabled = false;
        let members: Model[] = [];

        if (loading) {
          placeholder = 'Loading members...';
          disabled = true;
        } else if (error || !data) {
          placeholder = 'Error loading members';
          disabled = true;
        } else {
          placeholder = 'Select member...'

          members = data.members
            .sort((a, b) => a.surname.localeCompare(b.surname))
            .map((member) => ({ id: member.number, label: member.fullName, team: member.team }));

          if (allowNone) {
            members.unshift({
              id: 0,
              label: 'None',
            });
          }
        }

        return (
          <Typeahead<Model>
            id={id}
            placeholder={placeholder}
            disabled={disabled}
            options={members}
            renderMenuItemChildren={({ label, team }, props, _index) => (
              <React.Fragment>
                <Highlighter key='name' search={props.text}>
                  {label}
                </Highlighter>
                {' '}
                {team && <TeamBadge team={team} />}
              </React.Fragment>
            )}
            onChange={(selected) => onChange(selected.length === 0 ? undefined : selected[0].id)}
          />
        );
      }}
    </Query>
  );
};

export default MemberSelector;
