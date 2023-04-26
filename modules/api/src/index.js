const express = require('express');
const env = require('./env');
const routes = require('./routes');

// ...

const app = express();
app.use(express.json());
app.use('/', routes);

//health check
app.get('/healthz', (_req, res) => {
    res.send('OK');
});

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