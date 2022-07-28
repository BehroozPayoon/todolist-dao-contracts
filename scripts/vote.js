const { ethers, network } = require("hardhat")
const { developmentChains, PROPOSAL_FILE, VOTING_PERIOD } = require("../helper-hardhat-config")
const { moveBlocks } = require("../utils/move-blocks")
const fs = require("fs")

const main = async function () {
    const proposals = JSON.parse(fs.readFileSync(PROPOSAL_FILE, "utf8"))
    const proposalId = proposals[network.config.chainId][0]

    const voteWay = 1
    const governor = await ethers.getContract("GovernorContract")
    const voteTxResponse = await governor.castVoteWithReason(
        proposalId,
        voteWay,
        "I Like this item"
    )
    await voteTxResponse.wait(1)

    if (developmentChains.includes(network.name)) {
        moveBlocks(VOTING_PERIOD + 1)
    }
    console.log("Vote submitted")
}

main()
