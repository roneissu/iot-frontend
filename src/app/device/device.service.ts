import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Device, DeviceType } from './device';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  baseUrl = 'http://localhost:5000/';
  deviceUrl = this.baseUrl + 'device/';
  deviceTypeUrl = this.baseUrl + 'device_type/';

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<Device[]>(this.deviceUrl);
  }

  getOne(id: number) {
    return this.http.get<Device>(this.deviceUrl + id);
  }

  addOne(device: Device) {
    return this.http.post<Device>(this.deviceUrl, device);
  }

  patchOne(id: number, device: Device) {
    return this.http.patch<Device>(this.deviceUrl + id, device);
  }

  deleteOne(id: number) {
    return this.http.delete(this.deviceUrl + id);
  }

  getAllTypes() {
    return this.http.get<DeviceType[]>(this.deviceTypeUrl + '');
  }

  getOneTypes(id: number) {
    return this.http.get<DeviceType>(this.deviceTypeUrl + '' + id);
  }
}
