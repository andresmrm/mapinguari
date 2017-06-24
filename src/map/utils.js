/*
  Based on: http://www.redblobgames.com/grids/hexagons/
*/

import {random} from '../noiser'


// let directions = {
//     n: {x:1, y:-2},
//     ne: {x:2, y:-1},
//     se: {x:1, y:1},
//     s: {x:-1, y:2},
//     sw: {x:-2, y:1},
//     nw: {x:-1, y:-1},
// }

export var pointyDirections = {
    ne: {x:1, y:-1},
    e: {x:1, y:0},
    se: {x:0, y:1},
    sw: {x:-1, y:1},
    w: {x:-1, y:0},
    nw: {x:0, y:-1},
}

var pointyDirArray = []
Object.keys(pointyDirections).forEach(
    (key) => pointyDirArray.push(pointyDirections[key])
)


export function getRandomDirection() {
    return pointyDirArray[pointyDirArray.length * random() << 0]
}


export function createGroup(map, parent) {
    let group = map.game.add.group()
    if (parent) parent.add(group)
    return group
}


// Translate coords by direction.
// Direction can be a direction name (string) or
// an obj with direction values
export function translate(coords, direction) {
    let dir = null
    if (typeof direction === 'string' || direction instanceof String)
        dir = pointyDirections[direction]
    else
        dir = direction
    return {x: coords.x + dir.x, y: coords.y + dir.y}
}

// cube distance
export function cubeDistance(a, b) {
    return Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y), Math.abs(a.z - b.z))
}

// Calculates axial distance between two points.
// Without second argument, calculates distance to origin.
export function axialDistance(i, j=null) {
    let a = axialToCube(i)
    if (!j) return Math.max(Math.abs(a.x), Math.abs(a.y), Math.abs(a.z))

    let b = axialToCube(j)
    return Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y), Math.abs(a.z - b.z))
}

export function cubeToAxial(cubic) {
    return {x: cubic.x, y: cubic.z}
}

export function axialToCube(coords) {
    let x = coords.x,
        z = coords.y,
        y = -x-z
    return {x, y, z}
}

// cube round
export function cubeRound(cube) {
    let rx = Math.round(cube.x),
        ry = Math.round(cube.y),
        rz = Math.round(cube.z),
        x_diff = Math.abs(rx - cube.x),
        y_diff = Math.abs(ry - cube.y),
        z_diff = Math.abs(rz - cube.z)

    if (x_diff > y_diff && x_diff > z_diff) {
        rx = -ry-rz
    } else if (y_diff > z_diff) {
        ry = -rx-rz
    } else {
        rz = -rx-ry
    }

    return {x: rx, y: ry, z: rz}
}

export function invMatrix(m) {
    let det = m[0]*m[3]-m[1]*m[2]
    return [
        m[3]/det, -m[1]/det,
        -m[2]/det, m[0]/det
    ]
}

// Calls a function for each hex in N distance from center
export function forEachHexInDist(center, N, fn) {
    let {x:cx,y:cy,z:cz} = axialToCube(center)

    for (var dz=-N; dz <= N; dz++) {
        for (var dx=Math.max(-N, -dz-N); dx <= Math.min(N, -dz+N); dx++) {
            let dy = -dx-dz
            let cubic = {x: cx+dx, y: cy+dy, z: cz+dz}
            fn(cubeToAxial(cubic))
        }
    }
}


export function axialScale(coords, mult) {
    return {x:coords.x*mult, y:coords.y*mult}
}

export function axialAdd(a, b) {
    return {x:a.x+b.x, y:a.y+b.y}
}

export function axialEqual(a, b) {
    if(a.x==b.x && a.y==b.y) return true
    else return false
}


export function findNearest(center, maxRadius, testFn) {
    // test center
    if (testFn(center)) return center

    // test each ring, from inside to outside
    for (let ringRadius=1;ringRadius<maxRadius;ringRadius++) {

        let initialDir = getRandomDirection(),
            coord = axialAdd(center, axialScale(initialDir, ringRadius))

        // iterate each side of the ring
        for (let iDir=0; iDir < 6; iDir++) {
            // iterate along each hex that makes a side of the ring
            for (let i=0; i < ringRadius; i++) {
                if (testFn(coord)) return coord

                // Gets the right direction to walk along this side.
                // It should be 2 positions ahead in the directions array.
                // Also, it should be added by the side direction iterator (iDir).
                // The % is used to avoid indexes bigger than the array.
                let sideDir = pointyDirArray[(
                    pointyDirArray.indexOf(initialDir)+2+iDir
                )%pointyDirArray.length]

                coord = axialAdd(coord, sideDir)
            }
        }
    }
    return null
}


// // oddq_to_cube
// function pointyCubeToOffset(cube) {
//     let col = cube.x + (cube.z - (cube.z&1)) / 2,
//         row = cube.z
//     return {col, row}
// }

// // oddq_to_cube
// function pointyOffsetToCube(hex) {
//     let x = hex.col - (hex.row - (hex.row&1)) / 2,
//         z = hex.row,
//         y = -x-z
//     return {x, y, z}
// }

// // oddq_to_cube
// function flatCubeToOffset(cube) {
//     let col = cube.x,
//         row = cube.z + (cube.x - (cube.x&1)) / 2
//     return {col, row}
// }

// // oddq_to_cube
// function flatOffsetToCube(hex) {
//     let x = hex.col,
//         z = hex.row - (hex.col - (hex.col&1)) / 2,
//         y = -x-z
//     return {x, y, z}
// }
