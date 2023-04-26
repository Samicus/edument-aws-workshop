const { SQSClient, ReceiveMessageCommand, DeleteMessageCommand } = require("@aws-sdk/client-sqs");
let running = true;

// ...
// Helper function for the "Service Autoscaling" section.
const delay = delayMs => {
  return new Promise(resolve => {
    setTimeout(resolve, delayMs)
  });
};

// ...
// TODO 1: Implement SIGINT and SIGTERM handling to stop the processor.

//Graceful shutdown
process.on('SIGTERM', () => {
  console.log('The service is about to shut down!');

  // Finish any outstanding requests, then...
  running = false;

});

//Graceful shutdown
process.on('SIGINT', () => {
  console.log('The service is about to shut down!');

  // Finish any outstanding requests, then...
  running = false;

});


// ...
const client = new SQSClient({ region: "eu-north-1" });


const processor = async () => {
  while (running) {

    const out = await client.send(new ReceiveMessageCommand({
      QueueUrl: process.env.COPILOT_QUEUE_URI,
      WaitTimeSeconds: 10,
    }));

    if (out.Messages === undefined || out.Messages.length === 0) {
      continue;
    }

    for (const message of out.Messages) {

      const {
        Body,
        ReceiptHandle
      } = message;

      const body = JSON.parse(Body);
      const requestId = body.Message;

      console.log('Processing request with ID: ' + requestId);
      //console.log(`results: ${JSON.stringify(out)}`);

      await client.send(new DeleteMessageCommand({
        QueueUrl: process.env.COPILOT_QUEUE_URI,
        ReceiptHandle,
      }));
    }
    delay(10000);
  }
}

processor();