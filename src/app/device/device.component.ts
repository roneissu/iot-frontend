import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CookieService } from 'ngx-cookie-service';
import { map, Subject, takeUntil } from 'rxjs';
import { LoginService } from '../login/login.service';
import { ToastService } from '../toast/toast.service';
import { DeviceActionComponent } from './action/device-action.component';
import { Command, CommandParam, Device, DeviceAction, DeviceActionParam, DeviceField, DeviceType } from './device';
import { DeviceService } from './device.service';
import { DialogData } from "./dialog/device-dialog";
import { DeviceDialogComponent } from './dialog/device-dialog.component';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-confirm-dialog',
  template: `
    <h1 mat-dialog-title>{{data}}</h1>
    <div mat-dialog-actions>
      <button mat-flat-button color="primary" (click)="onNoClick()">Cancel</button>
      <button mat-flat-button color="warn" [mat-dialog-close]="true" cdkFocusInitial>Delete</button>
    </div>
  `,
  styleUrls: ['./device.component.scss']
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string,
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

  displayedColumns: string[] = ['name', 'value', 'unit'];
  deviceList: Device[] | undefined;
  deviceTypeList: DeviceType[] = [];

  displayNameMap = new Map([
    [Breakpoints.XSmall, 1],
    [Breakpoints.Small, 1],
    [Breakpoints.Medium, 2],
    [Breakpoints.Large, 3],
    [Breakpoints.XLarge, 3],
  ]);

  received: any[] = [];

  constructor(
    private deviceService: DeviceService,
    public dialog: MatDialog,
    private breakpointObserver: BreakpointObserver,
    private cookieService: CookieService,
    private loginService: LoginService,
    private toastService: ToastService,
    private socket: Socket
  ) {
    this.socket.on("connect", () => {
      console.log("Connected");
    });
    this.socket.on("values", (data: { "msg": { "serie_number": string, "name": string, "value": any } }) => {
      let devType: number | undefined = this.deviceList?.find(device => device.serie_number === data.msg.serie_number)?.device_type;
      if (devType) {
        let field: DeviceField | undefined = this.getDeviceType(devType).fields.find(tp => tp.name === data.msg.name);
        if (field) {
          field.value = data.msg.value
        }
      }
      this.sendMessage("abcdsdsd");
    });
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
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: `Delete ${device.alias_name}?`
    });

    dialogRef.afterClosed()
      .subscribe((result: boolean) => {
        if (result !== undefined) {
          if (device.id !== undefined) {
            let device_name = device.alias_name;
            this.deviceService.deleteOne(device.id)
              .subscribe(() => {
                this.getAllDevices();
                this.toastService.showSuccess(`Device \"${device_name}\" deleted with success!`);
              })
          }
        }
      });
  }

  getAllDeviceTypes() {
    this.deviceService.getAllTypes()
      .subscribe((data: DeviceType[]) => {
        this.deviceTypeList = data;
        this.getAllDevices();
      });
  }

  getDeviceType(id: number): DeviceType {
    let device = this.deviceTypeList.find((deviceType) => deviceType.id === id);
    if (device === undefined) {
      return { id: 0, name: '', actions: [], fields: [] };
    }
    return device;
  }

  sendCommand(id: number, action: DeviceAction) {
    const dialogRef = this.dialog.open(DeviceActionComponent, {
      width: '500px',
      data: action
    });

    dialogRef.afterClosed()
      .subscribe((result: DeviceAction) => {
        if (result !== undefined) {
          let params: CommandParam[] = [];
          result.params.forEach((param: DeviceActionParam) => { params.push({ param_id: param.id, value: param.value || "" }) })
          let command: Command = {
            command_id: result.id,
            params: params
          }
          this.deviceService.sendCommand(id, command)
            .subscribe((response: { result: boolean, message: string } | any) => {
              if (response.result) {
                this.toastService.showSuccess(response.message);
              }
            });
        }
      });
  }

  getDevice(id: number) {
    this.deviceService.getOne(id)
      .subscribe((data: Device) => {
        if (this.deviceList === undefined) {
          this.deviceList = [];
        }
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
    if (device !== null) {
      dialog_data.device = device;
    }
    const dialogRef = this.dialog.open(DeviceDialogComponent, {
      width: '500px',
      data: dialog_data
    });

    dialogRef.afterClosed()
      .subscribe((result: Device) => {
        if (result !== undefined) {
          if (result.id === undefined) {
            result.user_id = Number(this.cookieService.get(this.loginService.COOKIE_ID));
            this.deviceService.addOne(result)
              .subscribe(() => {
                this.getAllDevices();
                this.toastService.showSuccess(`Device \"${result.alias_name}\" added with success!`);
              })
          } else {
            this.deviceService.patchOne(result.id, result)
              .subscribe(() => {
                this.getAllDevices();
                this.toastService.showSuccess(`Device \"${result.alias_name}\" edited with success!`);
              })
          }
        }
      });
  }

  sendMessage(msg: string) {
    this.socket.emit('message', msg);
  }

  getMessage() {
    return this.socket.fromEvent('message').pipe(map((data: any) => {
      console.log(data.msg);
      return data.msg;
    }));
  }
}
