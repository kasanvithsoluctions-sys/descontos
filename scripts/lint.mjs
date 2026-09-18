/** Dependency-free project lint using the installed TypeScript parser. */
import ts from 'typescript';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

function sourceFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? sourceFiles(path) : /\.tsx?$/.test(path) ? [path] : [];
  });
}
const paths = [...sourceFiles('src'), ...sourceFiles('tests')];
const errors = [];
for (const path of paths) {
  const source = ts.createSourceFile(path, readFileSync(path, 'utf8'), ts.ScriptTarget.Latest, true);
  function report(node, message) {
    const { line, character } = source.getLineAndCharacterOfPosition(node.getStart(source));
    errors.push(`${path}:${line + 1}:${character + 1} ${message}`);
  }
  function visit(node) {
    if (node.kind === ts.SyntaxKind.AnyKeyword) report(node, 'Use a precise type instead of any.');
    if (ts.isDebuggerStatement(node)) report(node, 'Remove debugger statements.');
    if (ts.isVariableDeclarationList(node) && !(node.flags & (ts.NodeFlags.Const | ts.NodeFlags.Let))) report(node, 'Use const or let instead of var.');
    if (ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression) && node.expression.expression.getText(source) === 'console') report(node, 'Do not log user data from application code.');
    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
      const tag = node.tagName.getText(source);
      const attributes = node.attributes.properties.filter(ts.isJsxAttribute);
      if (tag === 'img' && !attributes.some(attribute => attribute.name.getText(source) === 'alt')) report(node, 'Images require an alt attribute.');
      const target = attributes.find(attribute => attribute.name.getText(source) === 'target');
      if (target?.initializer && ts.isStringLiteral(target.initializer) && target.initializer.text === '_blank') {
        const rel = attributes.find(attribute => attribute.name.getText(source) === 'rel');
        if (!rel?.initializer || !ts.isStringLiteral(rel.initializer) || !rel.initializer.text.includes('noopener')) report(node, 'External windows require rel="noopener".');
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(source);
  if (/src\/app\/.*page\.tsx$/.test(path) && /^['"]use client['"]/.test(source.text)) errors.push(`${path}: Keep page content in a Server Component.`);
}
const config = ts.readConfigFile('tsconfig.json', ts.sys.readFile);
if (config.error) throw new Error(ts.flattenDiagnosticMessageText(config.error.messageText, '\n'));
const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, '.');
const program = ts.createProgram(paths, { ...parsed.options, noUnusedLocals: true, noUnusedParameters: true, noFallthroughCasesInSwitch: true, noEmit: true, incremental: false });
const diagnostics = ts.getPreEmitDiagnostics(program);
for (const diagnostic of diagnostics) errors.push(ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'));
if (errors.length) {
  process.stderr.write(errors.join('\n') + '\n');
  process.exitCode = 1;
} else {
  process.stdout.write(`Lint passed: ${paths.length} files; types, unused symbols and source rules checked.\n`);
}
