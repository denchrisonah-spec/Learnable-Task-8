const readline = require("readline");

class PrintNumberObserver {
  notify(phoneNumber) {
    console.log(phoneNumber);
  }
}

class NowDiallingObserver {
  notify(phoneNumber) {
    console.log(`Now Dialling ${phoneNumber}`);
  }
}

class Telephone {
  constructor() {
    this.phoneNumbers = new Set();
    this.observers = new Set();
  }

  addPhoneNumber(phoneNumber) {
    this.phoneNumbers.add(phoneNumber);
  }

  removePhoneNumber(phoneNumber) {
    this.phoneNumbers.delete(phoneNumber);
  }

  dialPhoneNumber(phoneNumber) {
    if (!this.phoneNumbers.has(phoneNumber)) return;
    this.notifyObservers(phoneNumber);
  }

  addObserver(observer) {
    this.observers.add(observer);
  }

  removeObserver(observer) {
    this.observers.delete(observer);
  }

  notifyObservers(phoneNumber) {
    for (const observer of this.observers) {
      observer.notify(phoneNumber);
    }
  }
}

const telephone = new Telephone();
telephone.addObserver(new PrintNumberObserver());
telephone.addObserver(new NowDiallingObserver());

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "telephone> ",
});

const help = () => {
  console.log("Commands:");
  console.log("  add <number>      Add a phone number");
  console.log("  remove <number>   Remove a phone number");
  console.log("  dial <number>     Dial a phone number");
  console.log("  list              List saved phone numbers");
  console.log("  help              Show this help");
  console.log("  quit              Exit");
};

console.log("Telephone CLI. Type 'help' for commands.");
help();
rl.prompt();

rl.on("line", (line) => {
  const [command, ...rest] = line.trim().split(/\s+/);
  const arg = rest.join(" ");

  switch (command) {
    case "add":
      if (!arg) {
        console.log("Usage: add <number>");
      } else {
        telephone.addPhoneNumber(arg);
        console.log(`Added ${arg}`);
      }
      break;

    case "remove":
      if (!arg) {
        console.log("Usage: remove <number>");
      } else {
        telephone.removePhoneNumber(arg);
        console.log(`Removed ${arg}`);
      }
      break;

    case "dial":
      if (!arg) {
        console.log("Usage: dial <number>");
      } else if (!telephone.phoneNumbers.has(arg)) {
        console.log(`${arg} has not been added`);
      } else {
        telephone.dialPhoneNumber(arg);
      }
      break;

    case "list":
      if (telephone.phoneNumbers.size === 0) {
        console.log("(no numbers saved)");
      } else {
        telephone.phoneNumbers.forEach((n) => console.log(`  ${n}`));
      }
      break;

    case "help":
      help();
      break;

    case "":
      break;

    case "quit":
    case "exit":
      rl.close();
      return;

    default:
      console.log(`Unknown command: ${command}. Type 'help' for commands.`);
  }

  rl.prompt();
});

rl.on("close", () => {
  console.log("Goodbye.");
  process.exit(0);
});
