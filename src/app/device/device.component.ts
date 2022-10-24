import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { Device, DeviceType } from './device';
import { DeviceService } from './device.service';

export interface DialogData {
  device: Device,
  device_types: DeviceType[]
}

@Component({
  selector: 'app-device-dialog',
  templateUrl: './device-dialog.component.html',
  styleUrls: ['./device.component.scss']
})
export class DeviceDialogComponent {

  device: Device = {
    alias_name: '',
    firmware_version: '',
    serie_number: '',
    device_type: 0
  };

  constructor(
    public dialogRef: MatDialogRef<DeviceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.scss']
})
export class DeviceComponent implements OnInit, OnDestroy {
  destroyed = new Subject<void>();
  currentScreenSize: number | undefined;

  displayedColumns: string[] = ['name', 'field_type'];
  deviceList: Device[] = [];
  deviceTypeList: DeviceType[] = [];

  displayNameMap = new Map([
    [Breakpoints.XSmall, 1],
    [Breakpoints.Small, 1],
    [Breakpoints.Medium, 2],
    [Breakpoints.Large, 3],
    [Breakpoints.XLarge, 3],
  ]);

  constructor(
    private deviceService: DeviceService,
    public dialog: MatDialog,
    private breakpointObserver: BreakpointObserver
  ) {
  }

  ngOnInit(): void {
    this.getAllDeviceTypes();
    this.breakpointObserver
      .observe([
        Breakpoints.XSmall,
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
        Breakpoints.XLarge,
      ])
      .pipe(takeUntil(this.destroyed))
      .subscribe(result => {
        for (const query of Object.keys(result.breakpoints)) {
          if (result.breakpoints[query]) {
            this.currentScreenSize = this.displayNameMap.get(query) ?? 0;
          }
        }
      });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  getAllDevices() {
    this.deviceService.getAll()
      .subscribe((data: Device[]) => {
        this.deviceList = data.sort((a, b) => { return ((b.id ? b.id : 0) <= (a.id ? a.id : 0)) ? 1 : -1; });
      });
  }

  deleteOneDevice(device: Device) {
    if(device.id !== undefined) {
      this.deviceService.deleteOne(device.id)
        .subscribe(() => this.getAllDevices())
    }
  }

  addOneDevice(device: Device) {
    this.deviceService.addOne(device)
      .subscribe((data: Device) => {
        let idx = this.deviceList.findIndex((d) => d.id === device.id);
        if (idx === undefined) {
          this.deviceList.push(data);
        } else {
          this.deviceList[idx] = data;
        }
      });
  }

  getAllDeviceTypes() {
    this.deviceService.getAllTypes()
      .subscribe((data: DeviceType[]) => {
        this.deviceTypeList = data;
      }).add(() => {
        this.getAllDevices();
      })
  }

  getDeviceType(id: number): DeviceType {
    let device = this.deviceTypeList.find((deviceType) => deviceType.id === id);
    if (device === undefined) {
      return { id: 0, name: '', actions: [], fields: [] };
    }
    return device;
  }

  getDevice(id: number) {
    this.deviceService.getOne(id)
      .subscribe((data: Device) => {
        this.deviceList.push({
          id: data.id,
          alias_name: data.alias_name,
          firmware_version: data.firmware_version,
          serie_number: data.serie_number,
          device_type: data.device_type
        });
      });
  }

  openDialog(device: Device | null): void {
    let dialog_data: DialogData = {
      device: {
        alias_name: '',
        firmware_version: '',
        serie_number: '',
        device_type: 0
      },
      device_types: this.deviceTypeList
    }
    if(device !== null) {
      dialog_data.device = device;
    }
    const dialogRef = this.dialog.open(DeviceDialogComponent, {
      width: '250px',
      data: dialog_data
    });

    dialogRef.afterClosed()
      .subscribe((result: Device) => {
        if(result !== undefined) {
          if(result.id === undefined) {
            this.deviceService.addOne(result)
              .subscribe(() => { this.getAllDevices() })
          } else {
            this.deviceService.patchOne(result.id, result)
              .subscribe(() => { this.getAllDevices() })
          }
        }
      });
  }

}
