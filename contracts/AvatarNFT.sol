// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./CaoToken.sol";

contract AvatarNFT is ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;
    struct Avatar {
        Rank rank;
        uint256 arrivalDate;
    }
    enum Rank {
        junior1,
        junior2,
        senior,
        senior2,
        manager,
        partner
    }
    mapping(uint256 => Avatar) public avatarById;

    string public baseTokenURI;
    CaoToken public governanceToken;
    Counters.Counter private _tokenIdCounter;

    constructor(
        string memory _baseUri,
        string memory _tokenName,
        string memory _symbol,
        CaoToken _caoToken
    ) ERC721(_tokenName, _symbol) {
        setBaseUri(_baseUri);
        governanceToken = _caoToken;
    }

    function mint(
        address _receiver,
        Rank _rank,
        uint256 _arrivalDate
    ) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(_receiver, tokenId);
        avatarById[tokenId] = Avatar(_rank, _arrivalDate);
        governanceToken.mint(
            _receiver,
            (uint256(_rank) + 5) * 10**governanceToken.decimals()
        );
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return baseTokenURI;
    }

    function setBaseUri(string memory _baseUri) public onlyOwner {
        baseTokenURI = _baseUri;
    }

    function burn(uint256 _tokenId) public onlyOwner {
        _burn(_tokenId);
    }
}
