import React, { useContext, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import SaveIcon from '@material-ui/icons/Save';
import CloseIcon from '@material-ui/icons/Close';
import {
  Checkbox,
  Input,
  FormControl,
  FormControlLabel,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { getDashboardJson } from './ModalSelectors';
import { applicationGetConnection } from '../application/ApplicationSelectors';
import { Neo4jContext, Neo4jContextState } from 'use-neo4j/dist/neo4j.context';
import { saveDashboardToHiveThunk } from '../solutions/persistence/SolutionsThunks';
import { ExpandMore } from '@material-ui/icons';

/**
 * A modal to save the dashboard and database to Hive
 */

const styles = {};

export const SaveToHiveModel = ({
  dashboard,
  connection,
  saveDashboardToHive,
  modalOpen,
  closeDialog,
  updateSaveToHiveProgress,
}) => {
  // pieces of code pulled from https://www.pluralsight.com/guides/uploading-files-with-reactjs
  // and pieces of code pulled from https://blog.logrocket.com/multer-nodejs-express-upload-file/
  const [selectedFile, setSelectedFile] = useState();
  const [isSelected, setIsSelected] = useState(false);
  const [overwriteExistingDashboard, setOverwriteExistingDashboard] = React.useState(false);

  const { driver } = useContext<Neo4jContextState>(Neo4jContext);

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
    setIsSelected(true);
  };

  const [expandedPanel, setExpandedPanel] = useState(false);
  const handleAccordionChange = (panel) => (event, isExpanded) => {
    console.log({ event, isExpanded });
    setExpandedPanel(isExpanded ? panel : false);
  };

  return (
    <Dialog maxWidth={'lg'} open={modalOpen === true} onClose={closeDialog} aria-labelledby='form-dialog-title'>
      <DialogTitle id='form-dialog-title'>
        Save to Hive
        <IconButton
          onClick={() => {
            closeDialog(false);
          }}
          style={{ padding: '3px', float: 'right' }}
        >
          <Badge badgeContent={''}>
            <CloseIcon />
          </Badge>
        </IconButton>
      </DialogTitle>
      <DialogContent style={{ width: '800px' }}>
        <DialogContentText>
          This will save your current dashboard to Hive. Use the file dialog to upload your Neo4j .dump file.
        </DialogContentText>

        <Accordion expanded={expandedPanel === 'dump'} onChange={handleAccordionChange('dump')}>
          <AccordionSummary expandIcon={<ExpandMore />}>DB Dump Upload</AccordionSummary>
          <AccordionDetails>
            <div style={{ height: '100px' }}>
              <Input type='file' name='databasedumpfile' style={{ marginBottom: '3px' }} onChange={changeHandler} />
              {isSelected && (
                <DialogContentText>
                  Currently Selected File: {selectedFile.name}
                  <span style={{ marginLeft: '2px' }}>
                    ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB, last modified:{' '}
                    {selectedFile.lastModifiedDate.toLocaleDateString()})
                  </span>
                </DialogContentText>
              )}
            </div>

            {dashboard?.extensions?.solutionsHive?.dbName && (
              <FormControl style={{ marginTop: '20px', marginLeft: '10px' }}>
                <Tooltip title='Overwrite dashboard(s) with the same name.' aria-label=''>
                  <FormControlLabel
                    control={
                      <Checkbox
                        style={{ fontSize: 'small', color: 'grey' }}
                        checked={overwriteExistingDashboard}
                        onChange={() => setOverwriteExistingDashboard(!overwriteExistingDashboard)}
                        name='overwrite'
                      />
                    }
                    label='Overwrite'
                  />
                </Tooltip>
              </FormControl>
            )}
          </AccordionDetails>
        </Accordion>

        <Accordion expanded={expandedPanel === 'aura'} onChange={handleAccordionChange('aura')}>
          <AccordionSummary expandIcon={<ExpandMore />}>Aura DB</AccordionSummary>
          <AccordionDetails>
            <TextField id='auraConnection' label='Connection URL' variant='outlined' />
            <TextField id='auraUsername' label='Username' variant='outlined' />
            <TextField id='auraPassword' label='Password' variant='outlined' />
          </AccordionDetails>
        </Accordion>

        <Button
          component='label'
          onClick={() => {
            saveDashboardToHive(
              driver,
              selectedFile,
              dashboard,
              new Date().toISOString(),
              connection.username,
              overwriteExistingDashboard,
              updateSaveToHiveProgress,
              expandedPanel,
              auraConnection.value,
              auraUsername.value,
              auraPassword.value
            );
            closeDialog({ closeSaveDialog: true });
          }}
          style={{ backgroundColor: 'white', marginTop: '20px', float: 'right' }}
          color='default'
          variant='contained'
          endIcon={<SaveIcon />}
          size='medium'
        >
          Done
        </Button>
        <Button
          component='label'
          onClick={closeDialog}
          style={{ float: 'right', marginTop: '20px', marginRight: '10px', backgroundColor: 'white' }}
          color='default'
          variant='contained'
          size='medium'
        >
          Cancel
        </Button>
      </DialogContent>
      <DialogActions></DialogActions>
    </Dialog>
  );
};

const mapStateToProps = (state) => ({
  dashboard: getDashboardJson(state),
  connection: applicationGetConnection(state),
});

const mapDispatchToProps = (dispatch) => ({
  saveDashboardToHive: (
    driver: any,
    selectedFile: any,
    dashboard: any,
    date: any,
    user: any,
    overwrite: boolean,
    updateSaveToHiveProgress: any,
    dbType: any,
    dbConnectionUrl: any,
    dbUsername: any,
    dbPassword: any
  ) => {
    dispatch(
      saveDashboardToHiveThunk(
        driver,
        selectedFile,
        dashboard,
        date,
        user,
        overwrite,
        updateSaveToHiveProgress,
        dbType,
        dbConnectionUrl,
        dbUsername,
        dbPassword
      )
    );
  },
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(SaveToHiveModel));
