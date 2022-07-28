const { network, ethers } = require("hardhat")
const {
    networkConfig,
    developmentChains,
    VERIFICATION_BLOCK_CONFIRMATIONS,
    QUORUM_PERCENTAGE,
    VOTING_PERIOD,
    VOTING_DELAY,
} = require("../helper-hardhat-config")

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log, get } = deployments
    const { deployer } = await getNamedAccounts()
    const waitBlockConfirmations = developmentChains.includes(network.name)
        ? 1
        : VERIFICATION_BLOCK_CONFIRMATIONS

    const governanceToken = await get("GovernanceToken")
    const timeLock = await get("TimeLock")
    log("----------------------------------------------------")
    await deploy("GovernorContract", {
        from: deployer,
        args: [
            governanceToken.address,
            timeLock.address,
            QUORUM_PERCENTAGE,
            VOTING_PERIOD,
            VOTING_DELAY,
        ],
        log: true,
        waitConfirmations: waitBlockConfirmations,
    })
    // await deploy("GovernorContract", {
    //     from: deployer,
    //     args: [
    //         governanceToken.address,
    //         timeLock.address,
    //         QUORUM_PERCENTAGE,
    //         VOTING_PERIOD,
    //         VOTING_DELAY,
    //     ],
    //     log: true,
    //     waitBlockConfirmations: waitBlockConfirmations,
    // })
}
