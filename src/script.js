import Vex from 'vexflow';
import * as JZZ from 'jzz'
import { Midi } from "@tonaljs/tonal"

const VF = Vex.Flow;

function setupRenderer() {
    // Create an SVG renderer and attach it to the DIV element named "vf".
    const div = document.getElementById("vf")
    const renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);
    
    // Configure the rendering context.
    renderer.resize(500, 500);
    const context = renderer.getContext();
    context.setFont("Arial", 20, "").setBackgroundFillStyle("#eed");

    return context;
}

function render(notes) {
    let staves = renderGrandStaff();
    renderNotes(staves, notes);
}

function renderGrandStaff() {
    context.rect(0, 0, 500, 500, { stroke: 'none', fill: 'white' });

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

function noteNameToVfName(name) {
    let characters = name.split("");

    switch(characters.length) {
        case 2:
            return `${characters[0].toLowerCase()}/${characters[1]}`
        case 3:
            return `${characters[0].toLowerCase()}${characters[1]}/${characters[2]}`
    }
}

function onMidiSignal(msg)
{
    let currentNote = noteNameToVfName(Midi.midiToNoteName(msg[1]));

    let notes = [];

    if(currentNote[1] !== "/")
        notes = [new VF.StaveNote({ clef: "treble", keys: [currentNote], duration: "q", align_center: true }).addAccidental(0, new VF.Accidental(currentNote[1]))];
    else 
        notes = [new VF.StaveNote({ clef: "treble", keys: [currentNote], duration: "q", align_center: true })];

    render(notes);
}

function setupMidi() {
    let input = JZZ().openMidiIn();
    let delay = JZZ.Widget({ _receive: function(msg) { onMidiSignal(msg) }});
    input.connect(delay);    
}

const context = setupRenderer();
renderGrandStaff(context);
setupMidi();