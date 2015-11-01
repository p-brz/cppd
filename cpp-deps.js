#!/usr/bin/env node

var program = require('commander');
var env = require('cli-env')();
var child = require('child_process');

program
//  .version('0.0.1')
  //.option('inclu [query]', 'search with optional query')
  //.command('list', 'list packages installed', {isDefault: true})
  .parse(process.argv);
  
  

  

process.env.ABC = "abcd"

env.set('HELLO', 'WORLD');

child.execSync("export HELLO=WORLD2", {stdio:[0,1,2]});
