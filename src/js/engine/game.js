import ChordMode from './chord'

const gamemodes = [new ChordMode]

export function newQuestion()
{
  let questionName = gamemodes[0].generateQuestion();
  document.querySelector("#question-name").textContent = questionName;
}

export function validateQuestion(answer)
{
  let expected = document.querySelector("#question-name").textContent;

  if (gamemodes[0].validateAnswer(expected, answer))
  {
    newQuestion();
  }
}