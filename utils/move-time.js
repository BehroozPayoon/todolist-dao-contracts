const { network } = require("hardhat")

async function moveTime(amount) {
    console.log("Moing time....")
    await network.provider.request({
        method: "evm_increaseTime",
        params: [amount],
    })
}

module.exports = {
    moveTime,
}
