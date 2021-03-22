import React from 'react';
import { addons, types } from '@storybook/addons';
import { AddonPanel } from '@storybook/components';

import RelayPanel from './RelayPanel';
import { ADDON_ID, PARAM_KEY } from './shared';

addons.register(ADDON_ID, () => {
  addons.add(ADDON_ID, {
    title: 'Relay',
    type: types.PANEL,
    paramKey: PARAM_KEY,
    render: ({ active = false, key }) => (
      <AddonPanel key={key} active={active}>
        <RelayPanel />
      </AddonPanel>
    ),
  });
});
