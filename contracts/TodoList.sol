// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "./TodoListStorage.sol";

library TodoListLib {
    function getItem(address _storageAddress, uint256 _itemId)
        public
        view
        returns (SharedStructs.TodoItem memory)
    {
        return TodoListStorage(_storageAddress).getItem(_itemId);
    }

    function createItem(
        address _storageAddress,
        string memory _title,
        string memory _description
    ) public {
        return
            TodoListStorage(_storageAddress).createItem(_title, _description);
    }
}

contract TodoList {
    using TodoListLib for address;
    address private immutable todoListStorage;

    constructor(address _todoListStorage) {
        todoListStorage = _todoListStorage;
    }

    function createItem(string memory _title, string memory _description)
        external
    {
        todoListStorage.createItem(_title, _description);
    }

    function getItem(uint256 _itemId)
        external
        view
        returns (SharedStructs.TodoItem memory)
    {
        return todoListStorage.getItem(_itemId);
    }
}
