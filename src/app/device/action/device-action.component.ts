import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DeviceAction, DeviceActionParam } from '../device';


@Component({
  selector: 'app-device-action',
  templateUrl: './device-action.component.html',
  styleUrls: ['./device-action.component.scss']
})
export class DeviceActionComponent {

  constructor(
    public dialogRef: MatDialogRef<DeviceActionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DeviceAction,
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
