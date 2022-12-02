export interface DeviceActionParam {
    id: number,
    name: string,
    param_type: string,
    action: number,
    value?: string
}

export interface DeviceAction {
    id: number,
    name: string,
    function: string,
    params: DeviceActionParam[],
    device_type?: number
}

export interface DeviceField {
    id: number,
    name: string,
    field_type: string,
    unit: string,
    value: any,
    device_type: number
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
    serie_number: string,
    device_type: number,
    user_id?: number
}

export interface CommandParam {
    param_id: number,
    value: string
}

export interface Command {
    command_id: number,
    params: CommandParam[]
}
