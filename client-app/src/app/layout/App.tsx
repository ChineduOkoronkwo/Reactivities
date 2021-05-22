import React, { Fragment, useEffect, useState } from 'react';
import { Container } from 'semantic-ui-react';
import { Activity } from '../models/Activity';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import {v4 as uuid} from 'uuid'
import agent from './api/agents';
import LoadingComponent from './api/LoadingComponents';

function App() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);
  const [editActivity, setEditActivity] = useState(false);
  const [loading, setLoading] = useState(true);
  const[submitting, setSubmitting] = useState(false);

  useEffect(() => {
    agent.Activities.list().then(response => {
      let activities: Activity[] = [];
      response.forEach(activity => {
        activity.date = activity.date.split('T')[0];
        activities.push(activity)
      })
      setActivities(activities);
      setLoading(false);
    })
  }, [])

  function handleSelectedActivity(id: string) {
    setSelectedActivity(activities.find(x => x.id === id));
  }

  function handleCancelSelectedActivity() {
    setSelectedActivity(undefined);
  }

  function handleOpenEditActivityForm(id?: string) {
    id ? handleSelectedActivity(id) : handleCancelSelectedActivity();
    setEditActivity(true);
  }

  function handleCloseEditActivityForm() {
    setEditActivity(false);
  }

  function handleCreateOrEditActivity(activity: Activity) {
      setSubmitting(true);
      if (activity.id) {
        agent.Activities.update(activity).then(() => {
          setActivities([...activities.filter(x => x.id !== activity.id), activity])
          setSelectedActivity(activity);          
          setEditActivity(false);
          setSubmitting(false);
        })
      } else {
        activity.id = uuid();
        agent.Activities.create(activity).then(() => {
          setActivities([...activities, activity]);          
          setSelectedActivity(activity);
          setEditActivity(false);
          setSubmitting(false);
        })
      }
  }

  function handleDeleteActivity(id: string) {
    setSubmitting(true);
    agent.Activities.delete(id).then(() => {
      setActivities([...activities.filter(x => x.id !== id)]);
      setSubmitting(false);
    })    
  }

  if (loading) return <LoadingComponent />

  return (
    <Fragment>
      <NavBar openForm={handleOpenEditActivityForm}/>
      <Container style={{marginTop: '7em'}}>
        <ActivityDashboard 
          activities={activities}
          selectedActivity={selectedActivity}
          selectActivity={handleSelectedActivity}
          cancelSelectedActivity={handleCancelSelectedActivity}
          editActivity={editActivity}
          openEditActivityForm={handleOpenEditActivityForm}
          closeEditActivityForm={handleCloseEditActivityForm}
          createOrEdit={handleCreateOrEditActivity}
          deleteActivity={handleDeleteActivity}
          submitting={submitting}
        />
      </Container>      
    </Fragment>
  );
}

export default App;
