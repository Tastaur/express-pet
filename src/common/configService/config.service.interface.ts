import { ENV_KEY } from "../../globalConstants";


export interface IConfigService {
  get: (key: ENV_KEY) => string;
}