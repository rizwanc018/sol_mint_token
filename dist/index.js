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
const spl_token_1 = require("@solana/spl-token");
const startMint = (mintWallet) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("miniting started");
    const connection = new web3_js_1.Connection("https://api.devnet.solana.com", "confirmed");
    try {
        const creatorTokenAddress = yield (0, spl_token_1.createMint)(connection, mintWallet, mintWallet.publicKey, null, 9);
        console.log("creatorTokenAddress: ", creatorTokenAddress.toBase58());
        return creatorTokenAddress;
    }
    catch (error) {
        console.error("Failed to create mint:", error);
    }
});
const transferTokens = (creatorTokenAddress, mintWallet, receiver) => __awaiter(void 0, void 0, void 0, function* () {
    // const connection = new Connection("http://localhost:8899", "confirmed")
    const connection = new web3_js_1.Connection("https://api.devnet.solana.com", "confirmed");
    const tokenAccount = yield (0, spl_token_1.getOrCreateAssociatedTokenAccount)(connection, mintWallet, creatorTokenAddress, mintWallet.publicKey);
    console.log("tokenAccount address: ", tokenAccount.address.toBase58());
    console.log("tokenAccount: ", tokenAccount);
    // Add supply of 999 tokens
    const mintToken = yield (0, spl_token_1.mintTo)(connection, mintWallet, creatorTokenAddress, tokenAccount.address, mintWallet, 999 * web3_js_1.LAMPORTS_PER_SOL);
    const senderTokenAccount = yield (0, spl_token_1.getOrCreateAssociatedTokenAccount)(connection, mintWallet, creatorTokenAddress, mintWallet.publicKey);
    console.log("senderTokenAccount address: ", senderTokenAccount.address.toBase58());
    console.log("senderTokenAccount: ", senderTokenAccount);
    const receiverTokenAccount = yield (0, spl_token_1.getOrCreateAssociatedTokenAccount)(connection, mintWallet, // Fee payer or signer
    creatorTokenAddress, receiver);
    console.log("receiverTokenAccount address: ", receiverTokenAccount.address.toBase58());
    console.log("receiverTokenAccount: ", receiverTokenAccount);
    const transaction = new web3_js_1.Transaction().add((0, spl_token_1.createTransferInstruction)(senderTokenAccount.address, receiverTokenAccount.address, mintWallet.publicKey, 100 * web3_js_1.LAMPORTS_PER_SOL));
    // const signature = await sendAndConfirmTransaction(connection, transaction, [mintWallet])
    // console.log("Transaction Signature: ", signature)
    try {
        const signature = yield (0, web3_js_1.sendAndConfirmTransaction)(connection, transaction, [mintWallet]);
        console.log("Transaction Signature: ", signature);
    }
    catch (error) {
        console.error("Transaction failed:", error);
        if (error instanceof web3_js_1.SendTransactionError) {
            console.log(error.logs);
        }
    }
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    // mintAuthority
    // const mintWallet = await Keypair.generate()
    const secretKeyArray = Uint8Array.from([
        147, 95, 106, 243, 156, 103, 25, 201, 80, 153, 83, 54, 189, 118, 78, 157,
        133, 246, 148, 210, 163, 67, 71, 190, 62, 2, 83, 6, 128, 197, 135, 139, 105,
        246, 61, 212, 252, 68, 175, 188, 200, 27, 204, 252, 58, 90, 245, 163, 185,
        195, 197, 220, 82, 146, 179, 41, 20, 15, 139, 221, 174, 183, 86, 166
    ]);
    const mintWallet = web3_js_1.Keypair.fromSecretKey(secretKeyArray);
    console.log("mintWallet address: ", mintWallet.publicKey.toBase58());
    console.log("mintWallet secretKey: ", mintWallet.secretKey);
    console.log("mintWallet", mintWallet);
    // await airdrop(mintWallet.publicKey, 1)
    // createdTokenAddress
    const creatorTokenAddress = yield startMint(mintWallet);
    yield transferTokens(creatorTokenAddress, mintWallet, new web3_js_1.PublicKey("3BUoiPCqw77faEXhc3jnXw8DKkTE1thpG1H45zwzvt92"));
}))();
//# sourceMappingURL=index.js.map