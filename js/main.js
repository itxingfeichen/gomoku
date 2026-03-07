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
    modeSelect.addEventListener('change', (e) => {
        game.setMode(e.target.value);
    });
    
    // 重新开始按钮
    const restartBtn = document.getElementById('restartBtn');
    restartBtn.addEventListener('click', () => {
        game.restart();
    });
    
    // 响应式调整
    const boardContainer = document.querySelector('.board-container');
    const resizeObserver = new ResizeObserver(() => {
        board.resize(boardContainer.offsetWidth);
    });
    resizeObserver.observe(boardContainer);
    
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
            modeSelect.value = newMode;
            game.setMode(newMode);
        }
    });
    
    // 初始状态
    console.log('🎮 五子棋游戏已加载');
    console.log('快捷键：R-重新开始，U-悔棋，M-切换模式');
});
