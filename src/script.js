import Vex from 'vexflow';

var VF = Vex.Flow;

var div = document.getElementById("vf")
var renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);
renderer.resize(500, 500);

var context = renderer.getContext();

var stave = new VF.Stave(10, 40, 400);
stave.addClef("treble");

stave.setContext(context).draw();