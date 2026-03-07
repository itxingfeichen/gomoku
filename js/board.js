/**
 * 棋盘模块 - 负责棋盘的绘制和交互
 */
class Board {
    constructor(canvasId, gridSize = 15, cellSize = 40) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.gridSize = gridSize;  // 15x15 棋盘
        this.cellSize = cellSize;  // 每个格子的大小
        this.padding = cellSize;   // 棋盘边缘留白
        
        // 设置画布大小
        const size = gridSize * cellSize + 2 * this.padding;
        this.canvas.width = size;
        this.canvas.height = size;
        
        // 棋盘状态：0=空，1=黑，2=白
        this.board = [];
        this.init();
        
        // 绑定点击事件
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
        this.clickHandler = null;  // 外部点击处理函数
    }
    
    /**
     * 初始化棋盘
     */
    init() {
        this.board = Array(this.gridSize).fill(null).map(() => 
            Array(this.gridSize).fill(0)
        );
        this.draw();
    }
    
    /**
     * 绘制整个棋盘
     */
    draw() {
        // 清空画布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制背景
        this.ctx.fillStyle = '#dcb35c';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制网格线
        this.drawGrid();
        
        // 绘制星位点（天元和四个角星）
        this.drawStarPoints();
        
        // 绘制棋子
        this.drawPieces();
    }
    
    /**
     * 绘制网格线
     */
    drawGrid() {
        this.ctx.strokeStyle = '#5d4037';
        this.ctx.lineWidth = 1;
        
        for (let i = 0; i < this.gridSize; i++) {
            const pos = this.padding + i * this.cellSize;
            
            // 横线
            this.ctx.beginPath();
            this.ctx.moveTo(this.padding, pos);
            this.ctx.lineTo(this.canvas.width - this.padding, pos);
            this.ctx.stroke();
            
            // 竖线
            this.ctx.beginPath();
            this.ctx.moveTo(pos, this.padding);
            this.ctx.lineTo(pos, this.canvas.height - this.padding);
            this.ctx.stroke();
        }
    }
    
    /**
     * 绘制星位点
     */
    drawStarPoints() {
        const stars = [
            [3, 3], [3, 11], [11, 3], [11, 11],  // 四个角星
            [7, 7]  // 天元
        ];
        
        this.ctx.fillStyle = '#5d4037';
        stars.forEach(([row, col]) => {
            const x = this.padding + col * this.cellSize;
            const y = this.padding + row * this.cellSize;
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, 4, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }
    
    /**
     * 绘制所有棋子
     */
    drawPieces() {
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                if (this.board[row][col] !== 0) {
                    this.drawPiece(row, col, this.board[row][col]);
                }
            }
        }
    }
    
    /**
     * 绘制单个棋子
     */
    drawPiece(row, col, player) {
        const x = this.padding + col * this.cellSize;
        const y = this.padding + row * this.cellSize;
        const radius = this.cellSize * 0.4;
        
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        
        // 创建渐变效果，使棋子更有立体感
        const gradient = this.ctx.createRadialGradient(
            x - radius/3, y - radius/3, radius/10,
            x, y, radius
        );
        
        if (player === 1) {
            // 黑棋
            gradient.addColorStop(0, '#666');
            gradient.addColorStop(1, '#000');
        } else {
            // 白棋
            gradient.addColorStop(0, '#fff');
            gradient.addColorStop(1, '#ccc');
        }
        
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
        
        // 添加阴影
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        this.ctx.shadowBlur = 3;
        this.ctx.shadowOffsetX = 2;
        this.ctx.shadowOffsetY = 2;
        this.ctx.fill();
        
        // 重置阴影
        this.ctx.shadowColor = 'transparent';
        this.ctx.shadowBlur = 0;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;
    }
    
    /**
     * 处理点击事件
     */
    handleClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;
        
        // 计算点击的格子位置
        const col = Math.round((x - this.padding) / this.cellSize);
        const row = Math.round((y - this.padding) / this.cellSize);
        
        // 检查是否在有效范围内
        if (row >= 0 && row < this.gridSize && col >= 0 && col < this.gridSize) {
            // 检查该位置是否为空
            if (this.board[row][col] === 0 && this.clickHandler) {
                this.clickHandler(row, col);
            }
        }
    }
    
    /**
     * 设置点击处理函数
     */
    setClickHandler(handler) {
        this.clickHandler = handler;
    }
    
    /**
     * 在指定位置落子
     */
    placePiece(row, col, player) {
        if (this.board[row][col] === 0) {
            this.board[row][col] = player;
            this.drawPiece(row, col, player);
            return true;
        }
        return false;
    }
    
    /**
     * 获取棋盘状态
     */
    getBoard() {
        return this.board.map(row => [...row]);
    }
    
    /**
     * 检查位置是否为空
     */
    isEmpty(row, col) {
        return this.board[row][col] === 0;
    }
    
    /**
     * 重置棋盘
     */
    reset() {
        this.init();
    }
    
    /**
     * 适配移动端 - 根据容器大小调整棋盘
     */
    resize(containerWidth) {
        const maxSize = Math.min(containerWidth - 40, 600);
        const newCellSize = Math.floor((maxSize - 2 * this.padding) / this.gridSize);
        
        if (newCellSize > 0 && newCellSize !== this.cellSize) {
            this.cellSize = newCellSize;
            const size = this.gridSize * this.cellSize + 2 * this.padding;
            this.canvas.width = size;
            this.canvas.height = size;
            this.draw();
        }
    }
}
