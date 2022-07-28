// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

contract TodoList {
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

    event TaskCreated(uint256 indexed id, string title, string description);

    uint256 private tasksCount;
    mapping(uint256 => TodoItem) private tasksMapping;

    function initialize() external {
        tasksCount = 0;
    }

    function createItem(string memory _title, string memory _description) external {
        tasksCount++;
        tasksMapping[tasksCount] = TodoItem({
            id: tasksCount,
            title: _title,
            description: _description,
            status: Status.CREATED
        });
        emit TaskCreated(tasksCount, _title, _description);
    }

    function changeItemStatus(uint256 _itemId, Status _status) external {
        TodoItem storage item = tasksMapping[_itemId];
        item.status = _status;
    }

    function getItem(uint256 _itemId) external view returns (TodoItem memory) {
        return tasksMapping[_itemId];
    }
}
