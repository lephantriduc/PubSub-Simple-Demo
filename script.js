const mqtt = require("mqtt");

const args = process.argv.slice(2);
const command = args[0];

const colors = {
    default: "\x1b[0m",
    cyan: "\x1b[36m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
};

if (command !== "publish" && command !== "subscribe") {
    console.log("Commands:");
    console.log("  publish <topic> - Publish messages to a topic");
    console.log(
        "  subscribe <topic1> [topic2] [topic3] ... - Subscribe to one or many topics"
    );
    process.exit(1);
}

const client = mqtt.connect("mqtt://localhost:1883", {
    username: "admin",
    password: "admin",
});

client.on("error", (err) => {
    console.error("Connection error:", err);
    process.exit(1);
});

process.on("SIGINT", () => {
    console.log("\nDisconnecting from MQTT broker...");
    client.end();
    process.exit(0);
});

if (command === "publish") {
    if (args.length != 2) {
        console.log("Usage: node script.js publish <topic>");
        process.exit(1);
    }

    const topic = args[1];

    client.on("connect", () => {
        console.log(`Connected to MQTT broker`);

        let data = 0;
        setInterval(() => {
            data += 1;
            const message = data.toString();
            client.publish(topic, message, (err) => {
                const timestamp = new Date().toISOString();

                if (err) {
                    console.error("Error publishing message:", err);
                } else {
                    console.log(
                        `${colors.cyan}[${timestamp}] ${colors.green}Published ${colors.default}${message} ${colors.green}to topic${colors.default} ${colors.yellow}${topic}${colors.default}`
                    );
                }
            });
        }, 2000);
    });
} else if (command === "subscribe") {
    if (args.length < 2) {
        console.log(
            "Usage: node script.js subscribe <topic1> [topic2] [topic3] ..."
        );
        process.exit(1);
    }

    const topics = args.slice(1);

    client.on("connect", () => {
        console.log(`Connected to MQTT broker`);
        console.log(
            `Subscribing to topic(s): ${colors.yellow}${topics.join(", ")}${colors.default}`
        );

        topics.forEach((topic) => {
            client.subscribe(topic, (err) => {
                if (err) {
                    console.error("Error subscribing to topic:", err);
                    process.exit(1);
                } else {
                    console.log(
                        `Successfully subscribed to topic: ${colors.yellow}${topic}${colors.default}`
                    );
                }
            });
        });
    });

    client.on("message", (receivedTopic, message) => {
        const timestamp = new Date().toISOString();

        console.log(
            `${colors.cyan}[${timestamp}]${colors.default} ${colors.green}From topic${colors.default} ${colors.yellow}${receivedTopic}${colors.default}: ${message.toString()}`
        );
    });
}
