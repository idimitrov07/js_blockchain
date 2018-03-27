const SHA256 = require("crypto-js/sha256");

class Block {
  constructor(index, timestamp, data, previuosHash = '') {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previuosHash = previuosHash;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return SHA256(this.index + this.previuosHash + this.timestamp + 
                  JSON.stringify(this.data)).toString();
  }
}