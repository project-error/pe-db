import mysql, { Pool } from 'mysql2/promise';
import { ConnectionStringParser } from 'connection-string-parser';

const DEFAULT_HOST = 'localhost';
const DEFAULT_USER = 'root';
const DEFAULT_PORT = 3306;

interface Map {
  [key: string]: string;
}

/**
 * parse the connection string from the format server=127.0.0.1;database=es_extended;userid=user;password=pass
 * @param connectionString - mysql_connection_string value
 */
function parseSemiColonFormat(connectionString: string): Map {
  const parts = connectionString.split(';');
  if (parts.length === 1) {
    throw new Error(
      `Connection string ${connectionString} is in the incorrect format. Please follow the README.`
    );
  }

  return parts.reduce((connectionInfo: Map, part) => {
    const [key, value] = part.split('=');
    connectionInfo[key] = value;
    return connectionInfo;
  }, {});
}

/**
 * allowed variable names: host | server | data source | datasource | addr | address
 * @param config - database config variables parsed from mysql_connection_string
 */
function getServerHost(config: Map): string {
  return (
    config.host ||
    config.server ||
    config['data source'] ||
    config.datasource ||
    config.addr ||
    config.address ||
    DEFAULT_HOST
  );
}

/**
 * allowed variable names: user | user id | userid | user name | username | uid
 * @param config - database config variables parsed from mysql_connection_string
 */
function getUserId(config: Map): string {
  return (
    config.user ||
    config['user id'] ||
    config.userid ||
    config['user name'] ||
    config.username ||
    config.uid ||
    DEFAULT_USER
  );
}

/**
 * Note: We are allowing no password as many FiveM servers love to not use one for an ungodly reason.
 * allowed variable names: password | pwd
 * @param config - database config variables parsed from mysql_connection_string
 */
function getPassword(config: Map): string | undefined {
  const password = config.password || config.pwd;
  if (!password) return undefined;
  return password;
}

export function generateConnectionPool(connectionStr: string): Pool {
  if (connectionStr.includes('database=')) {
    // This is checking for this format:
    // set mysql_connection_string "server=127.0.0.1;database=es_extended;userid=user;password=pass"
    const config = parseSemiColonFormat(connectionStr);
    return mysql.createPool({
      host: getServerHost(config),
      user: getUserId(config),
      port: config.port ? parseInt(config.port) : DEFAULT_PORT,
      password: getPassword(config),
      database: config.database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      namedPlaceholders: true,
    });
  } else {
    // This is checking for this format:
    // set mysql_connection_string "mysql://root:pass@127.0.0.1/es_extended?charset=utf8mb4"
    const connectionStringParser = new ConnectionStringParser({
      scheme: 'mysql',
      hosts: [],
    });
    const connectionOjbect = connectionStringParser.parse(connectionStr);

    return mysql.createPool({
      host: connectionOjbect.hosts[0].host,
      user: connectionOjbect.username,
      password: connectionOjbect.password,
      database: connectionOjbect.endpoint,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      namedPlaceholders: true,
    });
  }
}
