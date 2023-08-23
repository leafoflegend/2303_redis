import { faker } from '@faker-js/faker';
import pg from 'pg';
const { Client } = pg;


export const client = new Client('postgres://localhost:5432/2303_redis');

export const setupTables = async () => {
    const client = await startDB();

    await client.query(`DROP TABLE IF EXISTS tasks`);

    await client.query(`
        CREATE TABLE IF NOT EXISTS tasks (
            name TEXT NOT NULL,
            description TEXT,
            complete BOOLEAN
        );
    `);

    const allTasks = new Array(1000)
        .fill('')
        .map(() => {
            return [
                faker.hacker.verb(),
                faker.hacker.noun(),
                false,
            ];
        })
        .map(([name, description, complete]) => `('${name}', '${description}', ${complete})`)
        .join(', ');

    await client.query(`
        INSERT INTO tasks (name, description, complete) 
        VALUES ${allTasks}
    `);

    return client;
};

export const startDB = async () => {
    await client.connect();

    return client;
};

export const getTasks = async () => {
    const { rows } = await client.query(`SELECT * FROM tasks`);

    return rows;
};
