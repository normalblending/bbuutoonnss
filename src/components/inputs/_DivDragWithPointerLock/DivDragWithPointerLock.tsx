import React from "react";
import {DragWithPointerLockEvent} from "./types";
import cn from 'classnames';
import './DivDragWithPointerLock.css'
import {DragEvent} from "../DivDragHandler";

export interface DivDragWithPointerLockProps<TValue> {
    className?: string
    children?: React.ReactNode
    saveValue?: TValue
    angle?: number
    onDrag: (event: DragWithPointerLockEvent, e: MouseEvent, savedValue?: TValue) => void
    onDragStart?: (event: DragEvent, e: MouseEvent, savedValue?: TValue) => void
    onDragEnd?: (event: DragEvent, e: MouseEvent, savedValue?: TValue) => void
    style?: object
}

export class DivDragWithPointerLock<TValue = any> extends React.Component<DivDragWithPointerLockProps<TValue>> {

    canvasRef: React.RefObject<HTMLCanvasElement>;

    constructor(props: DivDragWithPointerLockProps<TValue>) {
        super(props);

        this.canvasRef = React.createRef();
    }

    absX: number = 0;
    absY: number = 0;

    savedValue: TValue | undefined;

    mouseDownHandler = (e: any) => {
        this.canvasRef.current?.requestPointerLock();

        this.savedValue = this.props.saveValue;

        document.addEventListener('pointerup', this.mouseUpHandler);
        document.addEventListener('pointermove', this.mouseMoveHandler);
    }

    mouseMoveHandler = (e: MouseEvent) => {
        const {saveValue} = this.props;

        this.absX += e.movementX;
        this.absY += e.movementY;

        this.props.onDrag?.({
            x: this.absX,
            y: this.absY,
        }, e, this.savedValue);
    }

    mouseUpHandler = (e: any) => {

        document.exitPointerLock();
        document.removeEventListener('pointerup', this.mouseUpHandler);
        document.removeEventListener('pointermove', this.mouseMoveHandler);

        this.absX = 0;
        this.absY = 0;
        this.savedValue = undefined;
    }

    render() {
        const {
            className,
            children,
        } = this.props;

        return (
            <div
                className={cn('divDragWithPointerLock', className)}
                onMouseDown={this.mouseDownHandler}
            >
                {children}
                <canvas
                    ref={this.canvasRef}
                />
            </div>
        );
    }
}
