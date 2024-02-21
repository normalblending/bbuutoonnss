import React from "react";

export type UseIsActive = [any, {
    handleActivate: (value?: any) => void,
    handleDeactivate: () => void
}];

export const useIsActive = (startValue: any = null): UseIsActive => {

    const [isActive, setIsActive] = React.useState<any>(startValue);

    const handleActivate = React.useCallback((value: any) => setIsActive(value || true), []);
    const handleDeactivate = React.useCallback(() => setIsActive(null), []);

    return [isActive, {handleActivate, handleDeactivate}];
};