// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";

contract CaoToken is ERC20, ERC20Permit, ERC20Votes, Ownable {
    mapping(address => bool) public authorizedMinters;

    event MinterAdded(address minter);
    event MinterRemoved(address minter);

    constructor(
        string memory _tokenName,
        string memory _symbol,
        address[] memory _minters
    ) ERC20(_tokenName, _symbol) ERC20Permit(_tokenName) {
        for (uint256 index = 0; index < _minters.length; index++) {
            authorizedMinters[_minters[index]] = true;
        }
        _mint(msg.sender, 150*10**decimals());
        _mint(address(this), 150*10**decimals()); //mint 150 CAO in order to have a flow balance
    }

    modifier onlyAuthorizedMinters() {
        require(authorizedMinters[msg.sender], "Minter not authorized");
        _;
    }

    function addMinter(address _minter) public onlyOwner {
        authorizedMinters[_minter] = true;
        emit MinterAdded(_minter);
    }

    function removeMinter(address _minter) public onlyOwner {
        authorizedMinters[_minter] = false;
        emit MinterRemoved(_minter);
    }

    function _afterTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override(ERC20, ERC20Votes) {
        super._afterTokenTransfer(from, to, amount);
    }

    function _mint(address to, uint256 amount)
        internal
        override(ERC20, ERC20Votes)
    {
        super._mint(to, amount);
    }

    function _burn(address account, uint256 amount)
        internal
        override(ERC20, ERC20Votes)
    {
        super._burn(account, amount);
    }

    function mint(address to, uint256 amount) public onlyAuthorizedMinters {
        _mint(to, amount);
    }
}
