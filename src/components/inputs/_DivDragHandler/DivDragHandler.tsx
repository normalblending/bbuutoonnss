import React, {forwardRef, useImperativeHandle, useRef} from "react";
import cn from 'classnames';
import {DragEvent} from "./types";
import './DivDragHandler.css';
import {rotate, rotateArray} from "../../../utils/geometry";
import {useIsActive} from "../../../hooks/useIsActive";


export interface DivDragHandlerProps<TValue = any> extends Omit<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLDivElement>, HTMLDivElement>, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onMouseUp' | 'onChange'> {
    className?: string
    children?: React.ReactNode
    saveValue?: TValue
    angle?: number
    onChange?: (event: DragEvent, e: MouseEvent, savedValue?: TValue) => void
    onDrag?: (event: DragEvent, e: MouseEvent, savedValue?: TValue) => void
    onDragStart?: (event: DragEvent, e: MouseEvent, savedValue?: TValue) => void
    onDragEnd?: (event: DragEvent, e: MouseEvent, savedValue?: TValue) => void
    onMouseUp?: (e: MouseEvent) => void
    style?: object
}


export interface DivDragHandlerImperativeHandler{
    divRef: React.ForwardedRef<HTMLDivElement>
}


const getRotatedDragEvent = (startEvent: MouseEvent, e: MouseEvent, angle: number, dragEvent?: Partial<DragEvent>) => {
    const [startEventX, startEventY] = [startEvent.pageX, startEvent.pageY];

    const [eventX, eventY] = angle
        ? rotateArray([startEventX, startEventY], [e.pageX, e.pageY], angle)
        : [e.pageX, e.pageY];

    return {
        startEvent: startEvent,
        x: eventX - startEventX,
        y: eventY - startEventY,
        ...dragEvent,
    }
}

export const DivDragHandlerComponent = function<TValue>(props: DivDragHandlerProps<TValue>, ref) {

    const {
        className,
        children,
        saveValue,
        angle = 0,
        style,
        onMouseDown,
        onMouseUp,
        onDrag,
        onDragStart,
        onDragEnd,
        onChange,
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
                getRotatedDragEvent(startEvent.current, e, angle),
                e,
                saveValue,
            );
            onChange?.(
                getRotatedDragEvent(startEvent.current, e, angle),
                e,
                saveValue,
            )
        }
    }, [startEvent, onDrag, onChange, saveValue, angle]);

    const upHandler = React.useCallback((e: MouseEvent) => {
        if (startEvent.current) {
            onDragEnd?.(
                getRotatedDragEvent(startEvent.current, e, angle, {isDragEnd: true}),
                e,
                saveValue,
            );
            onChange?.(
                getRotatedDragEvent(startEvent.current, e, angle, {isDragEnd: true}),
                e,
                saveValue,
            );
        }
        handleDeactivate();
        document.removeEventListener('mousemove', moveHandler);
        document.removeEventListener('mouseup', upHandler);
        startEvent.current = null;
        savedValue.current = saveValue;

        onMouseUp?.(e)

    }, [onMouseUp, moveHandler, saveValue, handleDeactivate, onDragEnd, onChange]);

    const handlerDown = React.useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        handleActivate();

        startEvent.current = e.nativeEvent;
        savedValue.current = saveValue;

        onDragStart?.(
            getRotatedDragEvent(startEvent.current, e.nativeEvent, angle, {isDragStart: true}),
            e.nativeEvent,
            saveValue,
        );
        onChange?.(
            getRotatedDragEvent(startEvent.current, e.nativeEvent, angle, {isDragStart: true}),
            e.nativeEvent,
            saveValue,
        );

        document.addEventListener('mousemove', moveHandler);
        document.addEventListener('mouseup', upHandler);

        onMouseDown?.(e);
    }, [onMouseDown, moveHandler, upHandler, saveValue, handleActivate, onDragStart]);

    return (
        <div
            {...restProps}
            className={cn('div-drag-handler', {
                ['div-drag-handler-is-active']: isActive
            }, className)}
            style={style}
            onMouseDown={handlerDown}

        >
            {children}
        </div>
    );
}

export const DivDragHandler = forwardRef<DivDragHandlerImperativeHandler, DivDragHandlerProps<any>>(DivDragHandlerComponent) as <TValue>(
    props: DivDragHandlerProps<TValue> & { ref?: React.ForwardedRef<DivDragHandlerImperativeHandler> }
) => ReturnType<typeof DivDragHandlerComponent>;
