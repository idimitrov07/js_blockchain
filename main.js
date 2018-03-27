const SHA256 = require("crypto-js/sha256");

class Transaction {
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }
}


class Block {
  constructor(timestamp, transactions, previuosHash = '') {
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previuosHash = previuosHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash() {
    return SHA256(this.previuosHash + this.timestamp + 
                  JSON.stringify(this.transactions) + this.nonce).toString();
  }

  mineBlock(difficulty) {
    while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
      this.nonce++;
      this.hash = this.calculateHash();
    }

    console.log("Block mined: " + this.hash);
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 2;
    this.pendingTransactions = [];
    this.miningReward = 100;
  }

  createGenesisBlock() {
    return new Block(Date.parse("2018-03-27"), [], "0");
  }

  getLatesBlock() {
    return this.chain[this.chain.length - 1];
  }

  minePendingTransactions(miningRewardAddress) {
    let block = new Block(Date.now(), this.pendingTransactions, this.getLatesBlock().hash);
    block.mineBlock(this.difficulty);

    console.log('Block successfully mined!');
    this.chain.push(block);

    this.pendingTransactions[
      new Transaction(null, miningRewardAddress, this.miningReward)
    ];
  }

  createTransaction(transaction) {
    this.pendingTransactions.push(transaction);
  }

  getBalanceOfAddress(address) {
    let balance = 0;
    
    for(const block of this.chain) {
      for(const trans of block.transactions) {
        if (trans.fromAddress === address) {
          balance -= trans.amount;
        } 
        if (trans.toAddress === address) {
          balance += trans.amount;
        }
      }
    }
    return balance;
  }

  isChainValid() {
    for(let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i]
      const previousBlock = this.chain[i - 1];

      // recalculate hash and check if it's the same
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

jasCoin.createTransaction(new Transaction('address1', 'address2', 100));
jasCoin.createTransaction(new Transaction('address2', 'address1', 10));


console.log('\n Starting the miner...');
jasCoin.minePendingTransactions('xaviers-address');

console.log('\nBalance of xavier is', jasCoin.getBalanceOfAddress('xaviers-address'));

console.log('\n Starting the miner again...');
jasCoin.minePendingTransactions('xaviers-address');

console.log('\nBalance of xavier is', jasCoin.getBalanceOfAddress('xaviers-address'));

