import { PublicKey, Connection, LAMPORTS_PER_SOL } from "@solana/web3.js"

export const airdrop = async (address: PublicKey, amount: number) => {
    const publicKey = new PublicKey(address)
    const conn = new Connection("https://api.devnet.solana.com", "confirmed")
    // const conn = new Connection("http://localhost:8899", "confirmed")
    const airdropSignature = await conn.requestAirdrop(publicKey, LAMPORTS_PER_SOL * amount)

    const latestBlockhash = await conn.getLatestBlockhash()

    const confirmation = await conn.confirmTransaction({
        signature: airdropSignature,
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
    })

    if (confirmation.value.err) {
        console.log("Airdrop failed: ", confirmation.value.err)
    } else {
        const balance = await conn.getBalance(publicKey)
        console.log(`Airdrop successful! New balance: ${balance / LAMPORTS_PER_SOL} SOL`)
    }
}