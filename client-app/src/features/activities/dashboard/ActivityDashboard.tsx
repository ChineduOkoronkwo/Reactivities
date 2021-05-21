import React from 'react';
import { Grid, } from 'semantic-ui-react';
import { Activity } from '../../../app/models/Activity';
import ActivityDetails from '../details/ActivityDetails';
import ActivityForm from '../form/ActivityForm';
import ActivityList from './ActivityList';

interface Props {
  activities: Activity[];
  selectedActivity: Activity | undefined;
  selectActivity: (id: string) => void;
  cancelSelectedActivity: () => void;
  editActivity: boolean;
  openEditActivityForm: (id: string) => void;
  closeEditActivityForm: () => void;
  createOrEdit: (activity: Activity) => void;
  deleteActivity: (id: string) => void;
}

export default function ActivityDashboard({activities, selectedActivity, 
  selectActivity, cancelSelectedActivity, editActivity, openEditActivityForm, closeEditActivityForm, createOrEdit, deleteActivity}: Props) {
  return (
    <Grid>
      <Grid.Column width='10'>
        <ActivityList 
          activities={activities}
          selectActivity={selectActivity}
          deleteActivity={deleteActivity}
        />
      </Grid.Column>
      <Grid.Column width='6'>
        {selectedActivity && !editActivity && <ActivityDetails 
          activity={selectedActivity} 
          cancelSelectedActivity={cancelSelectedActivity}
          openForm={openEditActivityForm}          
        />}
        {editActivity && 
          <ActivityForm 
            activity={selectedActivity} 
            closeForm={closeEditActivityForm}
            createOrEdit={createOrEdit}
          />}
      </Grid.Column>
    </Grid>
  )
}