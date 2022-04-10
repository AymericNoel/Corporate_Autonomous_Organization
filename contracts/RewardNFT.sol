// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./CaoToken.sol";

contract RewardNFT is ERC721Enumerable, Ownable, ERC721URIStorage {
    using Counters for Counters.Counter;

    CaoToken public governanceToken;
    mapping(address => bool) public authorizedMinters;
    mapping(address => uint256) public currentNftByOwner;
    mapping(address => bool) public allAddresses;
    address payable[] public allAddressesArray;

    uint256 public requiredEthers = 0;
    Counters.Counter private _tokenIdCounter;
    uint256 public etherByReward = 0.0017 ether; // 5€

    event EtherByRewardEvent(uint256 newAmount);
    event RaiseDistributed();
    event DepositedEthers(uint256 amount, address depositor);
    event NewReward(uint256 tokenId, string tokenUri);

    constructor(
        string memory _tokenName,
        string memory _symbol,
        CaoToken _caoToken
    ) ERC721(_tokenName, _symbol) {
        governanceToken = _caoToken;
    }

    modifier onlyAuthorizedMinters() {
        require(authorizedMinters[msg.sender], "Minter not authorized");
        _;
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721URIStorage, ERC721)
    {
        return ERC721URIStorage._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override(ERC721URIStorage, ERC721)
        returns (string memory)
    {
        return ERC721URIStorage.tokenURI(tokenId);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) {
        return ERC721Enumerable._beforeTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Enumerable) returns (bool){
        return ERC721Enumerable.supportsInterface(interfaceId);
    }

    function addMinter(address _minter) public onlyOwner {
        authorizedMinters[_minter] = true;
    }

    function removeMinter(address _minter) public onlyOwner {
        authorizedMinters[_minter] = false;
    }

    function updateEtherByReward(uint256 _newAmount) public onlyOwner {
        etherByReward = _newAmount;
        emit EtherByRewardEvent(_newAmount);
    }

    function mint(
        address payable _receiver,
        uint256 _tokenReward,
        string memory _tokenURI
    ) public onlyAuthorizedMinters {
        if (!allAddresses[_receiver]) {
            allAddresses[_receiver] = true;
            allAddressesArray.push(_receiver);
        }
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        _safeMint(_receiver, tokenId);
        governanceToken.mint(_receiver, _tokenReward);
        _setTokenURI(tokenId, _tokenURI);
        currentNftByOwner[_receiver] += 1;
        requiredEthers += etherByReward;
        emit NewReward(tokenId, _tokenURI);
    }

    function giveAwayRaise() public onlyOwner {
        require(
            address(this).balance >= requiredEthers,
            "Insufficient balance"
        );
        requiredEthers = 0;
        for (uint256 i = 0; i < allAddressesArray.length; i++) {
            uint256 nftByAddress = currentNftByOwner[allAddressesArray[i]];
            if (nftByAddress != 0) {
                allAddressesArray[i].transfer(etherByReward * nftByAddress);
                nftByAddress = 0;
            }
        }
        emit RaiseDistributed();
    }

    function getEtherBalance() public view returns (uint256) {
        return address(this).balance;
    }

    fallback() external payable {
        emit DepositedEthers(msg.value, msg.sender);
    }

    receive() external payable {
        emit DepositedEthers(msg.value, msg.sender);
    }
}
