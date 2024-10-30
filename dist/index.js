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
// connection: Connection,
// payer: Signer,
// mintAuthority: PublicKey,
// freezeAuthority: PublicKey | null,
// decimals: number,
// keypair = Keypair.generate(),
// confirmOptions?: ConfirmOptions,
// programId = TOKEN_PROGRAM_ID,
const startMint = (mintWallet) => __awaiter(void 0, void 0, void 0, function* () {
    const connection = new web3_js_1.Connection("http://localhost:8899", "confirmed");
    const creatorTokenAddress = yield (0, spl_token_1.createMint)(connection, mintWallet, mintWallet.publicKey, null, 9, undefined, { commitment: "confirmed" }, spl_token_1.TOKEN_PROGRAM_ID);
    console.log("Token address: ", creatorTokenAddress.toBase58());
    return creatorTokenAddress;
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    const mintWallet = yield web3_js_1.Keypair.generate();
    console.log("🚀 ~ file: index.ts:40 ~ ; ~ mintWallet🚀", mintWallet);
    yield (0, airdrop_1.airdrop)(mintWallet.publicKey, 1);
    const creatorTokenAddress = yield startMint(mintWallet);
}))();
//# sourceMappingURL=index.js.map