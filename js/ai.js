/**
 * AI 模块 - 使用评分制 + 贪心算法
 * 简单难度，响应时间 < 1 秒
 */
class AI {
    constructor(board) {
        this.board = board;
        this.gridSize = 15;
        this.aiPlayer = 2;  // AI 执白
        this.humanPlayer = 1;  // 人类执黑
        
        // 棋型评分表
        this.scores = {
            // 连五（获胜）
            FIVE: 100000,
            // 活四（两边都空）
            LIVE_FOUR: 10000,
            // 冲四（一边被堵）
            RUSH_FOUR: 1000,
            // 活三（两边都空）
            LIVE_THREE: 1000,
            // 眠三（一边被堵）
            SLEEP_THREE: 100,
            // 活二（两边都空）
            LIVE_TWO: 100,
            // 眠二（一边被堵）
            SLEEP_TWO: 10
        };
    }
    
    /**
     * 获取 AI 最佳落子位置
     * 使用贪心算法，评估每个空位的得分
     */
    getBestMove() {
        const board = this.board.getBoard();
        let bestScore = -Infinity;
        let bestMoves = [];
        
        // 遍历所有空位
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                if (board[row][col] === 0) {
                    // 评估该位置的得分
                    const score = this.evaluatePosition(board, row, col);
                    
                    if (score > bestScore) {
                        bestScore = score;
                        bestMoves = [{ row, col }];
                    } else if (score === bestScore) {
                        bestMoves.push({ row, col });
                    }
                }
            }
        }
        
        // 如果有多个最佳位置，随机选择一个
        if (bestMoves.length > 0) {
            const index = Math.floor(Math.random() * bestMoves.length);
            return bestMoves[index];
        }
        
        // 默认返回中心位置
        return { row: 7, col: 7 };
    }
    
    /**
     * 评估某个位置的得分
     * 综合考虑进攻和防守
     */
    evaluatePosition(board, row, col) {
        // 临时放置 AI 棋子，评估进攻得分
        board[row][col] = this.aiPlayer;
        const attackScore = this.evaluateBoard(board, this.aiPlayer);
        
        // 临时放置人类棋子，评估防守得分
        board[row][col] = this.humanPlayer;
        const defenseScore = this.evaluateBoard(board, this.humanPlayer);
        
        // 恢复空位
        board[row][col] = 0;
        
        // 综合得分：进攻 + 防守
        // 防守略重要，防止人类获胜
        return attackScore + defenseScore * 1.2;
    }
    
    /**
     * 评估整个棋盘对某玩家的得分
     */
    evaluateBoard(board, player) {
        let totalScore = 0;
        
        // 检查所有方向的棋型
        totalScore += this.evaluateHorizontal(board, player);
        totalScore += this.evaluateVertical(board, player);
        totalScore += this.evaluateDiagonal(board, player);
        totalScore += this.evaluateAntiDiagonal(board, player);
        
        return totalScore;
    }
    
    /**
     * 评估横向棋型
     */
    evaluateHorizontal(board, player) {
        let score = 0;
        
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize - 4; col++) {
                score += this.evaluateLine(
                    [
                        board[row][col],
                        board[row][col + 1],
                        board[row][col + 2],
                        board[row][col + 3],
                        board[row][col + 4]
                    ],
                    player
                );
            }
        }
        
        return score;
    }
    
    /**
     * 评估纵向棋型
     */
    evaluateVertical(board, player) {
        let score = 0;
        
        for (let col = 0; col < this.gridSize; col++) {
            for (let row = 0; row < this.gridSize - 4; row++) {
                score += this.evaluateLine(
                    [
                        board[row][col],
                        board[row + 1][col],
                        board[row + 2][col],
                        board[row + 3][col],
                        board[row + 4][col]
                    ],
                    player
                );
            }
        }
        
        return score;
    }
    
    /**
     * 评估主对角线棋型
     */
    evaluateDiagonal(board, player) {
        let score = 0;
        
        for (let row = 0; row < this.gridSize - 4; row++) {
            for (let col = 0; col < this.gridSize - 4; col++) {
                score += this.evaluateLine(
                    [
                        board[row][col],
                        board[row + 1][col + 1],
                        board[row + 2][col + 2],
                        board[row + 3][col + 3],
                        board[row + 4][col + 4]
                    ],
                    player
                );
            }
        }
        
        return score;
    }
    
    /**
     * 评估副对角线棋型
     */
    evaluateAntiDiagonal(board, player) {
        let score = 0;
        
        for (let row = 0; row < this.gridSize - 4; row++) {
            for (let col = 4; col < this.gridSize; col++) {
                score += this.evaluateLine(
                    [
                        board[row][col],
                        board[row + 1][col - 1],
                        board[row + 2][col - 2],
                        board[row + 3][col - 3],
                        board[row + 4][col - 4]
                    ],
                    player
                );
            }
        }
        
        return score;
    }
    
    /**
     * 评估一条线的棋型得分
     */
    evaluateLine(line, player) {
        const opponent = player === 1 ? 2 : 1;
        let score = 0;
        
        // 统计该玩家的棋子数
        let count = 0;
        let blocked = 0;
        
        // 检查左端是否被堵
        if (line[0] === opponent) blocked++;
        
        // 检查右端是否被堵
        if (line[4] === opponent) blocked++;
        
        // 统计连续棋子数
        for (let i = 0; i < 5; i++) {
            if (line[i] === player) {
                count++;
            } else if (line[i] === opponent) {
                // 中间有对手棋子，无法成线
                return 0;
            }
        }
        
        // 根据连子数和阻塞情况评分
        if (count === 5) {
            score = this.scores.FIVE;
        } else if (count === 4) {
            if (blocked === 0) {
                score = this.scores.LIVE_FOUR;
            } else if (blocked === 1) {
                score = this.scores.RUSH_FOUR;
            }
        } else if (count === 3) {
            if (blocked === 0) {
                score = this.scores.LIVE_THREE;
            } else if (blocked === 1) {
                score = this.scores.SLEEP_THREE;
            }
        } else if (count === 2) {
            if (blocked === 0) {
                score = this.scores.LIVE_TWO;
            } else if (blocked === 1) {
                score = this.scores.SLEEP_TWO;
            }
        }
        
        return score;
    }
    
    /**
     * 检查是否获胜
     */
    checkWin(board, row, col, player) {
        const directions = [
            [1, 0],   // 垂直
            [0, 1],   // 水平
            [1, 1],   // 主对角线
            [1, -1]   // 副对角线
        ];
        
        for (const [dr, dc] of directions) {
            let count = 1;
            
            // 正方向计数
            for (let i = 1; i < 5; i++) {
                const r = row + dr * i;
                const c = col + dc * i;
                if (r < 0 || r >= this.gridSize || c < 0 || c >= this.gridSize) break;
                if (board[r][c] !== player) break;
                count++;
            }
            
            // 反方向计数
            for (let i = 1; i < 5; i++) {
                const r = row - dr * i;
                const c = col - dc * i;
                if (r < 0 || r >= this.gridSize || c < 0 || c >= this.gridSize) break;
                if (board[r][c] !== player) break;
                count++;
            }
            
            if (count >= 5) {
                return true;
            }
        }
        
        return false;
    }
}
