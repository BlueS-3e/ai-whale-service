// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title WhalePredictor
 * @dev Stores AI-generated whale movement predictions on-chain for transparency and verification.
 * Each prediction is stored as a cryptographic hash and associated metadata.
 */

contract WhalePredictor {
    // ============ State Variables ============
    
    /// @dev Authorized predictor addresses (can submit predictions)
    mapping(address => bool) public authorizedPredictors;
    
    /// @dev Owner who can authorize/revoke predictors
    address public owner;
    
    /// @dev Stored predictions: prediction hash => prediction data
    struct Prediction {
        address predictor;
        bytes32 predictionHash;
        string walletAddress;
        string coinSymbol;
        uint256 riskScore;
        string timeframe;
        uint256 timestamp;
        uint256 blockNumber;
    }
    
    /// @dev All predictions stored in order
    Prediction[] public predictions;
    
    /// @dev Map prediction hash to index for quick lookup
    mapping(bytes32 => uint256) public predictionIndex;
    
    /// @dev Total count of recorded predictions
    uint256 public predictionCount;
    
    // ============ Events ============
    
    /// @dev Emitted when a new prediction is recorded
    event PredictionRecorded(
        address indexed predictor,
        bytes32 indexed predictionHash,
        string walletAddress,
        string coinSymbol,
        uint256 riskScore,
        string timeframe,
        uint256 timestamp,
        uint256 indexed blockNumber
    );
    
    /// @dev Emitted when a predictor is authorized
    event PredictorAuthorized(address indexed predictor);
    
    /// @dev Emitted when a predictor is revoked
    event PredictorRevoked(address indexed predictor);
    
    /// @dev Emitted when ownership is transferred
    event OwnershipTransferred(address indexed oldOwner, address indexed newOwner);
    
    // ============ Modifiers ============
    
    /// @dev Only authorized predictors can submit
    modifier onlyAuthorized() {
        require(authorizedPredictors[msg.sender], "Not authorized to submit predictions");
        _;
    }
    
    /// @dev Only owner can perform administrative actions
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    // ============ Constructor ============
    
    constructor() {
        owner = msg.sender;
        authorizedPredictors[msg.sender] = true;
        predictionCount = 0;
    }
    
    // ============ Core Functions ============
    
    /**
     * @dev Records a whale movement prediction on-chain
     * @param _predictionHash Keccak256 hash of the prediction JSON object
     * @param _walletAddress The wallet address being analyzed (as string for flexibility)
     * @param _coinSymbol The cryptocurrency symbol (e.g., "BTC", "ETH", "BNB")
     * @param _riskScore Risk assessment score (0-100)
     * @param _timeframe Prediction timeframe (e.g., "24h", "7d", "30d")
     * @return predictionId The index of the recorded prediction
     */
    function recordPrediction(
        bytes32 _predictionHash,
        string memory _walletAddress,
        string memory _coinSymbol,
        uint256 _riskScore,
        string memory _timeframe
    ) 
        public 
        onlyAuthorized 
        returns (uint256) 
    {
        require(_predictionHash != bytes32(0), "Prediction hash cannot be zero");
        require(bytes(_walletAddress).length > 0, "Wallet address required");
        require(_riskScore <= 100, "Risk score must be 0-100");
        require(predictionIndex[_predictionHash] == 0, "Prediction already recorded");
        
        Prediction memory newPrediction = Prediction({
            predictor: msg.sender,
            predictionHash: _predictionHash,
            walletAddress: _walletAddress,
            coinSymbol: _coinSymbol,
            riskScore: _riskScore,
            timeframe: _timeframe,
            timestamp: block.timestamp,
            blockNumber: block.number
        });
        
        predictions.push(newPrediction);
        uint256 predictionId = predictions.length - 1;
        predictionIndex[_predictionHash] = predictionId + 1; // +1 to distinguish from zero value
        predictionCount++;
        
        emit PredictionRecorded(
            msg.sender,
            _predictionHash,
            _walletAddress,
            _coinSymbol,
            _riskScore,
            _timeframe,
            block.timestamp,
            block.number
        );
        
        return predictionId;
    }
    
    /**
     * @dev Retrieves the latest predictions
     * @param _limit Maximum number of predictions to return (0 for all)
     * @return Array of predictions, ordered most recent first
     */
    function getLatestPredictions(uint256 _limit) 
        public 
        view 
        returns (Prediction[] memory) 
    {
        uint256 count = _limit == 0 ? predictions.length : 
                       (_limit > predictions.length ? predictions.length : _limit);
        
        Prediction[] memory result = new Prediction[](count);
        
        // Return most recent predictions first
        for (uint256 i = 0; i < count; i++) {
            result[i] = predictions[predictions.length - 1 - i];
        }
        
        return result;
    }
    
    /**
     * @dev Retrieves a specific prediction by hash
     * @param _predictionHash The hash of the prediction to retrieve
     * @return The prediction object, or empty if not found
     */
    function getPredictionByHash(bytes32 _predictionHash) 
        public 
        view 
        returns (Prediction memory) 
    {
        uint256 index = predictionIndex[_predictionHash];
        require(index > 0, "Prediction not found");
        return predictions[index - 1];
    }
    
    /**
     * @dev Retrieves predictions by predictor address
     * @param _predictor The predictor address to filter by
     * @param _limit Maximum results to return
     * @return Array of predictions from this predictor
     */
    function getPredictionsByPredictor(address _predictor, uint256 _limit) 
        public 
        view 
        returns (Prediction[] memory) 
    {
        // Count predictions from this predictor
        uint256 count = 0;
        for (uint256 i = 0; i < predictions.length; i++) {
            if (predictions[i].predictor == _predictor) count++;
        }
        
        // Limit result size
        if (_limit > 0 && count > _limit) count = _limit;
        
        Prediction[] memory result = new Prediction[](count);
        uint256 idx = 0;
        
        // Fill result, most recent first
        for (int256 i = int256(predictions.length) - 1; i >= 0 && idx < count; i--) {
            if (predictions[uint256(i)].predictor == _predictor) {
                result[idx] = predictions[uint256(i)];
                idx++;
            }
        }
        
        return result;
    }
    
    /**
     * @dev Retrieves predictions for a specific coin symbol
     * @param _coinSymbol The coin symbol to filter by (e.g., "ETH", "BNB")
     * @param _limit Maximum results to return
     * @return Array of predictions for this coin
     */
    function getPredictionsByCoin(string memory _coinSymbol, uint256 _limit) 
        public 
        view 
        returns (Prediction[] memory) 
    {
        uint256 count = 0;
        for (uint256 i = 0; i < predictions.length; i++) {
            if (keccak256(abi.encodePacked(predictions[i].coinSymbol)) == 
                keccak256(abi.encodePacked(_coinSymbol))) {
                count++;
            }
        }
        
        if (_limit > 0 && count > _limit) count = _limit;
        
        Prediction[] memory result = new Prediction[](count);
        uint256 idx = 0;
        
        for (int256 i = int256(predictions.length) - 1; i >= 0 && idx < count; i--) {
            if (keccak256(abi.encodePacked(predictions[uint256(i)].coinSymbol)) == 
                keccak256(abi.encodePacked(_coinSymbol))) {
                result[idx] = predictions[uint256(i)];
                idx++;
            }
        }
        
        return result;
    }
    
    // ============ Admin Functions ============
    
    /**
     * @dev Authorizes a new predictor address
     * @param _predictor Address to authorize
     */
    function authorizePredictors(address _predictor) 
        public 
        onlyOwner 
    {
        require(_predictor != address(0), "Invalid address");
        require(!authorizedPredictors[_predictor], "Already authorized");
        
        authorizedPredictors[_predictor] = true;
        emit PredictorAuthorized(_predictor);
    }
    
    /**
     * @dev Revokes a predictor's authorization
     * @param _predictor Address to revoke
     */
    function revokePredictors(address _predictor) 
        public 
        onlyOwner 
    {
        require(authorizedPredictors[_predictor], "Not authorized");
        require(_predictor != owner, "Cannot revoke owner");
        
        authorizedPredictors[_predictor] = false;
        emit PredictorRevoked(_predictor);
    }
    
    /**
     * @dev Transfers contract ownership
     * @param _newOwner The new owner address
     */
    function transferOwnership(address _newOwner) 
        public 
        onlyOwner 
    {
        require(_newOwner != address(0), "Invalid address");
        address oldOwner = owner;
        owner = _newOwner;
        authorizedPredictors[_newOwner] = true;
        emit OwnershipTransferred(oldOwner, _newOwner);
    }
    
    // ============ View Functions ============
    
    /**
     * @dev Get total number of predictions recorded
     * @return Total predictions count
     */
    function getTotalPredictions() public view returns (uint256) {
        return predictionCount;
    }
    
    /**
     * @dev Check if an address is an authorized predictor
     * @param _address Address to check
     * @return True if authorized, false otherwise
     */
    function isAuthorized(address _address) public view returns (bool) {
        return authorizedPredictors[_address];
    }
}
