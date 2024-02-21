import React, {
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useRef
} from "react";
import cn from 'classnames';
import {DragEvent} from "./types";
import './DragHandler.css';
import {rotateArray} from "../../../utils/geometry";
import {useIsActive} from "../../../hooks/useIsActive";

export interface DragHandlerProps<TValue = any> extends Omit<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLDivElement>, HTMLDivElement>, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onChange' | 'ref'> {
    className?: string
    children?: React.ReactNode
    saveValue?: TValue
    angle?: number
    onChange?: (event: DragEvent, e: PointerEvent, savedValue?: TValue) => void
    onDrag?: (event: DragEvent, e: PointerEvent, savedValue?: TValue) => void
    onDragStart?: (event: DragEvent, e: PointerEvent, savedValue?: TValue) => void
    onDragEnd?: (event: DragEvent, e: PointerEvent, savedValue?: TValue) => void
    style?: object
    pointerLock?: boolean
}

export interface DragHandlerImperativeHandler {
    divRef: React.RefObject<HTMLDivElement>
}

const getRotatedDragEvent = (startEvent: PointerEvent, value: [number, number], e: PointerEvent, angle: number, dragEvent?: Partial<DragEvent>) => {

    const [eventX, eventY] = angle
        ? rotateArray([0, 0], value, angle)
        : value;

    // console.log(eventX, eventY)
    return {
        startEvent,
        x: eventX,
        y: eventY,
        ...dragEvent,
    }
}

enum PointerMode {
    Default = 'default',
    Lock = 'lock'
}

