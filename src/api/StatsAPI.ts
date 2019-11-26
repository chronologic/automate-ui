import axios from 'axios';

interface IStatsItem {
  count: number;
  amount: number;
  value: number;
}

export interface IStatsDict {
  [key: string]: IStatsItem;
}

interface IStats {
  pending: IStatsDict;
  completed: IStatsDict;
}

export class StatsAPI {
  public static async getStats(): Promise<IStats> {
    const response = await axios.get(this.API_URL);
    return response.data;
  }
  private static API_URL: string = process.env.REACT_APP_API_URL + '/stats';
}
