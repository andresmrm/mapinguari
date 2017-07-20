let audioMult = 1

export function setListenerPos(context, pos) {
    // The +1 avoids 0 distance. It hurts the ears.
    context.listener.setPosition(pos[0] * audioMult, pos[2] + 1, - pos[1] * audioMult)
}

export function setAudioOri(context, direction) {
    var [x, y, z] = direction
    context.listener.setOrientation(x, z, -y, 0, 1, 0)
}

export function setPannerPos(panner, pos) {
    var [x, y, z] = pos
    panner.setPosition(x * audioMult, z * audioMult, - y * audioMult)
}

export function addSound(game, position, soundName, soundGain=1) {
    var audio = game.add.audio(soundName)
    var panner = game.sound.context.createPanner()

    panner.panningModel = 'HRTF'
    panner.distanceModel = 'exponential'
    panner.refDistance = 1
    panner.maxDistance = 4
    panner.rolloffFactor = 4

    audio.gainNode.disconnect()
    audio.gainNode.connect(panner)

    var volume = game.sound.context.createGain()
    panner.connect(volume)
    volume.connect(game.sound.masterGain)
    volume.gain.value = soundGain

    setPannerPos(panner, position)
    audio.loop = true
    audio.play()

    return {audio, panner, volume}
}
