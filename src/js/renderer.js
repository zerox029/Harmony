import Vex from 'vexflow';
import * as JZZ from 'jzz'
import { Midi } from "@tonaljs/tonal"
import * as Util from './util'
import * as Game from './engine/game'
import "../style.css"

const VF = Vex.Flow;
let heldNotes = [];

function setupRenderer() {
    // Create an SVG renderer and attach it to the DIV element named "vf".
    const div = document.getElementById("vf")
    const renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);
    
    // Configure the rendering context.
    renderer.resize(230, 230);
    const context = renderer.getContext();
    context.setFont("Arial", 20, "").setBackgroundFillStyle("white");

    return context;
}

function render(notes) {
    let staves = renderGrandStaff();
    renderNotes(staves, notes);
}

function renderGrandStaff() {
    context.rect(0, 0, 230, 230, { stroke: 'none', fill: 'white' });

    let topStaff = new Vex.Flow.Stave(20, 0, 200);
    topStaff.addClef('treble');
    let bottomStaff = new Vex.Flow.Stave(20, 100, 200);
    bottomStaff.addClef('bass');

    let brace = new Vex.Flow.StaveConnector(topStaff, bottomStaff).setType(3);
    let lineRight = new Vex.Flow.StaveConnector(topStaff, bottomStaff).setType(6);
    let lineLeft = new Vex.Flow.StaveConnector(topStaff, bottomStaff).setType(1);

    // Drawing
    topStaff.setContext(context).draw();
    bottomStaff.setContext(context).draw();

    brace.setContext(context).draw();
    lineRight.setContext(context).draw();
    lineLeft.setContext(context).draw();

    return [topStaff, bottomStaff];
}

function renderNotes(staves, notes) {
    var voice = new VF.Voice({num_beats: 1,  beat_value: 4});
    voice.addTickables(notes);

    var formatter = new VF.Formatter().joinVoices([voice]).format([voice], 130);

    voice.draw(context, staves[0])
}

function onNotePress(noteId) 
{
    heldNotes.push(Util.noteNameToVfName(Midi.midiToNoteName(noteId)));

    Game.validateQuestion(heldNotes)
    renderHeldNotes();
}

function onNoteRelease(noteId) 
{
    for(let i = 0; i < heldNotes.length; i++)
    {
        if(heldNotes[i] === Util.noteNameToVfName(Midi.midiToNoteName(noteId)))
        {
            heldNotes.splice(i, 1);
        }
    }

    Game.validateQuestion(heldNotes)
    renderHeldNotes();
}

function renderHeldNotes()
{
    let notes = new VF.StaveNote({ clef: "treble", keys: heldNotes, duration: "q", align_center: true });
    render([notes]);
}

function onMidiSignal(msg)
{
    if(msg.data.length == 1)
        return;

    if(msg.data[2] === 0) //For launchpad
        onNoteRelease(msg.data[1]);
    else if(msg.data[0] === 144)
        onNotePress(msg.data[1]);
    else
        onNoteRelease(msg.data[1]);
}

function setupMidi(midiAccess) {
    for (var input of midiAccess.inputs.values())
        input.onmidimessage = onMidiSignal;
}

function onMIDIFailure() {
    console.log('Could not access your MIDI devices.');
}

const context = setupRenderer();
renderGrandStaff(context);
navigator.requestMIDIAccess().then(setupMidi, onMIDIFailure);

Game.newQuestion();