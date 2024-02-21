export function rotate(cx: number, cy: number, x: number, y: number, angle: number) {
    const radians = Math.PI * angle / 180,
        cos = Math.cos(radians),
        sin = Math.sin(radians),
        nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
        ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
    return {x: nx, y: ny};
}

export function rotateArray([cx, cy]: [number, number], [x, y]: [number, number], angle: number) {
    const radians = Math.PI * angle / 180,
        cos = Math.cos(radians),
        sin = Math.sin(radians),
        nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
        ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
    return [nx, ny];
}