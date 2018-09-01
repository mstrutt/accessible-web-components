const chai = require('chai');
const jsDomGlobal = require('jsdom-global');
const sinon = require('sinon');

global.expect = chai.expect;
global.should = chai.should;
global.sinon = sinon;

jsDomGlobal(undefined, { pretendToBeVisual: true });
