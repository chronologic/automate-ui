import { notification } from 'antd';
import axios from 'axios';

export class UserAPI {
  public static async auth(login: string, password: string): Promise<string> {
    try {
      const response = await axios.post(this.API_URL + '/auth', { login, password });
      return response.data.apiKey;
    } catch (e) {
      notification.error({
        message: e.response?.data?.error?.message || e.message || 'Error',
      });
      throw e;
    }
  }

  private static API_URL: string = process.env.REACT_APP_API_URL as string;
}
