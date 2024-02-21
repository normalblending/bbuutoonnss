import {useCallback, useEffect} from "react";

export const useKeydown = (callbackF, callbackDep) => {
    const handler = useCallback(callbackF, callbackDep);
    useEffect(() => {
        document.addEventListener("keydown", handler);

        return () => {
            document.removeEventListener("keydown", handler);
        };
    }, [handler]);
}