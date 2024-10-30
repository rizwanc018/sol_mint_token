"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.airdrop = void 0;
const web3_js_1 = require("@solana/web3.js");
const airdrop = (address, amount) => __awaiter(void 0, void 0, void 0, function* () {
    const publicKey = new web3_js_1.PublicKey(address);
    const conn = new web3_js_1.Connection("https://api.devnet.solana.com", "confirmed");
    // const conn = new Connection("http://localhost:8899", "confirmed")
    const airdropSignature = yield conn.requestAirdrop(publicKey, web3_js_1.LAMPORTS_PER_SOL * amount);
    const latestBlockhash = yield conn.getLatestBlockhash();
    const confirmation = yield conn.confirmTransaction({
        signature: airdropSignature,
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
    });
    if (confirmation.value.err) {
        console.log("Airdrop failed: ", confirmation.value.err);
    }
    else {
        const balance = yield conn.getBalance(publicKey);
        console.log(`Airdrop successful! New balance: ${balance / web3_js_1.LAMPORTS_PER_SOL} SOL`);
    }
});
exports.airdrop = airdrop;
//# sourceMappingURL=airdrop.js.map