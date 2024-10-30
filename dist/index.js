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
const web3_js_1 = require("@solana/web3.js");
// import { Token, TOKEN_PROGRAM_ID } from "@solana/spl-token"
const spl_token_1 = require("@solana/spl-token");
const airdrop_1 = require("./airdrop");
const startMint = (mintWallet) => __awaiter(void 0, void 0, void 0, function* () {
    const connection = new web3_js_1.Connection("http://localhost:8899", "confirmed");
    const creatorTokenAddress = yield (0, spl_token_1.createMint)(connection, mintWallet, mintWallet.publicKey, null, 9, undefined, { commitment: "confirmed" }, spl_token_1.TOKEN_PROGRAM_ID);
    console.log("Token address: ", creatorTokenAddress.toBase58());
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>\n");
    return creatorTokenAddress;
});
const transferTokens = (creatorTokenAddress, mintWallet, receiver) => __awaiter(void 0, void 0, void 0, function* () {
    const connection = new web3_js_1.Connection("http://localhost:8899", "confirmed");
    const tokenAccount = yield (0, spl_token_1.getOrCreateAssociatedTokenAccount)(connection, mintWallet, creatorTokenAddress, mintWallet.publicKey);
    console.log("Token account: ", tokenAccount);
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>\n");
    // Add supply of 999 tokens
    const mintToken = yield (0, spl_token_1.mintTo)(connection, mintWallet, creatorTokenAddress, tokenAccount.address, mintWallet, 999 * web3_js_1.LAMPORTS_PER_SOL);
    console.log("Mint token: ", mintToken);
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>\n");
    const senderTokenAccount = yield (0, spl_token_1.getOrCreateAssociatedTokenAccount)(connection, mintWallet, creatorTokenAddress, mintWallet.publicKey);
    console.log("Sender token account: ", senderTokenAccount);
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>\n");
    const receiverTokenAccount = yield (0, spl_token_1.getOrCreateAssociatedTokenAccount)(connection, mintWallet, // Fee payer or signer
    creatorTokenAddress, receiver);
    console.log("Receiver token account: ", receiverTokenAccount);
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>\n");
    const transaction = new web3_js_1.Transaction().add((0, spl_token_1.createTransferInstruction)(senderTokenAccount.address, receiverTokenAccount.address, mintWallet.publicKey, 100 * web3_js_1.LAMPORTS_PER_SOL));
    console.log("Transaction: ", transaction);
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>\n");
    const signature = yield (0, web3_js_1.sendAndConfirmTransaction)(connection, transaction, [mintWallet]);
    console.log("Transaction Signature: ", signature);
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>\n");
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    // mintAuthority
    const mintWallet = yield web3_js_1.Keypair.generate();
    yield (0, airdrop_1.airdrop)(mintWallet.publicKey, 1000);
    // createdTokenAddress
    const creatorTokenAddress = yield startMint(mintWallet);
    yield transferTokens(creatorTokenAddress, mintWallet, new web3_js_1.PublicKey("7zcswFw65sppQrU9sZD5VT3g2AL4BwLbqmkbiRQTNg61"));
}))();
//# sourceMappingURL=index.js.map