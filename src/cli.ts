import { parseArgs } from 'util';
import { init } from './commands/init';
import { log } from './utils/logger';

const pkg = require('../package.json');

function printHelp() {
  log.info(`cccdev v${pkg.version}`);
  console.log();
  console.log('Usage: cccdev <command> [options]');
  console.log();
  console.log('Commands:');
  console.log('  init          Install devtools preview template into a Cocos Creator project');
  console.log();
  console.log('Options:');
  console.log('  --help, -h    Show this help message');
  console.log('  --version     Show version');
  console.log('  --force       Overwrite existing preview-template without prompting');
}

export async function run() {
  const { values, positionals } = parseArgs({
    args: Bun.argv.slice(2),
    options: {
      help: { type: 'boolean', short: 'h', default: false },
      version: { type: 'boolean', default: false },
      force: { type: 'boolean', default: false },
    },
    allowPositionals: true,
    strict: false,
  });

  if (values.version) {
    console.log(pkg.version);
    return;
  }

  if (values.help || positionals.length === 0) {
    printHelp();
    return;
  }

  const command = positionals[0];

  switch (command) {
    case 'init':
      await init({ force: !!values.force });
      break;
    default:
      log.error(`Unknown command: ${command}`);
      printHelp();
      process.exit(1);
  }
}
