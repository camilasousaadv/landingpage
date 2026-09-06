/* ============================================================================
   build.js
   Monta as paginas HTML finais a partir de um template + parciais.
   Node >= 14, sem dependencias:   node build.js

   Sintaxe do template:   <!--#include caminho/relativo.html -->

   O site entregue e 100% estatico: este script existe apenas para que header,
   footer e pop-up tenham uma unica fonte de verdade (components/) quando novas
   paginas forem criadas. Nao e necessario para rodar o site.
   ============================================================================ */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;

const PAGES = [
  { template: 'index.template.html', output: 'index.html' },
];

const INCLUDE = /^([ \t]*)<!--#include\s+([^\s]+)\s*-->[ \t]*$/gm;

function build(templateFile, outputFile) {
  const templatePath = path.join(ROOT, templateFile);
  let html = fs.readFileSync(templatePath, 'utf8');

  html = html.replace(INCLUDE, (match, indent, file) => {
    const partialPath = path.join(ROOT, file);
    if (!fs.existsSync(partialPath)) {
      throw new Error(`Parcial nao encontrada: ${file} (em ${templateFile})`);
    }
    return fs
      .readFileSync(partialPath, 'utf8')
      .replace(/\s+$/, '')
      .split('\n')
      .map((line) => (line ? indent + line : line))
      .join('\n');
  });

  fs.writeFileSync(path.join(ROOT, outputFile), html);
  console.log(`  ${outputFile}  (${html.length} bytes)`);
}

console.log('Montando paginas:');
PAGES.forEach((page) => build(page.template, page.output));
console.log('Concluido.');
