#!/usr/bin/env node

const fs = require('fs');
const { promisify } = require('util');
const glob = require('glob');

const pattern = new RegExp(
  'invariant\\([\\s\\S]{0,20}' +
  '(hostContext|type)\\.isInAParentText,[\\s\\S]{0,20}' +
  '"Text strings must be rendered within a <Text> component\\."[\\s\\S]{0,20}' +
  '\\);'
);

const patchFile = async (file) => {
  const content = (await promisify(fs.readFile)(file)).toString();
  const patched = content.replace(pattern, '');

  await promisify(fs.writeFile)(file, patched);
};

const patchAll = async () => {
  const files = await promisify(glob)('node_modules/react-native/Libraries/Renderer/oss/*');

  await Promise.all(files.map(patchFile));
};

patchAll();