export function DragHandlerComponent<TValue>(props: DragHandlerProps<TValue>, ref) {

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
        pointerLock,
        ...restProps
    } = props;

    const divRef = useRef<HTMLDivElement>(null)

    useImperativeHandle(ref, () => ({
        divRef,
    }), [divRef])

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isActive, {handleActivate, handleDeactivate}] = useIsActive();

    const absValue = React.useRef<[number, number]>([0, 0]);
    const startEvent = React.useRef<PointerEvent>(null);
    const savedValue = React.useRef<TValue | undefined>(saveValue);

    // LOCK LOCK LOCK LOCK LOCK LOCK LOCK LOCK LOCK LOCK LOCK LOCK LOCK LOCK LOCK LOCK LOCK LOCK LOCK LOCK LOCK
    // LOCK LOCK LOCK LOCK LOCK LOCK LOCK LOCK LOCK LOCK LOCK LOCK LOCK LOCK LOCK LOCK LOCK LOCK LOCK LOCK LOCK
    // LOCK LOCK LOCK LOCK LOCK LOCK LOCK LOCK LOCK LOCK LOCK LOCK LOCK LOCK LOCK LOCK LOCK LOCK LOCK LOCK LOCK

    const moveHandlerPointerLock = React.useCallback((e: PointerEvent) => {
        if (startEvent.current) {
            absValue.current = [absValue.current[0] + e.movementX, absValue.current[1] + e.movementY]
            onDrag?.(
                getRotatedDragEvent(startEvent.current, absValue.current, e, angle),
                e,
                savedValue.current,
            );
            onChange?.(
                getRotatedDragEvent(startEvent.current, absValue.current, e, angle),
                e,
                savedValue.current,
            )
        }
    }, [absValue, startEvent, onDrag, onChange, savedValue, angle]);

    const upHandlerPointerLock = React.useCallback((e) => {
        if (startEvent.current) {
            onDragEnd?.(
                getRotatedDragEvent(startEvent.current, absValue.current, e, angle, {isDragEnd: true}),
                e,
                savedValue.current,
            );
            onChange?.(
                getRotatedDragEvent(startEvent.current, absValue.current, e, angle, {isDragEnd: true}),
                e,
                savedValue.current,
            );
        }
        handleDeactivate();
        document.exitPointerLock?.();

        startEvent.current = null;
        // absValue.current = [0, 0];
        // savedValue.current = saveValue;

        onMouseUp?.(e)
    }, [onMouseUp, absValue, moveHandlerPointerLock, saveValue, angle, handleDeactivate, onDragEnd, onChange]);

    const handlerDownPointerLock = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
        canvasRef.current.requestPointerLock()
        handleActivate(PointerMode.Lock);

        absValue.current = [0, 0];
        startEvent.current = e.nativeEvent;
        savedValue.current = saveValue;

        console.log(absValue.current, startEvent.current, savedValue.current)

        const eventOptions: [DragEvent, PointerEvent, TValue | undefined] = [
            getRotatedDragEvent(startEvent.current, absValue.current, e.nativeEvent, angle, {isDragStart: true}),
            e.nativeEvent,
            savedValue.current,
        ]

        onDragStart?.(...eventOptions);
        onChange?.(...eventOptions);

        onMouseDown?.(e);
    }, [angle, canvasRef, absValue, onMouseDown, moveHandlerPointerLock, upHandlerPointerLock, saveValue, handleActivate, onChange, onDragStart])

    useEffect(() => {
        if (isActive === PointerMode.Lock) {
            document.addEventListener('pointermove', moveHandlerPointerLock);
            document.addEventListener('pointerup', upHandlerPointerLock);
        }
        return () => {
            if (isActive === PointerMode.Lock) {
                document.removeEventListener('pointermove', moveHandlerPointerLock);
                document.removeEventListener('pointerup', upHandlerPointerLock);
            }
        }
    }, [moveHandlerPointerLock, upHandlerPointerLock, isActive])

    // POINTER POINTER POINTER POINTER POINTER POINTER POINTER POINTER POINTER POINTER POINTER POINTER POINTER POINTER POINTER
    // POINTER POINTER POINTER POINTER POINTER POINTER POINTER POINTER POINTER POINTER POINTER POINTER POINTER POINTER POINTER
    // POINTER POINTER POINTER POINTER POINTER POINTER POINTER POINTER POINTER POINTER POINTER POINTER POINTER POINTER POINTER

    const moveHandlerPointer = React.useCallback((e: PointerEvent) => {
        if (startEvent.current) {
            absValue.current = [-startEvent.current.pageX + e.pageX, -startEvent.current.pageY + e.pageY]
            const eventOptions: [DragEvent, PointerEvent, TValue | undefined] = [
                getRotatedDragEvent(startEvent.current, absValue.current, e, angle),
                e,
                savedValue.current,
            ]
            onDrag?.(...eventOptions);
            onChange?.(...eventOptions)
        }
    }, [absValue, startEvent, onDrag, onChange, savedValue, angle]);

    const upHandlerPointer = React.useCallback((e) => {
        handleDeactivate();

        if (startEvent.current) {
            const eventOptions: [DragEvent, PointerEvent, TValue | undefined] = [
                getRotatedDragEvent(startEvent.current, absValue.current, e, angle, {isDragEnd: true}),
                e,
                savedValue.current,
            ]
            onDragEnd?.(...eventOptions);
            onChange?.(...eventOptions);
        }

        startEvent.current = null;
        // absValue.current = [0, 0];
        // savedValue.current = saveValue;

        onMouseUp?.(e)
    }, [onMouseUp, absValue, moveHandlerPointer, savedValue, angle, handleDeactivate, onDragEnd, onChange]);

    useEffect(() => {
        if (isActive === PointerMode.Default) {
            document.addEventListener('pointermove', moveHandlerPointer);
            document.addEventListener('pointerup', upHandlerPointer);
        }
        return () => {
            if (isActive === PointerMode.Default) {
                document.removeEventListener('pointermove', moveHandlerPointer);
                document.removeEventListener('pointerup', upHandlerPointer);
            }
        }
    }, [moveHandlerPointer, upHandlerPointer, isActive])

    const handlerDownPointer = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
        e.stopPropagation()
        handleActivate(PointerMode.Default);
        absValue.current = [0, 0];
        startEvent.current = e.nativeEvent;
        savedValue.current = saveValue;
        console.log(absValue.current, startEvent.current, savedValue.current)

        const eventOptions: [DragEvent, PointerEvent, TValue | undefined] = [
            getRotatedDragEvent(startEvent.current, absValue.current, e.nativeEvent, angle, {isDragStart: true}),
            e.nativeEvent,
            savedValue.current,
        ]

        onDragStart?.(...eventOptions);
        onChange?.(...eventOptions);

        onMouseDown?.(e);
    }, [handleActivate, moveHandlerPointer, upHandlerPointer, saveValue, onDragStart, onChange, onMouseDown, startEvent, savedValue, absValue])


    // -------


    const handlerDown = React.useCallback((e: React.PointerEvent<HTMLDivElement>) => {
        if (!pointerLock || e.pointerType === 'touch') {
            handlerDownPointer(e)
        } else {
            handlerDownPointerLock(e)
        }

    }, [pointerLock, handlerDownPointer, handlerDownPointerLock]);


    return (
        <div
            {...restProps}
            className={cn('drag-handler', {
                ['drag-handler-is-active']: isActive
            }, className)}
            style={style}
            ref={divRef}
            onPointerDown={handlerDown}

        >
            {children}
            <canvas
                ref={canvasRef}
            />
        </div>
    );
}

export const DragHandler = forwardRef<DragHandlerImperativeHandler, DragHandlerProps>(DragHandlerComponent) as <TValue>(
    props: DragHandlerProps<TValue> & { ref?: React.RefObject<DragHandlerImperativeHandler> }
) => ReturnType<typeof DragHandlerComponent>;

