import { ethers, network } from "hardhat"
import { MIN_DELAY, developmentChains } from "../helper-hardhat-config"
import { moveBlocks } from "../utils/move-blocks"
import { moveTime } from "../utils/move-time"

const main = async function queueAndExecute() {
    const todoList = await ethers.getContract("TodoList")
    const encodedFunctionCall = todoList.interface.encodeFunctionData("createItem", [
        "Ttitle1",
        "Description1",
    ])
    const descriptionHash = ethers.utils.keccak256(
        ethers.utils.toUtf8Bytes("Propose: Create a todo item")
    )

    const governor = await ethers.getContract("GovernorContract")
    console.log("Queueing...")
    const queueTx = await governor.queue(
        [todoList.address],
        [0],
        [encodedFunctionCall],
        descriptionHash
    )
    await queueTx.wait(1)
    if (developmentChains.includes(network.name)) {
        await moveTime(MIN_DELAY + 1)
        await moveBlocks(1)
    }

    console.log("Executing...")
    // this will fail on a testnet because you need to wait for the MIN_DELAY!
    const executeTx = await governor.execute(
        [todoList.address],
        [0],
        [encodedFunctionCall],
        descriptionHash
    )
    await executeTx.wait(1)
}

main()
