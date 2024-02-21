import React from "react";

export type UseBoolean = [boolean, () => void, () => void];

export const useBoolean = (startValue: boolean = false): UseBoolean => {

    const [isTrue, setBoolean] = React.useState(startValue);

    const handleActivate = React.useCallback(() => setBoolean(true), []);
    const handleDeactivate = React.useCallback(() => setBoolean(false), []);

    return [isTrue, handleActivate, handleDeactivate];
};