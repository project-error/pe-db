import 'reflect-metadata';
import { Server } from './Server';
import { container } from 'tsyringe';
import { registerCommands, registerTestCommands } from './bridge/Commands';
import { registerExports } from './bridge/Exports';

const server = container.resolve(Server);

server.start();

on('onResourceStart', (resName: string) => {
  if (resName !== GetCurrentResourceName()) return;
  server.logger.info('PE-DB has fully started!');
  registerCommands();
  registerTestCommands();
  registerExports();
});
