
import axios, { AxiosResponse } from 'axios';

const API_URL = 'http://localhost:5000/api/users/';

interface UserCredentials {
  username: string;
  password: string;
}

interface UserResponse {
  data: any; 
}

const register = (username: string, password: string): Promise<AxiosResponse<UserResponse>> => {
  return axios.post<UserResponse>(API_URL + 'register', {
    username,
    password
  });
};

const login = (username: string, password: string): Promise<AxiosResponse<UserResponse>> => {
  return axios.post<UserResponse>(API_URL + 'login', {
    username,
    password
  });
};

export default { register, login };
