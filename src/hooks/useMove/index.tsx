import React from 'react'
import { Vector, createVector } from '../../utils/geometry/vector'

type UseMoveHandler = (vec: Vector, e: MouseEvent) => void;

export const useMove = (
    onMove: UseMoveHandler,
    onUp?: UseMoveHandler,
) => {
    const [startPoint, setStartPoint] = React.useState<Vector | null>(null);

    React.useEffect(() => {
        if (startPoint) {

            const moveHandler = (e) => {
                onMove(createVector(e.pageX - startPoint.x, e.pageY - startPoint.y), e);
            };

            const upHandler = (e) => {
                onUp?.(createVector(e.pageX - startPoint.x, e.pageY - startPoint.y), e);
                setStartPoint(null);
                document.removeEventListener('mouseup', upHandler);
            };

            document.addEventListener('mousemove', moveHandler);
            document.addEventListener('mouseup', upHandler);
            return () => {
                document.removeEventListener('mousemove', moveHandler);
            };
        }
    }, [startPoint, onMove, onUp]);

    const startMove = React.useCallback((e) => {
        setStartPoint({x: e.pageX, y: e.pageY});
    }, []);

    return startMove;
};