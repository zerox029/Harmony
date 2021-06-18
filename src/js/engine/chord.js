import { Chord } from "@tonaljs/tonal"
import { generateNote } from '../util'

export default class ChordMode {
  generateQuestion()
  {
    let possibleQualifications = ["M", 'm', 'dim', 'aug', '7', 'maj7', 'min7', 'dim7'];
    let qualification = possibleQualifications[Math.floor(Math.random() * possibleQualifications.length)];
  
    let note = generateNote();
    let completeChord = note.concat(qualification);

    return Chord.get(completeChord)["name"]
  }

  validateAnswer(expected, actual)
  {
    let expectedChord = Chord.get(expected);

    actual = actual.map(x => x.substring(0, x.length - 2))
    let actualChord = Chord.detect(actual);

    return actualChord.includes(expectedChord["symbol"])
  }
}