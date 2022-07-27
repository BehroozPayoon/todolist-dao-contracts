// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

library SharedStructs {
    enum Status {
        CREATED,
        DONE,
        DELETED,
        CANCELLED
    }

    struct TodoItem {
        uint256 id;
        string title;
        string description;
        Status status;
    }
}

contract TodoListStorage {
    address private latestVersion;
    uint256 private tasksCount = 0;
    mapping(uint256 => SharedStructs.TodoItem) private tasksMapping;

    event TaskCreated(uint256 indexed id, string title, string description);

    // event ItemDone();
    // event CancelItem();

    modifier onlyLatestVersion() {
        require(msg.sender == latestVersion);
        _;
    }

    function setLatestVersion(address _newVersion) external {
        latestVersion = _newVersion;
    }

    function createItem(string memory _title, string memory _description)
        external
    {
        tasksCount++;
        tasksMapping[tasksCount] = SharedStructs.TodoItem({
            id: tasksCount,
            title: _title,
            description: _description,
            status: SharedStructs.Status.CREATED
        });
        emit TaskCreated(tasksCount, _title, _description);
    }

    function changeItemStatus(uint256 _itemId, SharedStructs.Status _status)
        external
    {
        SharedStructs.TodoItem storage item = tasksMapping[_itemId];
        item.status = _status;
    }

    function getItem(uint256 _itemId)
        external
        view
        returns (SharedStructs.TodoItem memory)
    {
        return tasksMapping[_itemId];
    }
}
