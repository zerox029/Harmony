import Vex from 'vexflow';
import * as JZZ from 'jzz'
import { Midi } from "@tonaljs/tonal"

const VF = Vex.Flow;

// Create an SVG renderer and attach it to the DIV element named "vf".
const div = document.getElementById("vf")
const renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);

// Configure the rendering context.
renderer.resize(500, 500);
const context = renderer.getContext();
context.setFont("Arial", 10, "").setBackgroundFillStyle("#eed");

function renderGrandStaff() {
    // Create a stave of width 400 at position 10, 40 on the canvas.
    var topStaff = new Vex.Flow.Stave(20, 0, 200);
    var bottomStaff = new Vex.Flow.Stave(20, 100, 200);

    // Add a clef and time signature.
    topStaff.addClef('treble');
    bottomStaff.addClef('bass');

    var brace = new Vex.Flow.StaveConnector(topStaff, bottomStaff).setType(3); // 3 = brace
    var lineRight = new Vex.Flow.StaveConnector(topStaff, bottomStaff).setType(6);
    var lineLeft = new Vex.Flow.StaveConnector(topStaff, bottomStaff).setType(1);

    // Drawing
    topStaff.setContext(context).draw();
    bottomStaff.setContext(context).draw();

    brace.setContext(context).draw();
    lineRight.setContext(context).draw();
    lineLeft.setContext(context).draw();
}

renderGrandStaff();

var input = JZZ().openMidiIn();
var delay = JZZ.Widget({ _receive: function(msg) { console.log(Midi.midiToNoteName(msg[1])) }});
input.connect(delay);