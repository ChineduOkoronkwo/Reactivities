import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { Grid, } from 'semantic-ui-react';
import LoadingComponent from '../../../app/layout/api/LoadingComponents';
import { useStore } from '../../../app/stores/store';
import ActivityFilters from './ActivityFilters';
import ActivityList from './ActivityList';

export default observer(function ActivityDashboard() {
  const {activityStore} = useStore();
  const {loadActivities, loadingInitial, activitySet} = activityStore;

  useEffect(() => {
    if(activitySet.size === 0) loadActivities()
  }, [activitySet, loadActivities])

  if (loadingInitial) return <LoadingComponent />

  return (
    <Grid>
      <Grid.Column width='10'>
        <ActivityList />
      </Grid.Column>
      <Grid.Column width='6'>
        <ActivityFilters />
      </Grid.Column>
    </Grid>
  )
})