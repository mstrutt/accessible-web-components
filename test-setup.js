const jsDomGlobal = require('jsdom-global');
const chai = require('chai');

global.expect = chai.expect;
global.should = chai.should;

jsDomGlobal(undefined, { pretendToBeVisual: true });
