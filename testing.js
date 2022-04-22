import { Client, Database } from "node-appwrite";
const today = new Date();
const collId = today.toJSON().split("T")[0];
console.log(collId);

// Init SDK
let client = new Client();
let database = new Database(client);

client
  .setEndpoint("http://localhost/v1") // Your Appwrite Endpoint
  .setProject("6261813420c26bbbf71b") // Your project ID
  .setKey(
    "029ccd88b54b0c887a87876c2a427731d209142d2d9a3158e8c988ed9b34a47fbe64ceacdff9be871da1b7f13f3e6639f542ee72256d67b18ee1f9c34715af2c07efe066703f9ff9ec8ad9292cc609f72fe35808258501a499f7122f0fff1d94406eeec58c7e390e9fc0e890106dbd7cd39446507e03d2cdc9864b8261e8a3f9"
  ); // Your secret API key

// Custom naming
// creating database for appwrite
// checking if there is a collection with the same name as today
// if not, create a new collection
database.listCollections().then((res) => {
  const list = res.collections.map((x) => x.$id);
  console.log(list);
  const length = list.length;
  if (list[length - 1] === collId) {
    console.log("collection exists");
    (async () => {
      await database
        .createDocument(collId, `${today.valueOf()}`, {
          webN: `Cnn`,
          topic: `fd`,
          src: `ffd`,
        })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    })();
  } else {
    console.log("collection does not exist");
    (async () => {
      await database.createCollection(
        collId,
        `${today.toDateString()}`,
        "document",
        ["role:all"],
        ["role:all"]
      );
      database.createStringAttribute(collId, "webN", 225, false);
      database.createStringAttribute(collId, "topic", 225, false);
      database.createStringAttribute(collId, "src", 225, false);
    })();
  }
});
