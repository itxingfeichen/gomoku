/**
 * 游戏逻辑模块 - 负责游戏状态管理和胜负判断
 */
class Game {
    constructor(board, ai) {
        this.board = board;
        this.ai = ai;
        this.currentPlayer = 1;  // 1=黑棋，2=白棋
        this.gameMode = 'pve';   // 'pvp'=双人，'pve'=人机
        this.gameOver = false;
        this.moveHistory = [];
        
        // 状态显示元素
        this.currentPlayerEl = document.getElementById('currentPlayer');
        this.gameStatusEl = document.getElementById('gameStatus');
        
        // 绑定棋盘点击事件
        this.board.setClickHandler((row, col) => this.handleMove(row, col));
    }
    
    /**
     * 处理玩家落子
     */
    handleMove(row, col) {
        if (this.gameOver) return;
        
        // 人机模式下，只有黑棋（玩家）可以落子
        if (this.gameMode === 'pve' && this.currentPlayer !== 1) {
            return;
        }
        
        // 落子
        if (this.board.placePiece(row, col, this.currentPlayer)) {
            this.moveHistory.push({ row, col, player: this.currentPlayer });
            
            // 检查是否获胜
            const boardState = this.board.getBoard();
            if (this.checkWin(row, col, this.currentPlayer)) {
                this.endGame(this.currentPlayer);
                return;
            }
            
            // 检查是否平局
            if (this.isBoardFull()) {
                this.endGame(0);
                return;
            }
            
            // 切换玩家
            this.switchPlayer();
            
            // 人机模式下，AI 自动落子
            if (this.gameMode === 'pve' && !this.gameOver) {
                setTimeout(() => this.aiMove(), 300);
            }
        }
    }
    
    /**
     * AI 落子
     */
    aiMove() {
        if (this.gameOver) return;
        
        const move = this.ai.getBestMove();
        if (move) {
            this.board.placePiece(move.row, move.col, this.currentPlayer);
            this.moveHistory.push({ row: move.row, col: move.col, player: this.currentPlayer });
            
            // 检查是否获胜
            const boardState = this.board.getBoard();
            if (this.checkWin(move.row, move.col, this.currentPlayer)) {
                this.endGame(this.currentPlayer);
                return;
            }
            
            // 检查是否平局
            if (this.isBoardFull()) {
                this.endGame(0);
                return;
            }
            
            // 切换玩家
            this.switchPlayer();
        }
    }
    
    /**
     * 切换当前玩家
     */
    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
        this.updateStatus();
    }
    
    /**
     * 更新状态显示
     */
    updateStatus() {
        const playerName = this.currentPlayer === 1 ? '黑棋' : '白棋';
        this.currentPlayerEl.textContent = `当前：${playerName}`;
        this.currentPlayerEl.style.color = this.currentPlayer === 1 ? '#000' : '#666';
    }
    
    /**
     * 检查是否获胜
     */
    checkWin(row, col, player) {
        const board = this.board.getBoard();
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
                if (r < 0 || r >= 15 || c < 0 || c >= 15) break;
                if (board[r][c] !== player) break;
                count++;
            }
            
            // 反方向计数
            for (let i = 1; i < 5; i++) {
                const r = row - dr * i;
                const c = col - dc * i;
                if (r < 0 || r >= 15 || c < 0 || c >= 15) break;
                if (board[r][c] !== player) break;
                count++;
            }
            
            if (count >= 5) {
                return true;
            }
        }
        
        return false;
    }
    
    /**
     * 检查棋盘是否已满
     */
    isBoardFull() {
        const board = this.board.getBoard();
        for (let row = 0; row < 15; row++) {
            for (let col = 0; col < 15; col++) {
                if (board[row][col] === 0) return false;
            }
        }
        return true;
    }
    
    /**
     * 结束游戏
     */
    endGame(winner) {
        this.gameOver = true;
        
        if (winner === 0) {
            this.gameStatusEl.textContent = '🤝 平局！';
        } else {
            const winnerName = winner === 1 ? '黑棋' : '白棋';
            const playerText = this.gameMode === 'pve' && winner === 2 ? 'AI' : winnerName;
            this.gameStatusEl.textContent = `🎉 ${playerText} 获胜！`;
        }
    }
    
    /**
     * 重新开始游戏
     */
    restart() {
        this.board.reset();
        this.currentPlayer = 1;
        this.gameOver = false;
        this.moveHistory = [];
        this.gameStatusEl.textContent = '';
        this.updateStatus();
    }
    
    /**
     * 设置游戏模式
     */
    setMode(mode) {
        this.gameMode = mode;
        this.restart();
    }
    
    /**
     * 获取当前游戏状态
     */
    getState() {
        return {
            currentPlayer: this.currentPlayer,
            gameMode: this.gameMode,
            gameOver: this.gameOver,
            moveHistory: [...this.moveHistory]
        };
    }
    
    /**
     * 悔棋（可选功能）
     */
    undo() {
        if (this.moveHistory.length === 0 || this.gameOver) return;
        
        // 人机模式下，需要撤销两步（玩家和 AI）
        const steps = this.gameMode === 'pve' ? 2 : 1;
        
        for (let i = 0; i < steps && this.moveHistory.length > 0; i++) {
            const lastMove = this.moveHistory.pop();
            this.board.board[lastMove.row][lastMove.col] = 0;
        }
        
        // 重新绘制棋盘
        this.board.draw();
        
        // 切换回上一个玩家
        this.switchPlayer();
        this.gameOver = false;
        this.gameStatusEl.textContent = '';
    }
}
