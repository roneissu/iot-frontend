export interface DeviceAction {
    id: number,
    name: string,
    action_type: string
}

export interface DeviceField {
    id: number,
    name: string,
    field_type: string
}

export interface DeviceType {
    id: number,
    name: string,
    actions: DeviceAction[],
    fields: DeviceField[]
}

export interface Device {
    id?: number,
    alias_name: string,
    firmware_version: string,
    serie_number: string
    device_type: number
}
