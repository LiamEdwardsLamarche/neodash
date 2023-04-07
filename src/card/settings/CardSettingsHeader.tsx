import React from 'react';
import CardHeader from '@material-ui/core/CardHeader';
import { Tooltip } from '@material-ui/core';
import { IconButton } from '@neo4j-ndl/react';
import {
  ExpandIcon,
  ShrinkIcon,
  DragIcon,
  QuestionMarkCircleIconOutline,
  TrashIconOutline,
  DocumentDuplicateIconOutline,
  PlayCircleIconSolid,
} from '@neo4j-ndl/react/icons';

const NeoCardSettingsHeader = ({
  onRemovePressed,
  onToggleCardSettings,
  onToggleCardExpand,
  expanded,
  fullscreenEnabled,
  onReportHelpButtonPressed,
  onClonePressed,
}) => {
  const maximizeButton = (
    <IconButton aria-label='maximize' onClick={onToggleCardExpand}>
      <ExpandIcon />
    </IconButton>
  );

  const unMaximizeButton = (
    <IconButton aria-label='un-maximize' onClick={onToggleCardExpand}>
      <ShrinkIcon />
    </IconButton>
  );

  return (
    <CardHeader
      avatar={
        <div style={{ marginTop: '-8px', paddingBottom: '1px' }}>
          <IconButton clean size='medium'>
            <DragIcon className='drag-handle' />
          </IconButton>
          <Tooltip title='Help' aria-label='help'>
            <IconButton aria-label='help' onClick={onReportHelpButtonPressed} clean size='medium'>
              <QuestionMarkCircleIconOutline />
            </IconButton>
          </Tooltip>
          <Tooltip title='Delete' aria-label='delete'>
            <IconButton style={{ color: 'red' }} aria-label='remove' onClick={onRemovePressed} clean size='medium'>
              <TrashIconOutline />
            </IconButton>
          </Tooltip>
          <Tooltip title='Clone' aria-label='clone'>
            <IconButton style={{ color: 'green' }} aria-label='clone' onClick={onClonePressed} clean size='medium'>
              <DocumentDuplicateIconOutline />
            </IconButton>
          </Tooltip>
        </div>
      }
      action={
        <>
          {fullscreenEnabled ? expanded ? unMaximizeButton : maximizeButton : <></>}
          <Tooltip title='Save' aria-label='save'>
            <IconButton
              aria-label='save'
              onClick={(e) => {
                e.preventDefault();
                onToggleCardSettings();
              }}
              clean
              size='medium'
            >
              <PlayCircleIconSolid />
            </IconButton>
          </Tooltip>
        </>
      }
      title=''
      subheader=''
    />
  );
};

export default NeoCardSettingsHeader;