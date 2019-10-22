/*const d0 = require('./req0.js')
    //const d1 = require('./req1.js')
import { G, A } from "./req2.js" //import specifier
import H from "./req1.js" // import default specifier
import * as J from "./req2.js"
import {NgModule} from "@angular/core"*/


// test/test.js

const d0 = require('./req0.js')
import * as J from "./req2.js" // import namespace specifier
import { NgModule } from "@angular/core"

let g = 3 + 9
let a = 90;
const b = "nnamdi";
const c = a * 5;

var arrFunc = () => {}

// var fish, french = 90