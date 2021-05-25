import { makeAutoObservable, runInAction } from 'mobx';
import agent from '../layout/api/agents';
import { Activity } from './../models/Activity';

export default class ActivityStore {

  activitySet: Map<string, Activity> = new Map<string, Activity>();
  loading = false;
  loadingInitial = false;

  constructor() {
    makeAutoObservable(this);
  }

  get activitiesByDate () {
    return Array.from(this.activitySet.values()).sort((a, b) =>
      Date.parse(b.date) - Date.parse(a.date));
  }

  loadActivities = async () => {
    this.setLoadingInitial(true);
    try {
      const activities = await agent.Activities.list();
      activities.forEach(activity => {
        this.setActivity(activity);
      })
      this.setLoadingInitial(false);
    } catch (error) {
      console.log(error);
      this.setLoadingInitial(false);
    }
  }

  private setActivity = (activity: Activity) => {
    activity.date = activity.date.split('T')[0];
    this.activitySet.set(activity.id, activity);
  }

  private getActivity = (id: string) => {
    return this.activitySet.get(id);
  }

  loadActivity = async (id: string) => {
    let activity = this.getActivity(id);
    if (activity) {
      return activity;
    } else {
      this.setLoadingInitial(true);
      try {
        activity = await agent.Activities.details(id);
        this.setActivity(activity);
        this.setLoadingInitial(false);
        return activity;
      } catch(error) {
        console.log(error);
        this.setLoadingInitial(false);
      }
    }
  }

  setLoadingInitial = (state: boolean) => {
    this.loadingInitial = state;
  }

  setLoading = (state: boolean) => {
    this.loading = state;
  }
  
  createActivity = async (activity: Activity) => {
    try {
      this.setLoading(true);
      await agent.Activities.create(activity);
      runInAction(() => {
        this.activitySet.set(activity.id, activity);    
      })
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
      })
      this.setLoading(false);
    } catch(error) {
      console.log(error);
      this.setLoading(false);
    }
  }
}