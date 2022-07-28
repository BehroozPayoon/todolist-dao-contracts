const { ethers, network } = require("hardhat")
const { developmentChains, VOTING_DELAY, PROPOSAL_FILE } = require("../helper-hardhat-config")
const { moveBlocks } = require("../utils/move-blocks")
const fs = require("fs")

const main = async function () {
    const governor = await ethers.getContract("GovernorContract")
    const todoList = await ethers.getContract("TodoList")
    const encodedFunctionCall = todoList.interface.encodeFunctionData("createItem", [
        "Ttitle1",
        "Description1",
    ])
    const proposeTx = await governor.propose(
        [todoList.address],
        [0],
        [encodedFunctionCall],
        "Propose: Create a todo item"
    )
    const receipt = await proposeTx.wait(1)

    if (developmentChains.includes(network.name)) {
        moveBlocks(VOTING_DELAY + 1)
    }

    const proposalId = receipt.events[0].args.proposalId

    const proposalState = await governor.state(proposalId)
    const proposalSnapShot = await governor.proposalSnapshot(proposalId)
    const proposalDeadline = await governor.proposalDeadline(proposalId)

    let proposals = JSON.parse(fs.readFileSync(PROPOSAL_FILE, "utf8"))
    proposals[network.config.chainId.toString()].push(proposalId.toString())
    fs.writeFileSync(PROPOSAL_FILE, JSON.stringify(proposals))

    console.log(`Current Proposal State: ${proposalState}`)
    console.log(`Current Proposal Snapshot: ${proposalSnapShot}`)
    console.log(`Current Proposal Deadline: ${proposalDeadline}`)
}

main()
