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

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  createGenesisBlock() {
    return new Block(0, "03/27/2018", "Genesis Block", "0");
  }

  getLatesBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.previuosHash = this.getLatesBlock().hash;
    newBlock.hash = newBlock.calculateHash();
    this.chain.push(newBlock);
  }

  isChainValid() {
    for(let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i]
      const previousBlock = this.chain[i - 1];

      if(currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if(currentBlock.previuosHash !== previousBlock.hash) {
        return false;
      }
    }

    return true;
  }

}



// tests
let jasCoin = new Blockchain();
jasCoin.addBlock(new Block(1, "02/20/2018", { amount: 12 }));
jasCoin.addBlock(new Block(2, "02/22/2018", { amount: 2 }));
jasCoin.addBlock(new Block(3, "02/24/2018", { amount: 10 }));

console.log("Is blockchain valid? - " + jasCoin.isChainValid());

// try to tamper with the second block
// jasCoin.chain[1].data = { amount: 200 };
// jasCoin.chain[1].hash = jasCoin.chain[2].calculateHash();
// console.log("Is blockchain valid? - " + jasCoin.isChainValid());

console.log(JSON.stringify(jasCoin, null, 4));

