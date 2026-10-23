#!/usr/bin/env node
import path from 'node:path';
import {ROOT, copyPackage} from './lib/plugin.mjs';
import {validatePlugin} from './validate-plugin.mjs';

try {
  const args = process.argv.slice(2);
  if (args.length !== 1) throw new Error('Usage: node scripts/package-plugin.mjs <new-output-directory>');
  const result = validatePlugin();
  const destination = path.resolve(args[0]);
  copyPackage(ROOT, destination);
  console.log(JSON.stringify({destination, ...result}, null, 2));
} catch (error) {
  console.error(`package-plugin: ${error.message}`);
  process.exitCode = 1;
}
