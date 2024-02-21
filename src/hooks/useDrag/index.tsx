import { Vector, vectorAdd, vectorMul } from '../../utils/geometry/vector'
import React from 'react'
import { useMove } from '../useMove'

type UseDragHandler = (vec: Vector, e: MouseEvent) => void;
type UseDragUpHandler = (e: MouseEvent) => void;

export const useDrag = (
    onChange: UseDragHandler,
    scale: number = 1,
    onUp?: UseDragUpHandler,
): [boolean, (e: MouseEvent, startValue: Vector) => void] => {
    const [startValue, setStartValue] = React.useState<Vector | null>(null)

    const [isDragging, setIsDragging] = React.useState<boolean>(false)

    const movePointHandler = React.useCallback((vec: Vector, e: MouseEvent) => {
        startValue && onChange(vectorAdd(startValue, vectorMul(vec, 1 / scale)), e)
    }, [startValue, onChange, scale])

    const upPointHandler = React.useCallback((e) => {
        setStartValue(null)
        setIsDragging(false)
        onUp?.(e)
    }, [onUp])

    const startMove = useMove(
        movePointHandler,
        upPointHandler,
    )

    const startDragPoint = React.useCallback((e, value: Vector) => {
        startMove(e)

        setStartValue(value)
        setIsDragging(true)
    }, [startMove])

    return [isDragging, startDragPoint]
}