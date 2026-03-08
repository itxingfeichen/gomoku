/**
 * 主逻辑入口 - 初始化游戏和绑定事件
 */
document.addEventListener('DOMContentLoaded', () => {
    // 初始化游戏组件
    const board = new Board('board');
    const ai = new AI(board);
    const game = new Game(board, ai);
    
    // 游戏模式选择
    const modeSelect = document.getElementById('gameMode');
    if (modeSelect) {
        modeSelect.addEventListener('change', (e) => {
            game.setMode(e.target.value);
        });
    }
    
    // 难度选择（仅 PVE 模式）
    const difficultySelect = document.getElementById('difficulty');
    const difficultyGroup = document.getElementById('difficultyGroup');
    
    function updateModeUI() {
        if (game.gameMode === 'pvp' && difficultyGroup) {
            difficultyGroup.style.display = 'none';
        } else if (difficultyGroup) {
            difficultyGroup.style.display = 'flex';
        }
    }
    
    if (modeSelect) {
        modeSelect.addEventListener('change', updateModeUI);
    }
    updateModeUI();
    
    // 重新开始按钮
    const restartBtn = document.getElementById('restartBtn');
    if (restartBtn) {
        restartBtn.addEventListener('click', () => {
            game.restart();
        });
    }
    
    // 响应式调整
    const boardContainer = document.querySelector('.board-container');
    if (boardContainer) {
        const resizeObserver = new ResizeObserver(() => {
            board.resize(boardContainer.offsetWidth);
        });
        resizeObserver.observe(boardContainer);
    }
    
    // 键盘快捷键
    document.addEventListener('keydown', (e) => {
        // R 键重新开始
        if (e.key === 'r' || e.key === 'R') {
            game.restart();
        }
        // U 键悔棋
        if (e.key === 'u' || e.key === 'U') {
            game.undo();
        }
        // M 键切换模式
        if (e.key === 'm' || e.key === 'M') {
            const newMode = game.gameMode === 'pve' ? 'pvp' : 'pve';
            if (modeSelect) {
                modeSelect.value = newMode;
            }
            game.setMode(newMode);
            updateModeUI();
        }
    });
    
    // 初始状态
    console.log('🎮 五子棋游戏已加载');
    console.log('🎯 模式：', game.gameMode === 'pve' ? '人机对战' : '双人对战');
    console.log('快捷键：R-重新开始，U-悔棋，M-切换模式');
});
