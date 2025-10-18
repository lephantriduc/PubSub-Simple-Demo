# MQTT Pub-Sub Demo

A simple Node.js MQTT publisher/subscriber demo using RabbitMQ as the message broker.

## Setup

### 1. Clone/Download the Project

```bash
git clone https://github.com/lephantriduc/PubSub-Simple-Demo
cd pub-sub-demo
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start RabbitMQ Broker

```bash
docker-compose up -d
```

This will start RabbitMQ with:

-   MQTT port: `1883`
-   Management UI: `http://localhost:15672` (username: `admin`, password: `admin`)

## Usage

The script supports two main commands: `publish` and `subscribe`.

### Publishing Messages

Send a messages to a topic:

```bash
node script.js publish <topic>
```
It will automatically send messages into that topic with the rate of 0.5 messages/s.

### Subscribing to Topics

Subscribe to one or more topics:

```bash
node script.js subscribe <topic1> [topic2] [topic3] ...
```

**Examples:**

```bash
# Subscribe to a single topic
node script.js subscribe weather

# Subscribe to multiple topics
node script.js subscribe chat/room1 chat/room2 notifications
```

The subscriber will:

-   Connect to the MQTT broker
-   Subscribe to all specified topics
-   Display incoming messages with timestamps and topic names
-   Run continuously until you press `Ctrl+C`
