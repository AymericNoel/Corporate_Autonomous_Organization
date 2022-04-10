// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract TeamNFT is ERC721Enumerable, Ownable, ERC721URIStorage {
    using Counters for Counters.Counter;

    struct Team {
        uint256 teamId;
        string teamName;
        uint256 creationDate;
        uint256 totalMembers;
        address teamLeader;
    }
    mapping(uint256 => Team) public teamById;
    mapping(address => bool) public addressInATeam;
    mapping(uint256 => uint256) public teamByTokenId;

    Counters.Counter private _tokenIdCounter;
    Counters.Counter private _teamCounter;

    event TeamCreated(uint256 teamId);
    event NewTeamLeader(address teamLeader);
    event NewMember(uint256 tokenId, string tokenUri, address member, uint256 teamId);

    constructor(string memory _tokenName, string memory _symbol)
        ERC721(_tokenName, _symbol)
    // solhint-disable-next-line no-empty-blocks
    {

    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721URIStorage, ERC721)
    {
        return ERC721URIStorage._burn(tokenId);
    }

    modifier onlyTeamLeader(uint256 _teamId) {
        require(
            teamById[_teamId].teamLeader == msg.sender,
            "Caller must be the team leader"
        );
        _;
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

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return ERC721Enumerable.supportsInterface(interfaceId);
    }

    function mint(
        address _receiver,
        uint256 _teamId,
        string memory _tokenURI
    ) public onlyTeamLeader(_teamId) {
        require(!addressInATeam[_receiver], "Already in a team");
       _mintNft(_receiver, _tokenURI, _teamId);
    }

    function _mintNft(address _receiver, string memory _tokenURI, uint256 _teamId) private {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(_receiver, tokenId);
        _setTokenURI(tokenId, _tokenURI);
        addressInATeam[_receiver] = true;
        emit NewMember(tokenId, _tokenURI, _receiver, _teamId);
    }

    function createTeam(
        uint256 _creationDate,
        address _teamLeader,
        string memory _teamName,
        string memory _tokenURILeader
    ) public onlyOwner {
        require(!addressInATeam[_teamLeader], "Already in a team");
        _teamCounter.increment();
        uint256 teamId = _teamCounter.current();
        Team storage newTeam = teamById[teamId];
        newTeam.creationDate = _creationDate;
        newTeam.teamId = teamId;
        newTeam.teamLeader = _teamLeader;
        newTeam.teamName = _teamName;
        newTeam.totalMembers = 0;
        addressInATeam[_teamLeader];
        _mintNft(_teamLeader, _tokenURILeader, teamId);
        emit TeamCreated(teamId);
        emit NewTeamLeader(_teamLeader);
    }

    function burn(address _memberAddress, uint256 _teamId)
        public
        onlyTeamLeader(_teamId)
        returns (bool)
    {
        addressInATeam[_memberAddress] = false;
        _burn(tokenOfOwnerByIndex(_memberAddress, 0));
        return true;
    }

    function totalTeam() public view returns (uint256) {
        return _teamCounter.current();
    }
}
