// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "./TodoListStorage.sol";

library TodoLitLib {
    function getItem(address _storageAddress, uint256 _itemId)
        public
        view
        returns (SharedStructs.TodoItem memory)
    {
        return TodoListStorage(_storageAddress).getItem(_itemId);
    }
}

contract TodoList {}
