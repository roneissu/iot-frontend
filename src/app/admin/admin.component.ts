import { Component, OnInit } from '@angular/core';
import { DeviceAction, DeviceActionParam, DeviceField, DeviceType } from '../device/device';
import { AdminService } from './admin.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  deviceTypes: DeviceType[] = [];
  displayedColumns: string[] = ['id', 'name', 'operations'];
  editing: DeviceType = { id: 0, name: '', actions: [], fields: [] };
  field_types: string[] = [ 'string', 'integer', 'float', 'boolean', 'date', 'time' ];
  expanded: [boolean, boolean] = [false, false];

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.getAll();
  }
  
  getAll(): void {
    this.adminService.getAll().subscribe(
      (data: DeviceType[]) => {
        this.deviceTypes = data;
        if (this.editing.id > 0) {
          let editingId = this.editing.id;
          this.editing = JSON.parse(JSON.stringify(this.deviceTypes.find(dt => dt.id === editingId))) || { id: 0, name: '', actions: [], fields: [] };
        } else {
          this.cancelEditing();
        }
      }
    )
  }

  cancelEditing() {
    this.editing = { id: 0, name: '', actions: [], fields: [] };
  }

  changeType(operation: 'ADD' | 'EDIT' | 'SAVE' | 'REMOVE', deviceType?: DeviceType): void {
    if (operation === 'ADD') {
      this.expanded = [false, false];
      this.editing = { id: -1, name: '', actions: [], fields: [] };
    } else if (operation === 'EDIT' && deviceType) {
      if (deviceType.id !== this.editing.id) this.expanded = [false, false];
      this.editing = JSON.parse(JSON.stringify(deviceType));
    } else if (operation === 'SAVE' && deviceType) {
      if (deviceType.id > 0) {
        this.adminService
          .patchOne<DeviceType>('', deviceType.id, deviceType)
          .subscribe(data => { this.getAll(); this.editing = JSON.parse(JSON.stringify(data)); });
      } else {
        this.adminService
          .addOne<DeviceType>('', deviceType)
          .subscribe(data => { this.getAll(); this.editing = JSON.parse(JSON.stringify(data)); });
      }
    } else if (operation === 'REMOVE' && deviceType) {
      this.adminService.deleteOne<DeviceType>('', deviceType.id).subscribe(data => { this.getAll(); this.cancelEditing(); });
    }
  }

  changeAction(
    deviceType: DeviceType,
    operation: 'ADD' | 'SAVE' | 'REMOVE',
    idx: number = -1
  ): void {
    if (operation === 'ADD') {
      deviceType.actions.push({
        id: 0,
        name: '',
        function: '',
        params: [],
        device_type: deviceType.id
      });
    } else if (operation === 'SAVE' && idx >= 0) {
      if (deviceType.actions[idx].id > 0) {
        this.adminService.patchOne<DeviceAction>(
          'action/',
          deviceType.actions[idx].id,
          deviceType.actions[idx]
        ).subscribe(data => this.getAll());
      } else {
        this.adminService.addOne<DeviceAction>(
          'action/',
          deviceType.actions[idx]
        ).subscribe(data => this.getAll());
      }
    } else if (operation === 'REMOVE' && idx >= 0) {
      this.adminService.deleteOne<DeviceAction>(
        'action/',
        deviceType.actions[idx].id
      ).subscribe(data => this.getAll());
    }
  }

  changeParam(
    deviceType: DeviceType,
    operation: 'ADD' | 'SAVE' | 'REMOVE',
    idx: number = -1,
    param_idx: number = -1
  ): void {
    if (operation === 'ADD' && idx >= 0) {
      deviceType.actions[idx].params.push({
        id: 0,
        name: '',
        param_type: 'string',
        action: deviceType.actions[idx].id
      });
    } else if (operation === 'SAVE' && idx >= 0 && param_idx >= 0) {
      if (deviceType.actions[idx].params[param_idx].id > 0) {
        this.adminService.patchOne<DeviceActionParam>(
          'action/param/',
          deviceType.actions[idx].params[param_idx].id,
          deviceType.actions[idx].params[param_idx]
        ).subscribe(data => this.getAll());
      } else {
        this.adminService.addOne<DeviceActionParam>(
          'action/param/',
          deviceType.actions[idx].params[param_idx]
        ).subscribe(data => this.getAll());
      }
    } else if (operation === 'REMOVE' && idx >= 0 && param_idx >= 0) {
      this.adminService.deleteOne<DeviceActionParam>(
        'action/param/',
        deviceType.actions[idx].params[param_idx].id
      ).subscribe(data => this.getAll());
    }
  }

  changeField(
    operation: 'ADD' | 'SAVE' | 'REMOVE',
    deviceType: DeviceType,
    idx: number = -1
  ): void {
    if (operation === 'ADD') {
      deviceType.fields.push({
        id: 0,
        name: '',
        field_type: 'string',
        unit: '',
        device_type: deviceType.id,
        value: ''
      })
    } else if (operation === 'SAVE' && idx >= 0) {
      if (deviceType.fields[idx].id > 0) {
        this.adminService.patchOne<DeviceField>('field/',
          deviceType.fields[idx].id, deviceType.fields[idx]
        ).subscribe(data => this.getAll());
      } else {
        this.adminService.addOne<DeviceField>('field/',
          deviceType.fields[idx]
        ).subscribe(data => this.getAll());
      }
    } else if (operation === 'REMOVE' && idx >= 0) {
      this.adminService.deleteOne<DeviceField>('field/',
        deviceType.fields[idx].id
      ).subscribe(data => this.getAll());
    }
  }
}
