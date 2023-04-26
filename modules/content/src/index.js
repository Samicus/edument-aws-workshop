const express = require('express');
const env = require('./env');
const routes = require('./routes');
const fault = require('./middleware');
// ...

const app = express();
app.use(express.json());
app.use(fault);
app.use('/', routes);

// ...

const server = app.listen(env.port, () => {
    console.log(`Listening on port ${env.port}`)
});

//Graceful shutdown
process.on('SIGTERM', () => {
    console.log('The service is about to shut down!');

    // Finish any outstanding requests, then...
    server.close(
        () => {
            process.exit(0);
        });
});