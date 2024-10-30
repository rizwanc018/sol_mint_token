import {
    Keypair,
    Connection,
    PublicKey,
    LAMPORTS_PER_SOL,
    Transaction,
    sendAndConfirmTransaction,
    SendTransactionError,
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
    console.log("miniting started")
    const connection = new Connection("https://api.devnet.solana.com", "confirmed")
    try {
        const creatorTokenAddress = await createMint(connection, mintWallet, mintWallet.publicKey, null, 9)
        console.log("creatorTokenAddress: ", creatorTokenAddress.toBase58())
        return creatorTokenAddress
    } catch (error) {
        console.error("Failed to create mint:", error)
    }
}

const transferTokens = async (creatorTokenAddress: PublicKey, mintWallet: Keypair, receiver: PublicKey) => {
    // const connection = new Connection("http://localhost:8899", "confirmed")
    const connection = new Connection("https://api.devnet.solana.com", "confirmed")

    const tokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        mintWallet,
        creatorTokenAddress,
        mintWallet.publicKey
    )

    console.log("tokenAccount address: ", tokenAccount.address.toBase58())
    console.log("tokenAccount: ", tokenAccount)

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
    console.log("senderTokenAccount address: ", senderTokenAccount.address.toBase58())
    console.log("senderTokenAccount: ", senderTokenAccount)

    const receiverTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        mintWallet, // Fee payer or signer
        creatorTokenAddress,
        receiver
    )
    console.log("receiverTokenAccount address: ", receiverTokenAccount.address.toBase58())
    console.log("receiverTokenAccount: ", receiverTokenAccount)

    const transaction = new Transaction().add(
        createTransferInstruction(
            senderTokenAccount.address,
            receiverTokenAccount.address,
            mintWallet.publicKey,
            100 * LAMPORTS_PER_SOL
        )
    )

    // const signature = await sendAndConfirmTransaction(connection, transaction, [mintWallet])
    // console.log("Transaction Signature: ", signature)

    try {
        const signature = await sendAndConfirmTransaction(connection, transaction, [mintWallet])
        console.log("Transaction Signature: ", signature)
    } catch (error) {
        console.error("Transaction failed:", error)
        if (error instanceof SendTransactionError) {
            console.log(error.logs)
        }
    }
}

//
;(async () => {
    // mintAuthority
    // const mintWallet = await Keypair.generate()
    // OR
    const secretKeyArray = Uint8Array.from([
        147,95,106,243,156,103,25,201,80,153,83,54,189,118,78,157,
        133,246,148,210,163,67,71,190,62,2,83,6,128,197,135,139,105,
        246,61,212,252,68,175,188,200,27,204,252,58,90,245,163,185,
        195,197,220,82,146,179,41,20,15,139,221,174,183,86,166
    ]);
    const mintWallet = Keypair.fromSecretKey(secretKeyArray);
    console.log("mintWallet address: ", mintWallet.publicKey.toBase58())
    console.log("mintWallet secretKey: ", mintWallet.secretKey)
    console.log("mintWallet", mintWallet)

    // await airdrop(mintWallet.publicKey, 1)

    // createdTokenAddress
    const creatorTokenAddress = await startMint(mintWallet)

    await transferTokens(
        creatorTokenAddress,
        mintWallet,
        new PublicKey("3BUoiPCqw77faEXhc3jnXw8DKkTE1thpG1H45zwzvt92")
    )
})()


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// mintWallet address:  88daxhdtpXD46NLjjxZVEn2hjgiUj5XXn1upk86zu69K
// miniting started
// creatorTokenAddress:  31HJUEyBPm1Qbya2zwaS1FUYizfAEZRYyPMAfbMJRdnd
// tokenAccount address:  DLF4gKvBBCnbUsGVzhUfuZgu3DhE9DMvRCb9JCuQV2Nh
// tokenAccount:  {
//   address: PublicKey [PublicKey(DLF4gKvBBCnbUsGVzhUfuZgu3DhE9DMvRCb9JCuQV2Nh)] {
//     _bn: <BN: b73a2e173c56162636e741c94cdec9494e9263ea7b85778604c8ed03bb40ae9e>
//   },
//   mint: PublicKey [PublicKey(31HJUEyBPm1Qbya2zwaS1FUYizfAEZRYyPMAfbMJRdnd)] {
//     _bn: <BN: 1dc9ce4105be5e5d05088958563db1fcbfd2173f7671ab25a3414dc5045ce236>
//   },
//   owner: PublicKey [PublicKey(88daxhdtpXD46NLjjxZVEn2hjgiUj5XXn1upk86zu69K)] {
//     _bn: <BN: 69f63dd4fc44afbcc81bccfc3a5af5a3b9c3c5dc5292b329140f8bddaeb756a6>
//   },
//   amount: 0n,
// }
// senderTokenAccount address:  DLF4gKvBBCnbUsGVzhUfuZgu3DhE9DMvRCb9JCuQV2Nh
// senderTokenAccount:  {
//   address: PublicKey [PublicKey(DLF4gKvBBCnbUsGVzhUfuZgu3DhE9DMvRCb9JCuQV2Nh)] {
//     _bn: <BN: b73a2e173c56162636e741c94cdec9494e9263ea7b85778604c8ed03bb40ae9e>
//   },
//   mint: PublicKey [PublicKey(31HJUEyBPm1Qbya2zwaS1FUYizfAEZRYyPMAfbMJRdnd)] {
//     _bn: <BN: 1dc9ce4105be5e5d05088958563db1fcbfd2173f7671ab25a3414dc5045ce236>
//   },
//   owner: PublicKey [PublicKey(88daxhdtpXD46NLjjxZVEn2hjgiUj5XXn1upk86zu69K)] {
//     _bn: <BN: 69f63dd4fc44afbcc81bccfc3a5af5a3b9c3c5dc5292b329140f8bddaeb756a6>
//   },
//   amount: 999000000000n,
// }
// receiverTokenAccount address:  DqacnChbnsj7E4RdFstBSJPAq8bmumPnAnoX3UJsvXYC
// receiverTokenAccount:  {
//   address: PublicKey [PublicKey(DqacnChbnsj7E4RdFstBSJPAq8bmumPnAnoX3UJsvXYC)] {
//     _bn: <BN: bebe21f7a6303e1453b10367c438e1105b01a7f05be1769448b64ccc84d6ac11>
//   },
//   mint: PublicKey [PublicKey(31HJUEyBPm1Qbya2zwaS1FUYizfAEZRYyPMAfbMJRdnd)] {
//     _bn: <BN: 1dc9ce4105be5e5d05088958563db1fcbfd2173f7671ab25a3414dc5045ce236>
//   },
//   owner: PublicKey [PublicKey(3BUoiPCqw77faEXhc3jnXw8DKkTE1thpG1H45zwzvt92)] {
//     _bn: <BN: 20669f222d74664876f561bbd4bccaf6113a3065ea72891f9ced166fd278fbd5>
//   },
//   amount: 0n,
// }