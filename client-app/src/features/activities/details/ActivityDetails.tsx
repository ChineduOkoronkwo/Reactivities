import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import { Button, Card, Image } from 'semantic-ui-react';
import LoadingComponent from '../../../app/layout/api/LoadingComponents';
import { useStore } from '../../../app/stores/store';


export default observer(function ActivityDetails() {
  const {activityStore} = useStore();
  const {loadActivity, loadingInitial} = activityStore;
  const {id} = useParams<{id: string}>();
  const [activity, setActivity] = useState({
    id: '',
    title: '',
    date: '',
    description: '',
    category: '',
    city: '',
    venue: ''
  });

  useEffect(() => {
    if (id) loadActivity(id).then(activity => setActivity(activity!))
  }, [id, loadActivity])

  if (loadingInitial || !activity) return <LoadingComponent />;

  return (
    <Card fluid>
      <Image src={`/assets/categoryImages/${activity?.category}.jpg`} />
      <Card.Content>
        <Card.Header>{activity?.title}</Card.Header>
        <Card.Meta>
          <span>{activity?.date}</span>
        </Card.Meta>
        <Card.Description>
          {activity?.description}
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Button.Group widths='2'>
          <Button as={Link} to={`/manage/${activity.id}`} basic color='blue' content='Edit' />
          <Button as={Link} to='/activities' basic color='grey' content='Cancel' />
        </Button.Group>
      </Card.Content>
    </Card>
  )
})