const crypto = require("crypto");

exports.deterministicPartitionKey = (event) => {
  const TRIVIAL_PARTITION_KEY = "0";
  const MAX_PARTITION_KEY_LENGTH = 256;

  if(event == null){
    return TRIVIAL_PARTITION_KEY;
  }

  if(event.partitionKey){
    let {partitionKey} = event;
    
    if(typeof partitionKey !== "string"){
      partitionKey = JSON.stringify(partitionKey);
    }

    if(partitionKey.length > MAX_PARTITION_KEY_LENGTH){
      return createHash(partitionKey);
    }
    
    return partitionKey;
  }
  
  const data = JSON.stringify(event);
  return createHash(data);
};


const createHash = candidate=>crypto.createHash("sha3-512").update(candidate).digest("hex");