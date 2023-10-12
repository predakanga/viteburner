import cac from 'cac';
import { logger } from './console';
import pkg from '../package.json';
import { ViteBurnerInlineConfig } from './types';
import { createServer } from 'vite';
import { viteburnerPlugin } from './plugins/viteburner';
import { viteExternalsPlugin } from 'vite-plugin-externals'
import react from '@vitejs/plugin-react';

const cli = cac('viteburner');

cli
  .command('', 'start dev server')
  .alias('serve')
  .alias('dev')
  .option('--cwd <cwd>', 'Working directory')
  .option('--port <port>', 'Port to listen on')
  .action(startDev);

cli.help();

cli.version(pkg.version);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function startDev(options: any) {
  const cwd = options.cwd;
  const port = options.port;
  const resolveInlineConfig: ViteBurnerInlineConfig = {
    ...(cwd && { cwd }),
    ...(port && { port }),
  };

  logger.info('version', pkg.version);

  // create server
  logger.info('vite', 'creating dev server...');
  createServer({
    ...(cwd && { root: cwd }),
    viteburner: resolveInlineConfig,
    plugins: [
      react({jsxRuntime: 'classic'}),
      viteExternalsPlugin({
        react: 'React',
      }),
      viteburnerPlugin(resolveInlineConfig)],
  });
}

export async function main() {
  cli.parse();
}
