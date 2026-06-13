// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title GMGame
 * @dev A fully onchain game on Base.
 */
contract GMGame {
    mapping(address => uint256) public gmCounts;
    mapping(address => uint256) public scores;
    
    address[] public players;
    mapping(address => bool) private hasPlayed;

    event GM(address indexed player, uint256 newCount);
    event ScoreRecorded(address indexed player, uint256 score);

    function gm() external {
        _registerPlayer(msg.sender);
        gmCounts[msg.sender]++;
        emit GM(msg.sender, gmCounts[msg.sender]);
    }

    function recordScore(uint256 score) external {
        _registerPlayer(msg.sender);
        // Only keep highest score
        if (score > scores[msg.sender]) {
            scores[msg.sender] = score;
        }
        emit ScoreRecorded(msg.sender, score);
    }

    function getGMCount(address player) external view returns (uint256) {
        return gmCounts[player];
    }

    function getScore(address player) external view returns (uint256) {
        return scores[player];
    }

    function getTopPlayers(uint256 n) external view returns (address[] memory topAddresses, uint256[] memory topScores) {
        uint256 count = players.length;
        uint256 returnCount = n > count ? count : n;
        
        topAddresses = new address[](returnCount);
        topScores = new uint256[](returnCount);
        
        // Return empty if no players
        if (count == 0 || returnCount == 0) return (topAddresses, topScores);

        // Very basic sorting mapping (insertion sort style - NOT for huge arrays in production)
        address[] memory sortedPlayers = new address[](count);
        for (uint i = 0; i < count; i++) {
            sortedPlayers[i] = players[i];
        }

        for (uint i = 0; i < count; i++) {
            for (uint j = i + 1; j < count; j++) {
                if (scores[sortedPlayers[j]] > scores[sortedPlayers[i]]) {
                    address temp = sortedPlayers[i];
                    sortedPlayers[i] = sortedPlayers[j];
                    sortedPlayers[j] = temp;
                }
            }
        }
        
        for (uint i = 0; i < returnCount; i++) {
            topAddresses[i] = sortedPlayers[i];
            topScores[i] = scores[sortedPlayers[i]];
        }
    }

    function _registerPlayer(address player) internal {
        if (!hasPlayed[player]) {
            players.push(player);
            hasPlayed[player] = true;
        }
    }
}
