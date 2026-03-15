const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';
const DIM = '\x1b[2m';

export const log = {
  info(msg: string) {
    console.log(`${CYAN}${BOLD}${msg}${RESET}`);
  },
  success(msg: string) {
    console.log(`${GREEN}  ✓ ${msg}${RESET}`);
  },
  warn(msg: string) {
    console.log(`${YELLOW}  ⚠ ${msg}${RESET}`);
  },
  error(msg: string) {
    console.error(`${RED}  ✗ ${msg}${RESET}`);
  },
  dim(msg: string) {
    console.log(`${DIM}${msg}${RESET}`);
  },
  step(msg: string) {
    console.log(`  ${msg}`);
  },
  tree(lines: string[]) {
    for (const line of lines) {
      console.log(`${DIM}  ${line}${RESET}`);
    }
  },
};
