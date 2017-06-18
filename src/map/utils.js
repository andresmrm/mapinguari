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


export function getRandomDirection() {
    let keys = Object.keys(pointyDirections)
    return keys[ keys.length * random() << 0]
}


export function createGroup(map, parent) {
    let group = map.game.add.group()
    if (parent) parent.add(group)
    return group
}


export function translate(coords, direction) {
    let dir = pointyDirections[direction]
    return {x: coords.x + dir.x, y: coords.y + dir.y}
    // return translateCoords(coords, dir)
}

// export function translateCoords(coords, dir) {
//     return {x: coords.x + dir.x, y: coords.y + dir.y}
// }



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

// cube distance
export function cubeDistance(a, b) {
    return Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y), Math.abs(a.z - b.z))
}

export function axialDistance(i, j) {
    let a = axialToCube(i),
        b = axialToCube(j)
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
