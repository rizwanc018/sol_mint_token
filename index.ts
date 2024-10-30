import {
    Keypair,
    Connection,
    PublicKey,
    LAMPORTS_PER_SOL,
    Transaction,
    sendAndConfirmTransaction,
} from "@solana/web3.js"
import {
    getOrCreateAssociatedTokenAccount,
    createTransferInstruction,
    TOKEN_PROGRAM_ID,
    createMint,
    mintTo,
} from "@solana/spl-token"
import { airdrop } from "./airdrop"

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

    return creatorTokenAddress
}

const transferTokens = async (creatorTokenAddress: PublicKey, mintWallet: Keypair, receiver: PublicKey) => {
    const connection = new Connection("http://localhost:8899", "confirmed")

    const tokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        mintWallet,
        creatorTokenAddress,
        mintWallet.publicKey
    )


    // Add supply of 999 tokens
    const mintToken = await mintTo(
        connection,
        mintWallet,
        creatorTokenAddress,
        tokenAccount.address,
        mintWallet,
        999 * LAMPORTS_PER_SOL
    )


    const senderTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        mintWallet,
        creatorTokenAddress,
        mintWallet.publicKey
    )

    const receiverTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        mintWallet, // Fee payer or signer
        creatorTokenAddress,
        receiver
    )


    const transaction = new Transaction().add(
        createTransferInstruction(
            senderTokenAccount.address,
            receiverTokenAccount.address,
            mintWallet.publicKey,
            100 * LAMPORTS_PER_SOL
        )
    )

    const signature = await sendAndConfirmTransaction(connection, transaction, [mintWallet])
    console.log("Transaction Signature: ", signature)
}

//
;(async () => {
    // mintAuthority
    const mintWallet = await Keypair.generate()

    await airdrop(mintWallet.publicKey, 1000)
    // createdTokenAddress
    const creatorTokenAddress = await startMint(mintWallet)

    await transferTokens(
        creatorTokenAddress,
        mintWallet,
        new PublicKey("7zcswFw65sppQrU9sZD5VT3g2AL4BwLbqmkbiRQTNg61")
    )
})()
