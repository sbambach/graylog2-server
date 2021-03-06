// @flow strict
import * as React from 'react';
import * as Immutable from 'immutable';

import { getEnterpriseGroupSyncPlugin } from 'util/AuthenticationService';
import type { DirectoryServiceBackend } from 'logic/authentication/directoryServices/types';
import Role from 'logic/roles/Role';
import { EnterprisePluginNotFound } from 'components/common';
import SectionComponent from 'components/common/Section/SectionComponent';

import EditLinkButton from './EditLinkButton';

import { STEP_KEY as GROUP_SYNC_KEY } from '../BackendWizard/GroupSyncStep';

type Props = {
  authenticationBackend: DirectoryServiceBackend,
  excludedFields?: {[ inputName: string ]: boolean },
  roles: Immutable.List<Role>,
};

const GroupSyncSection = ({ authenticationBackend, roles, excludedFields }: Props) => {
  const enterpriseGroupSyncPlugin = getEnterpriseGroupSyncPlugin();
  const GroupSyncSectionPlugin = enterpriseGroupSyncPlugin?.components.GroupSyncSection;

  if (!GroupSyncSectionPlugin) {
    <SectionComponent title="Group Synchronization"
                      headerActions={(
                        <EditLinkButton authenticationBackendId={authenticationBackend.id}
                                        stepKey={GROUP_SYNC_KEY} />
                      )}>
      <EnterprisePluginNotFound featureName="group synchronization" />
    </SectionComponent>;
  }

  return (
    <GroupSyncSectionPlugin authenticationBackend={authenticationBackend}
                            excludedFields={excludedFields}
                            roles={roles} />
  );
};

GroupSyncSection.defaultProps = {
  excludedFields: undefined,
};

export default GroupSyncSection;
