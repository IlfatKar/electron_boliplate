import { makeAutoObservable } from 'mobx';
// eslint-disable-next-line import/no-cycle
import { IDevice } from 'renderer/components/Devices/Devices';
import { IDevicesTypes } from 'renderer/components/DevicesTypes/DevicesTypes';
import { IPoverka } from 'renderer/components/NeedPoverka/NeedPoverka';
import { IOilObject } from 'renderer/components/OilObjects/OilObjects';
import { IService } from 'renderer/components/Services/Services';

export enum ERole {
  Admin,
  user,
}

class State {
  constructor() {
    makeAutoObservable(this);
  }

  role: ERole | null = null;

  edited: IPoverka | IDevicesTypes | IDevice | IOilObject | IService | null =
    null;

  user: number = 0;

  setRole(role: ERole) {
    this.role = role;
  }

  setEdited(
    data: IPoverka | IDevicesTypes | IDevice | IOilObject | IService | null
  ) {
    this.edited = data;
  }

  setUser(id: number) {
    this.user = id;
  }
}
export default new State();
