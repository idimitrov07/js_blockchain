const SHA256 = require("crypto-js/sha256");

class Transaction {
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }
}

class Block {
    constructor(timestamp, transactions, previousHash = '') {
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
      return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
    }

    mineBlock(difficulty) {
      while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
          this.nonce++;
          this.hash = this.calculateHash();
      }
      console.log("BLOCK MINED: " + this.hash);
    }
}


class Blockchain{
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 3;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    createGenesisBlock() {
      return new Block(Date.parse("2017-01-01"), [], "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    minePendingTransactions(miningRewardAddress){
        let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
        block.mineBlock(this.difficulty);

        console.log('Block successfully mined!');
        this.chain.push(block);

        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];
    }

    createTransaction(transaction){
        if (this.isTransactionValid(transaction)) {
            this.pendingTransactions.push(transaction);
        } else {
            console.log("Transaction is not valid.");
            console.log("Transaction amount: " + transaction.amount);
            console.log("Sender balance: " + this.getBalanceOfAddress(
                                                    transaction.fromAddress));
        }
    }

    isTransactionValid(transaction) {
        if (transaction.amount > this.getBalanceOfAddress(transaction.fromAddress)) {
            return false;
        }
        return true;
    }

    getBalanceOfAddress(address){
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
        for (let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }

        return true;
    }
}

let jasCoin = new Blockchain();

jasCoin.createTransaction(new Transaction('address1', 'address2', 100));
jasCoin.createTransaction(new Transaction('address2', 'address1', 50));
console.log('\n Starting the miner again...');
jasCoin.minePendingTransactions('miner-address');
console.log('\nBalance of miner is', jasCoin.getBalanceOfAddress('miner-address'));

jasCoin.createTransaction(new Transaction('address1', 'address3', 5));
jasCoin.createTransaction(new Transaction('address3', 'address1', 10));
console.log('\n Starting the miner...');
jasCoin.minePendingTransactions('miner-address');
console.log('\nBalance of miner is', jasCoin.getBalanceOfAddress('miner-address'));

jasCoin.createTransaction(new Transaction('address2', 'address3', 50));
console.log('\n Starting the miner again...');
jasCoin.minePendingTransactions('miner-address');

console.log('\nBalance of miner is', jasCoin.getBalanceOfAddress('miner-address'));

console.log('\n Starting the miner again...');
jasCoin.minePendingTransactions('miner-address');

console.log('\nBalance of miner is', jasCoin.getBalanceOfAddress('miner-address'));

console.log('\n Starting the miner again...');
jasCoin.minePendingTransactions('miner-address');

console.log('\nBalance of miner is', jasCoin.getBalanceOfAddress('miner-address'));


console.log("Blockchain is valid: " + jasCoin.isChainValid());

console.log('\nBalance of address1 is', jasCoin.getBalanceOfAddress('address1'));

console.log('\nBalance of address2 is', jasCoin.getBalanceOfAddress('address2'));

console.log('\nBalance of address3 is', jasCoin.getBalanceOfAddress('address3'));
console.log(jasCoin.isTransactionValid(new Transaction('address1', 'address2', 100)));

jasCoin.createTransaction(new Transaction('miner-address', 'address2', 200));
jasCoin.minePendingTransactions('miner-address');
console.log('\nBalance of address2 is', jasCoin.getBalanceOfAddress('address2'));
console.log('\nBalance of miner is', jasCoin.getBalanceOfAddress('miner-address'));

jasCoin.createTransaction(new Transaction('address2', 'address1', 50));
console.log('\n Starting the miner again...');
jasCoin.minePendingTransactions('miner-address');
console.log('\nBalance of address1 is', jasCoin.getBalanceOfAddress('address1'));
console.log('\nBalance of address2 is', jasCoin.getBalanceOfAddress('address2'));
console.log('\nBalance of miner is', jasCoin.getBalanceOfAddress('miner-address'));

jasCoin.createTransaction(new Transaction('address1', 'address3', 5));
console.log('\n Starting the miner...');
jasCoin.minePendingTransactions('miner-address');
console.log('\nBalance of address1 is', jasCoin.getBalanceOfAddress('address1'));
console.log('\nBalance of address2 is', jasCoin.getBalanceOfAddress('address2'));
console.log('\nBalance of address3 is', jasCoin.getBalanceOfAddress('address3'));
console.log('\nBalance of miner is', jasCoin.getBalanceOfAddress('miner-address'));

jasCoin.createTransaction(new Transaction('address3', 'address1', 10));
console.log('\n Starting the miner...');
jasCoin.minePendingTransactions('miner-address');
console.log('\nBalance of address3 is', jasCoin.getBalanceOfAddress('address3'));

console.log(JSON.stringify(jasCoin, null, 4));
