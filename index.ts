import { Keypair, Connection, PublicKey } from "@solana/web3.js"
// import { Token, TOKEN_PROGRAM_ID } from "@solana/spl-token"
import {
    getMint,
    getOrCreateAssociatedTokenAccount,
    createTransferInstruction,
    TOKEN_PROGRAM_ID,
    createMintToInstruction,
    createMint,
} from "@solana/spl-token"
import { airdrop } from "./airdrop"

// connection: Connection,
// payer: Signer,
// mintAuthority: PublicKey,
// freezeAuthority: PublicKey | null,
// decimals: number,
// keypair = Keypair.generate(),
// confirmOptions?: ConfirmOptions,
// programId = TOKEN_PROGRAM_ID,

const startMint = async (mintWallet: Keypair) => {
    const connection = new Connection("http://localhost:8899", "confirmed")
    const creatorTokenAddress = await createMint(
        connection,
        mintWallet,
        mintWallet.publicKey,
        null,
        9,
        undefined,
        { commitment: "confirmed" },
        TOKEN_PROGRAM_ID
    )
    console.log("Token address: ", creatorTokenAddress.toBase58())
    return creatorTokenAddress
}

;(async () => {
    const mintWallet = await Keypair.generate()
    console.log("🚀 ~ file: index.ts:40 ~ ; ~ mintWallet🚀", mintWallet)

    await airdrop(mintWallet.publicKey, 1000)
    const creatorTokenAddress = await startMint(mintWallet)
})()
