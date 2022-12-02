import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DeviceAction, DeviceActionParam, DeviceField, DeviceType } from '../device/device';

type SuffixType = '' | 'field/' | 'action/' | 'action/param/';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  baseUrl = 'http://localhost:5000/';
  deviceUrl = this.baseUrl + 'device/';
  deviceTypeUrl = this.baseUrl + 'device_type/';

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<DeviceType[]>(this.deviceTypeUrl);
  }

  getOne<T>(suffix: SuffixType, id: number) {
    return this.http.get<T>(this.deviceTypeUrl + suffix + id);
  }
  
  addOne<T>(suffix: SuffixType, deviceType: T) {
    return this.http.post<T>(this.deviceTypeUrl + suffix, deviceType);
  }

  patchOne<T>(suffix: SuffixType, id: number, deviceType: T) {
    return this.http.patch<T>(this.deviceTypeUrl + suffix + id, deviceType);
  }

  deleteOne<T>(suffix: SuffixType, id: number) {
    return this.http.delete(this.deviceTypeUrl + suffix + id);
  }
}
