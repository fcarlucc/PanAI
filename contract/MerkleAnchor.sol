// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title MerkleAnchor - Plain metadata version (refactor: calldata struct)
contract MerkleAnchor {
    // --- Ownable minimal ---
    address public owner;
    modifier onlyOwner() { require(msg.sender == owner, "not owner"); _; }
    constructor() { owner = msg.sender; }
    function transferOwnership(address newOwner) external onlyOwner { owner = newOwner; }

    // --- Config enums ---
    enum HashAlgo { SHA256 /*, KECCAK */ }
    enum CanonRules { JCS_LIKE /*, RFC8785*/ }

    struct TreeInfo {
        bytes32 root;
        HashAlgo algo;
        CanonRules canon;
        bool exists;
    }

    /// Metadati in chiaro
    struct LeafInfo {
        bytes32 treeId;        // keccak(treeId string)
        uint32  leafIndex;
        string  user_id;
        uint64  created;
        string  provider;
        string  model;
        bytes32 vectorCommit;
        bool    exists;
    }

    /// Struct per input (riduce i parametri della funzione)
    struct PlainMeta {
        string user_id;
        uint64 created;   // epoch second
        string provider;
        string model;
    }

    mapping(bytes32 => TreeInfo) public trees;
    mapping(bytes32 => LeafInfo) public leaves;

    event TreeRegistered(bytes32 indexed treeIdHash, string treeId, bytes32 root, HashAlgo algo, CanonRules canon);
    event LeafAnchoredPlain(
        bytes32 indexed leaf,
        bytes32 indexed treeIdHash,
        uint32 leafIndex,
        string user_id,
        uint64 created,
        string provider,
        string model,
        bytes32 vectorCommit
    );
    event ScoreAnchored(bytes32 indexed leaf, uint256 scoreTimes1e6, address indexed submitter);

    // --- Utils ---
    function _hashAlgo() internal pure returns (HashAlgo) { return HashAlgo.SHA256; }
    function _canonRules() internal pure returns (CanonRules) { return CanonRules.JCS_LIKE; }

    /// Registra albero
    function registerTree(string calldata treeId, bytes32 root) external onlyOwner {
        bytes32 treeIdHash = keccak256(bytes(treeId));
        trees[treeIdHash] = TreeInfo({
            root: root,
            algo: _hashAlgo(),
            canon: _canonRules(),
            exists: true
        });
        emit TreeRegistered(treeIdHash, treeId, root, _hashAlgo(), _canonRules());
    }

    /// Ancora leaf con metadati in chiaro (usando struct per evitare "stack too deep")
    function registerLeafPlain(
        bytes32 leaf,
        string calldata treeId,
        uint32 leafIndex,
        PlainMeta calldata meta,
        bytes32 vectorCommit
    ) external onlyOwner {
        bytes32 treeIdHash = keccak256(bytes(treeId));
        require(trees[treeIdHash].exists, "tree not registered");

        leaves[leaf] = LeafInfo({
            treeId: treeIdHash,
            leafIndex: leafIndex,
            user_id: meta.user_id,
            created: meta.created,
            provider: meta.provider,
            model: meta.model,
            vectorCommit: vectorCommit,
            exists: true
        });

        emit LeafAnchoredPlain(
            leaf,
            treeIdHash,
            leafIndex,
            meta.user_id,
            meta.created,
            meta.provider,
            meta.model,
            vectorCommit
        );
    }

    /// Verifica inclusion proof (SHA-256)
    function verifyInclusion(
        bytes32 leaf,
        string calldata treeId,
        bytes32[] calldata siblings,
        bool[] calldata isLeft
    ) external view returns (bool) {
        require(siblings.length == isLeft.length, "length mismatch");
        bytes32 treeIdHash = keccak256(bytes(treeId));
        TreeInfo memory t = trees[treeIdHash];
        require(t.exists, "tree not found");

        bytes32 computed = leaf;
        for (uint256 i = 0; i < siblings.length; i++) {
            computed = isLeft[i]
                ? sha256(abi.encodePacked(siblings[i], computed))
                : sha256(abi.encodePacked(computed, siblings[i]));
        }
        return computed == t.root;
    }

    /// (Opzionale) score off-chain
    function anchorScore(bytes32 leaf, uint256 scoreTimes1e6) external {
        require(leaves[leaf].exists, "leaf not anchored");
        emit ScoreAnchored(leaf, scoreTimes1e6, msg.sender);
    }

    /// Getter comodo "tutto in uno"
    function getLeaf(bytes32 leaf) external view returns (
        bool exists,
        bytes32 treeIdHash,
        uint32 leafIndex,
        string memory user_id,
        uint64 created,
        string memory provider,
        string memory model,
        bytes32 vectorCommit
    ) {
        LeafInfo memory li = leaves[leaf];
        return (
            li.exists,
            li.treeId,
            li.leafIndex,
            li.user_id,
            li.created,
            li.provider,
            li.model,
            li.vectorCommit
        );
    }
}
