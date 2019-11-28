import axios from 'axios';

export interface IStatsItem {
  assetCount: number;
  txCount: number;
  value: number;
}

export interface IStats {
  completed: IStatsItem;
  pending: IStatsItem;
}

export class StatsAPI {
  public static async getStats(): Promise<IStats> {
    const response = await axios.get(this.API_URL);
    return response.data;
  }
  private static API_URL: string = process.env.REACT_APP_API_URL + '/stats';
}
