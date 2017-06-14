/*
  Based on: http://www.redblobgames.com/grids/hexagons/
  */

import Phaser from 'phaser-ce'
import {getNoise} from './noiser'


function over(tile) {
    tile.alpha = 0.5
    window.overCoords = tile.coords
}
function out(image) {
    image.alpha = 1
}
function clicked(tile) {
    console.log(tile.x, tile.y)
    tile.map.zoomInTile(tile)
}

function toCube(col, row) {
    let x = col - (row + (row&1)) / 2,
        z = row,
        y = x+z
    return {x, y, z}
}

function cubeToAxial(cubic, rings) {
    // let x = cubic.x - 1,
    //     y = cubic.z - rings + 1
    let x = cubic.x,
        y = cubic.z
    return {x, y}
}

// cube round
function cubeRound(cube) {
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

// function toSquare(x, z) {
//     return {x: x + (z + (z&1)) / 2,
//             y: z}
// }

function insideHexagon(cubic, rings) {
    return true
    let c = Math.ceil(rings/2),
        f = Math.floor(rings/2)
    return cubic.y > c-2 && // NE
        cubic.x > -f-1 && // SE
        cubic.x < rings+c-1 && // NW
        cubic.y < 2*rings+c-2 // SW
}

// function insideHexagonInv(cubic, rings) {
//     let c = Math.ceil(rings/2),
//         f = Math.floor(rings/2)
//     return cubic.y > c-2 && // NE
//     cubic.x > -f-1-rings && // SE
//     cubic.x < c+rings && // NW
//     cubic.y < 3*rings+c-2 // SW
// }

function insideOctogon(cubic, rings) {
    let c = Math.ceil(rings/2),
        f = Math.floor(rings/2)
    return cubic.x < rings+c-1 && // NW
    cubic.y < 3*rings+c-2 && // SW
    cubic.x > -rings-f-1 && // SE
    cubic.y > c-2 // NE
}


export class Map {
    constructor (game) {
        this.game = game

        this.tileSpriteWidth = 32
        this.tileWidth = this.tileSpriteWidth

        this.tileSpriteHeight = 48
        this.tileCenterHeight = 31 // from top to the center
        this.tileHeight = 28
        this.tileHeightVariationPerRow = 22

        this.rings = 3

        this.mapTopOffset = 0
        this.mapLeftOffset = 0
        this.mapTopOffset = this.rings*this.tileHeightVariationPerRow
        this.mapLeftOffset = this.rings*this.tileWidth

        this.rootGroup = this.game.add.group()
        this.rootGroup.x = this.mapLeftOffset
        this.rootGroup.y = this.mapTopOffset
        this.farMapGroup = this.createGroup()
        this.unitsGroup = this.createGroup()

        // Hexagon
        this.rows = this.rings*2-1
        this.columns = 2*this.rings-1

        // Octogon
        // this.rows = 4*this.rings-1
        // this.columns = 2*this.rings-1

        // HexagonInv
        // this.rows = this.rings*5-1
        // this.columns = 3*this.rings-1
    }

    createGroup() {
        let group = this.game.add.group()
        this.rootGroup.add(group)
        return group
    }

    addUnit(unit) {
        this.unitsGroup.add(unit.sprite)
    }

    createHeightmap() {
        let heightmapWidth = (this.columns+1)*this.tileWidth,
            heightmapHeight = (this.rows+1)*this.tileHeightVariationPerRow

        this.heightmap = this.game.make.bitmapData(heightmapWidth, heightmapHeight)
        for (var x = 0; x < heightmapWidth; x++) {
            for (var y = 0; y < heightmapHeight; y++) {
                let noise = getNoise(x-this.mapLeftOffset, y-this.mapTopOffset)
                let color = 'green'
                if (noise > .3) color = 'rgb(0,100,0)'
                if (noise > .6) color = 'rgb(0,50,0)'
                if (noise > .8) color = 'rgb(50,50,50)'
                if (noise > .9) color = 'white'
                this.heightmap.rect(x, y, 1, 1, color)
            }
        }
        this.heightmapSprite = this.game.add.sprite(0, 0, this.heightmap)
        this.heightmapSprite.alpha = 0.3
        this.heightmapSprite.z = 10
    }

    hideHeightmap() {
        this.heightmapSprite.kill()
    }

    showHeightmap() {
        this.heightmapSprite.revive()
    }

    toggleHeighmap() {
        if (this.heightmapSprite.alive) this.hideHeightmap()
        else this.showHeightmap()
    }

    generate () {
        // this.createTiles(this.farMapGroup, insideOctogon)
        this.createTiles(this.farMapGroup, insideHexagon)
        this.createHeightmap()
        // this.hideHeightmap()
    }

    // receives axial coords and get the right tile from the group array
    getTile(group, x, y) {
        return group.getAt(
            x + y*(4*this.rings-Math.abs(y)-1)/2 + Math.floor(group.length/2)
        )
    }

    // hex to pixel
    mapToScreenCoords(coords) {
        let x = this.tileWidth * (coords.x + coords.y/2),
            y = this.tileHeightVariationPerRow * coords.y
        return {x, y}
    }

    // pixel to hex
    screenToMapCoords(x, y) {
        let q = (x * sqrt(3)/3 - y / 3) / size,
            r = y * 2/3 / size
        // TODO: cubeToAxial está transladando e aqui não devia
        return cubeToAxial(cubeRound(axialToCube(q, r)))
    }

    createTile(group, coords, noiseParams, zoomable) {
        let {x, y} = this.mapToScreenCoords(coords)

        // let noise = getNoise(this.tileWidth/2+x, this.tileWidth+y, noiseParams)
        let noise = getNoise(x, y, noiseParams)

        let tile = group.create(x, y, 'tiles')
        tile.anchor.x = 0.5
        tile.anchor.y = this.tileCenterHeight / this.tileSpriteHeight
        tile.coords = coords
        tile.map = this
        tile.frame = 0

        // let c = toCube(x,y)
        // if (c.x==0) {
        //     noise = 1
        //     let m = group.create(x,y, 'mushroom')
        //     m.scale.setTo(0.05, 0.05)
        //     m.anchor.x = .5
        //     m.anchor.y = .5
        // }

        if (noise > .3) tile.frame = 1
        if (noise > .6) tile.frame = 2
        if (noise > .8) tile.frame = 3
        if (noise > .9) tile.frame = 3

        tile.inputEnabled = true
        tile.input.useHandCursor = true
        tile.input.pixelPerfectOver = true
        tile.input.pixelPerfectClick = true
        tile.events.onInputOver.add(over, this)
        tile.events.onInputOut.add(out, this)
        if (zoomable) tile.events.onInputUp.add(clicked, this)

        return tile
    }

    createTiles(group, check_f, noiseParams=null, zoomable=true) {
        // // iterate rows
        // for (var r = 0; r < this.rows; r++) {
        //     // iterate columns
        //     for (var q = 0; q < this.columns; q++) {
        //         let cubic = toCube(q, r)
        //         if (check_f(cubic, this.rings)) {
        //             this.createTile(
        //                 group,
        //                 cubeToAxial(cubic, this.rings),
        //                 noiseParams,
        //                 zoomable
        //             )
        //         }
        //     }
        // }
        let N = this.rings-1,
            cx = 0,
            cy = 0,
            cz = 0
        for (var dx=-N; dx <= N; dx++) {
            for (var dy=Math.max(-N, -dx-N); dy <= Math.min(N, -dx+N); dy++) {
                let dz = -dx-dy
                // results.append(cube_add(center, Cube(dx, dy, dz)))
                console.log(dx, dy, dz)
                let cubic = {x: cx+dx, y: cy+dy, z: cz+dz}
                this.createTile(
                    group,
                    cubeToAxial(cubic, this.rings),
                    noiseParams,
                    zoomable
                )
            }
        }
    }

    zoomInXY(x, y) {
        this.zoomInTile(this.getTile(this.farMapGroup, x, y))
    }

    zoomInTile(tile) {
        // this.farMapGroup.visible = false
        this.farMapGroup.killAll()
        if (this.zoomGroup) {
            this.zoomGroup.destroy()
        }
        this.zoomGroup = this.createGroup()
        this.zoomGroup.z = 1
        this.zoomedCoords = tile.coords
        this.rootGroup.sort('z', Phaser.Group.SORT_ASCENDING)
        this.createTiles(
            this.zoomGroup,
            insideHexagon,
            {
                x: tile.x-this.tileWidth/2,
                y: tile.y-this.tileHeight/2,
                mx: this.rings,
                my: this.rings
            },
            false
        )
    }

    zoomOut() {
        // this.farMapGroup.visible = true
        this.farMapGroup.reviveAll()
        if (this.zoomGroup) {
            this.zoomGroup.destroy()
            this.zoomGroup = null
        }
        this.zoomedCoords = null
    }

    translate(coords, direction) {
        let directions = {
            ne: {x:1, y:-1},
            e: {x:1, y:0},
            se: {x:0, y:1},
            sw: {x:-1, y:1},
            w: {x:-1, y:0},
            nw: {x:0, y:-1},
        }
        let dir = directions[direction]
        return {x: coords.x + dir.x, y: coords.y + dir.y}
    }
}
