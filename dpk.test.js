const { deterministicPartitionKey } = require("./dpk");

describe("deterministicPartitionKey", () => {
  
  it("Returns the literal '0' when given no input", () => {
    const trivialKey = deterministicPartitionKey();
    expect(trivialKey).toBe("0");
  });
  
  it("Returns the correct hash when given a test string", () => {
    const key = deterministicPartitionKey("Clipboard health is the best");
    const hash = "b2284cf95304ab652fa8d49fe8e4c0bd160235be1cbc1b70e65a9ca49672b0cc1ed11f757c45c9e547744bbd13a53f55e851a179b2f15b248438b4615e9ea06c"
    expect(key).toBe(hash);
  });
  
  it("Returns the partition key if provided in event", () => {
    const key = deterministicPartitionKey({partitionKey:"Clipboard"});
    expect(key).toBe("Clipboard");
  });
  
  it("Returns string representation of partition key if provided in event", () => {
    const key = deterministicPartitionKey({partitionKey:{key:"Clipboard"}});
    expect(key).toBe("{\"key\":\"Clipboard\"}");
  });
  
  it("Returns the hash of partition key if provided in event and is greater than max key length", () => {
    let value = "b2284cf95304ab652fa8d49fe8e4c0bd160235be1cbc1b70e65a9ca49672b0cc1ed11f757c45c9e547744bbd13a53f55e851a179b2f15b248438b4615e9ea06cb2284cf95304ab652fa8d49fe8e4c0bd160235be1cbc1b70e65a9ca49672b0cc1ed11f757c45c9e547744bbd13a53f55e851a179b2f15b248438b4615e9ea06cb2284cf95304ab652fa8d49fe8e4c0bd160235be1cbc1b70e65a9ca49672b0cc1ed11f757c45c9e547744bbd13a53f55e851a179b2f15b248438b4615e9ea06c"
    // Doubling the size
    value = value+value;
    let expectedHash = "dc78b61123f09599ba8cbe23ebfb165641a2ec7d7888e2f8b3b4ea5ce3bb73da099c3996fc06fbcd41ff3eec776b57ba4373e17b469b11ef2f6a9dfa0c8ede41"
    const key = deterministicPartitionKey({partitionKey:{key:value}});
    expect(key).toBe(expectedHash);
  });

});
