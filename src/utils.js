export const centerGameObjects = (objects) => {
  objects.forEach(function (object) {
    object.anchor.setTo(0.5)
  })
}

export function keyCodeToStr(keyCode) {
    return String.fromCharCode(keyCode)
}
