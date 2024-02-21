import React, {useEffect, forwardRef, useImperativeHandle, useRef} from "react";
import cn from 'classnames';
import {DragEvent2} from "./types";
import './DivDragHandler.css';
import {rotate} from "../../../utils/geometry";
import {useIsActive} from "../../../hooks/useIsActive";

// используется только в children form
export interface DivDragHandler2Props<TValue = any> extends Omit<React.HTMLProps<HTMLDivElement>, 'onDrag' | 'onDragStart' | 'onDragEnd'> {
    className?: string
    children?: React.ReactNode
    saveValue?: TValue
    angle?: number
    onDrag?: (event: DragEvent2, e: MouseEvent, savedValue?: TValue) => void
    onDragStart?: (event: DragEvent2, e: MouseEvent, savedValue?: TValue) => void
    onDragEnd?: (event: DragEvent2, e: MouseEvent, savedValue?: TValue) => void
}

export interface DivDragHandler2ImperativeHandler{
    divRef
}

const getDragEvent2 = (e: MouseEvent, startEvent: MouseEvent, angle) => {
    const [startEventX, startEventY] = [startEvent.pageX, startEvent.pageY];

    const {x: eventX, y: eventY} = angle
        ? rotate(startEventX, startEventY, e.pageX, e.pageY, angle)
        : {x: e.pageX, y: e.pageY};

    return {
        startEvent: startEvent,
        x: eventX - startEventX,
        y: eventY - startEventY,
    }
}

export const DivDragHandler2 = forwardRef<DivDragHandler2ImperativeHandler, DivDragHandler2Props>(function <TValue>(props: DivDragHandler2Props<TValue>, ref) {

    const {
        className,
        children,
        saveValue,
        angle = 0,
        onMouseDown,
        onMouseUp,
        onDrag,
        onDragStart,
        onDragEnd,
        ...restProps
    } = props;

    const divRef = useRef()

    useImperativeHandle(ref, () => ({
        divRef,
    }), [divRef])

    const [isActive, {handleActivate, handleDeactivate}] = useIsActive();

    const startEvent = React.useRef<MouseEvent | null>();
    const savedValue = React.useRef<TValue | undefined>(saveValue);

    const moveHandler = React.useCallback((e: MouseEvent) => {
        if (startEvent.current) {

            onDrag?.(
                getDragEvent2(e, startEvent.current, angle),
                e,
                saveValue,
            );
        }
    }, [startEvent, onDrag, saveValue, angle]);

    const upHandler = React.useCallback((e) => {
        handleDeactivate();

        onDragEnd?.(
            getDragEvent2(e, startEvent.current, angle),
            e,
            savedValue.current
        )

        startEvent.current = null;
        savedValue.current = saveValue;

        onMouseUp?.(e)
    }, [onMouseUp, saveValue, handleDeactivate, onDragEnd]);

    const handlerDown = React.useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        handleActivate();
        
        startEvent.current = e.nativeEvent;
        savedValue.current = saveValue;

        onDragStart?.(
            getDragEvent2(e.nativeEvent, startEvent.current, angle),
            e.nativeEvent,
            savedValue.current
        )

        onMouseDown?.(e);
    }, [onMouseDown, saveValue, handleActivate, onDragStart]);

    useEffect(() => {
        if (isActive) {
            document.addEventListener('mousemove', moveHandler);
            document.addEventListener('mouseup', upHandler);
        }
        return () => {
            if (isActive) {
                document.removeEventListener('mousemove', moveHandler);
                document.removeEventListener('mouseup', upHandler);
            }
        }
    }, [moveHandler, upHandler, isActive])
    return (
        <div
            {...restProps}
            className={cn('div-drag-handler', {
                ['div-drag-handler-is-active']: isActive
            }, className)}
            onMouseDown={handlerDown}
            ref={divRef}

        >
            {children}
        </div>
    );
})
