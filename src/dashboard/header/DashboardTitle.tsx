import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { setDashboardTitle } from '../DashboardActions';
import { applicationGetConnection } from '../../application/ApplicationSelectors';
import {
  getDashboardTitle,
  getDashboardExtensions,
  getDashboardSettings,
  getDashboardTheme,
} from '../DashboardSelectors';
import { getDashboardIsEditable } from '../../settings/SettingsSelectors';
import { updateDashboardSetting } from '../../settings/SettingsActions';
import { Typography, IconButton, Menu, MenuItems } from '@neo4j-ndl/react';
import { EllipsisHorizontalIconOutline } from '@neo4j-ndl/react/icons';
import NeoSettingsModal from '../../settings/SettingsModal';
import NeoSaveModal from '../../modal/SaveModal';
import NeoLoadModal from '../../modal/LoadModal';
import NeoShareModal from '../../modal/ShareModal';
import NeoExtensionsModal from '../../extensions/ExtensionsModal';
import { EXTENSIONS_DRAWER_BUTTONS } from '../../extensions/ExtensionConfig';

export const NeoDashboardTitle = ({
  dashboardTitle,
  //   setDashboardTitle,
  editable,
  dashboardSettings,
  extensions,
  updateDashboardSetting,
  connection,
}) => {
  const [dashboardTitleText, setDashboardTitleText] = React.useState(dashboardTitle);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const handleSettingsMenuOpen = (event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleSettingsMenuClose = () => {
    setAnchorEl(null);
  };
  const menuOpen = Boolean(anchorEl);

  /**
   * Function to render dynamically the buttons in the drawer related to all the extension that
   * are enabled and present a button (EX: node-sidebar)
   * @returns JSX element containing all the buttons related to their enabled extensions
   */
  function renderExtensionsButtons() {
    const res = (
      <>
        {Object.keys(EXTENSIONS_DRAWER_BUTTONS).map((name, idx) => {
          const Component = extensions[name] ? EXTENSIONS_DRAWER_BUTTONS[name] : '';
          return Component ? <Component key={`ext-${idx}`} database={connection.database} /> : <></>;
        })}
      </>
    );
    return res;
  }

  useEffect(() => {
    // Reset text to the dashboard state when the page gets reorganized.
    if (dashboardTitle !== dashboardTitleText) {
      setDashboardTitleText(dashboardTitle);
    }
  }, [dashboardTitle]);
  return (
    <div className='n-flex n-flex-row n-flex-wrap n-justify-between n-items-center'>
      {/* TODO : Replace with editable field if dashboard is editable */}
      <Typography variant='h3'>{dashboardTitle}</Typography>
      {editable && (
        <div className='flex flex-row flex-wrap items-center gap-2'>
          <IconButton aria-label='Dashboard actions' onClick={handleSettingsMenuOpen}>
            <EllipsisHorizontalIconOutline />
          </IconButton>
          <Menu
            anchorOrigin={{
              horizontal: 'right',
              vertical: 'bottom',
            }}
            transformOrigin={{
              horizontal: 'right',
              vertical: 'top',
            }}
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={handleSettingsMenuClose}
            size='large'
          >
            <MenuItems>
              <NeoSettingsModal
                dashboardSettings={dashboardSettings}
                updateDashboardSetting={updateDashboardSetting}
              ></NeoSettingsModal>
              <NeoSaveModal />
              <NeoLoadModal />
              <NeoShareModal />
              <NeoExtensionsModal />
              {renderExtensionsButtons()}
            </MenuItems>
          </Menu>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  dashboardTitle: getDashboardTitle(state),
  editable: getDashboardIsEditable(state),
  dashboardSettings: getDashboardSettings(state),
  extensions: getDashboardExtensions(state),
  connection: applicationGetConnection(state),
});

const mapDispatchToProps = (dispatch) => ({
  setDashboardTitle: (title: any) => {
    dispatch(setDashboardTitle(title));
  },
  updateDashboardSetting: (setting, value) => {
    dispatch(updateDashboardSetting(setting, value));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(NeoDashboardTitle);