const { network, ethers } = require("hardhat")
const {
    networkConfig,
    developmentChains,
    VERIFICATION_BLOCK_CONFIRMATIONS,
} = require("../helper-hardhat-config")

async function delegateVotingPower(governanceTokenAddress, delegatedAccount) {
    const governanceToken = await ethers.getContractAt("GovernanceToken", governanceTokenAddress)
    const transactionResponse = await governanceToken.delegate(delegatedAccount)
    await transactionResponse.wait(1)
    console.log(`Checkpoints: ${await governanceToken.numCheckpoints(delegatedAccount)}`)
}

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const waitBlockConfirmations = developmentChains.includes(network.name)
        ? 1
        : VERIFICATION_BLOCK_CONFIRMATIONS

    log("----------------------------------------------------")
    const governanceToken = await deploy("GovernanceToken", {
        from: deployer,
        log: true,
        waitBlockConfirmations: waitBlockConfirmations,
    })
    log(`GovernanceToken at ${governanceToken.address}`)
    log(`Delegating to ${deployer}`)
    await delegateVotingPower(governanceToken.address, deployer)
    log("Delegated!")
}
