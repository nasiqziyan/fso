
let password, name, number, url;

function displayPhonebook(Person) {
  console.log("phonebook:");
  Person.find({}).then((result) => {
    result.forEach((entry) => console.log(`${entry.name} ${entry.number}`));
    mongoose.connection.close();
  });
}

function createEntry(name, number, Person) {
  const person = new Person({ name, number });
  person.save().then((result) => {
    console.log(`added ${name} ${number} to phonebook`);
    mongoose.connection.close();
  });
}

if (process.argv.length >= 3) {
  password = process.argv[2];
  url = `mongodb+srv://nasiqziyan:${password}@cluster0.toti7qj.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`;
} else {
  console.log("Usage: node mongo.cjs <password> OR node mongo.cjs <password> <name> <number>");
  process.exit(1);
}

mongoose.connect(url, { family: 4 });

if (process.argv.length === 5) {
  [name, number] = process.argv.slice(3, 5);
} else if (process.argv.length !== 3) {
  console.log("Usage: node mongo.cjs <password> OR node mongo.cjs <password> <name> <number>");
  process.exit(1);
}

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (password && !name && !number) {
  displayPhonebook(Person);
} else if (password && name && number) {
  createEntry(name, number, Person);
}
