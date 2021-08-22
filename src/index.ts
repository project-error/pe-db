import 'reflect-metadata';
import { Server } from './Server';
import { container } from 'tsyringe';

const server = container.resolve(Server);
