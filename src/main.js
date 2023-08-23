import express from 'express';
import { setupTables, getTasks } from './db.js';
import { startRedis } from './redis.js';

const app = express();

const PORT = 3000;
let redisClient;

app.get('/tasks', async (req, res, next) => {
    console.time('Get Tasks');
    let tasks;

    const tasksInRedis = await redisClient.get('tasks');

    if (!tasksInRedis) {
        console.log('Fetch From DB');
        tasks = await getTasks();
        await redisClient.set('tasks', JSON.stringify(tasks));
    } else {
        console.log('Fetch From Redis');
        tasks = JSON.parse(tasksInRedis);
    }

    res.send({
        tasks,
        success: true,
    });
    console.timeEnd('Get Tasks');
});

const startApp = async () => {
    const client = await setupTables();
    redisClient = await startRedis();

    app.listen(PORT);
};

startApp();
