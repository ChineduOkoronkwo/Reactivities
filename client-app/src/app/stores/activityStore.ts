import { makeAutoObservable, runInAction } from 'mobx';
import agent from '../layout/api/agents';
import { Activity } from './../models/Activity';
import {v4 as uuid} from 'uuid';

export default class ActivityStore {

  activitySet: Map<string, Activity> = new Map<string, Activity>();
  selectedActivity: Activity | undefined = undefined;
  editMode = false;
  loading = false;
  loadingInitial = true;

  constructor() {
    makeAutoObservable(this);
  }

  get activitiesByDate() {
    return Array.from(this.activitySet.values()).sort((a, b) =>
      Date.parse(b.date) - Date.parse(a.date));
  }

  loadActivities = async () => {
    try {
      const activities = await agent.Activities.list();
      activities.forEach(activity => {
        activity.date = activity.date.split('T')[0];
        this.activitySet.set(activity.id, activity);
      })
      this.setLoadingInitial(false);
    } catch (error) {
      console.log(error);
      this.setLoadingInitial(false);
    }
  }

  setLoadingInitial = (state: boolean) => {
    this.loadingInitial = state;
  }

  setLoading = (state: boolean) => {
    this.loading = state;
  }

  setEditMode = (state: boolean) => {
    this.editMode = state;
  }

  selectActivity = (id: string) => {
    this.selectedActivity = this.activitySet.get(id);
  }

  cancelSelectedActivity = () => {
    this.selectedActivity = undefined;
  }

  openForm = (id?: string) => {
    id ? this.selectActivity(id) : this.cancelSelectedActivity();
    this.editMode = true;
  }

  closeForm = () => {
    this.editMode = false;
  }

  createActivity = async (activity: Activity) => {
    try {
      this.setLoading(true);
      activity.id = uuid();
      await agent.Activities.create(activity);
      runInAction(() => {
        this.activitySet.set(activity.id, activity);    
      })
      this.selectActivity(activity.id);
      this.setEditMode(false);
      this.setLoading(false);
    } catch (error) {
      console.log(error);
      this.setLoading(false);
    }
  }

  updateActivity = async (activity: Activity) => {
    try {
      this.setLoading(true);
      await agent.Activities.update(activity);
      runInAction(() => {
        this.activitySet.set(activity.id, activity);     
      })
      this.selectActivity(activity.id);
      this.setEditMode(false);
      this.setLoading(false);
    } catch (error) {
      console.log(error);
      this.setLoading(false);
    }
  }

  deleteActivity = async (id: string) => {
    try {
      this.setLoading(true);
      await agent.Activities.delete(id);
      runInAction(() => {
        this.activitySet.delete(id);
        if (this.selectedActivity?.id === id) this.cancelSelectedActivity();
      })
      this.setLoading(false);
    } catch(error) {
      console.log(error);
      this.setLoading(false);
    }
  }
}