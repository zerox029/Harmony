export function noteNameToVfName(name) {
  let characters = name.split("");

  switch(characters.length) {
      case 2:
          return `${characters[0].toLowerCase()}/${characters[1]}`
      case 3:
          return `${characters[0].toLowerCase()}${characters[1]}/${characters[2]}`
  }
}