import * as React from "react";
import {useCallback, useEffect, useState} from "react";
import {SelectDrop, SelectDropProps} from "../SelectDrop";

export interface SelectVideoDeviceProps extends Partial<SelectDropProps> {
    value?: string;
    onSelect?: (value: MediaDeviceInfo) => void
    items?: undefined
}

export const getVideoDevices = async (): Promise<MediaDeviceInfo[]> => {
    // запрос прав чтобы можно было получить список
    (await navigator.mediaDevices.getUserMedia({audio: true, video: true}))
        .getTracks().forEach(track => track.stop());

    try {
        const deviceInfos: MediaDeviceInfo[] = await navigator.mediaDevices.enumerateDevices();
        return deviceInfos.filter((device) => device.kind === "videoinput")
    } catch (error) {
        throw error
    }
};

export const SelectVideoDevice: React.FC<SelectVideoDeviceProps> = (props) => {

    const {onSelect, value, getText, getValue, ...restProps} = props;

    const [devices, setDevices] = useState<MediaDeviceInfo[]>();

    const getDevices = useCallback(async () => {
        setDevices(await getVideoDevices());
    }, []);

    useEffect(() => {
        getDevices();
    }, []);

    const handleSelectDevice = useCallback((data) => {
        onSelect?.(data.value ? data.item : null);
    }, [onSelect]);

    return (
        <SelectDrop
            {...restProps}
            value={value}
            nullAble
            nullText={'-'}
            items={devices || []}
            getValue={getValue || ((device) => device.deviceId)}
            getText={getText || ((device) => <span>{device.label}</span>)}
            onChange={handleSelectDevice}
        />
    );
};
