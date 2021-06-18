export function noteNameToVfName(name) {
  let characters = name.split("");

  switch(characters.length) {
      case 2:
          return `${characters[0].toLowerCase()}/${characters[1]}`
      case 3:
          return `${characters[0].toLowerCase()}${characters[1]}/${characters[2]}`
  }
}

export function generateNote()
{
  let possibleNotes = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  let possibleAlterations = ['', '#', "b"];

  let note = possibleNotes[Math.floor(Math.random() * possibleNotes.length)];
  let alteration = possibleAlterations[Math.floor(Math.random() * possibleAlterations.length)];
  let completeNote = note.concat(alteration);

  return completeNote;
}