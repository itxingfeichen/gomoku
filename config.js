// 五子棋游戏配置文件

const GAME_CONFIG = {
  // GitHub 配置
  github: {
    // 从 localStorage 获取 token
    getToken: () => localStorage.getItem('github_token'),
    getRepo: () => localStorage.getItem('github_repo') || 'gomoku-stats',
    getBranch: () => localStorage.getItem('github_branch') || 'main',
    
    // 设置配置
    setToken: (token) => localStorage.setItem('github_token', token),
    setRepo: (repo) => localStorage.setItem('github_repo', repo),
    setBranch: (branch) => localStorage.setItem('github_branch', branch),
  },
  
  // 游戏配置
  game: {
    boardSize: 15,
    winCondition: 5,
    aiDelay: 500, // AI 思考延迟（毫秒）
  },
  
  // 难度配置
  difficulty: {
    easy: {
      name: '简单',
      emoji: '🌟',
      randomFactor: 50, // 随机性因子
    },
    medium: {
      name: '中等',
      emoji: '🌟🌟',
      randomFactor: 20,
    },
    hard: {
      name: '困难',
      emoji: '🌟🌟🌟',
      randomFactor: 5,
    },
  },
  
  // 统计配置
  stats: {
    storageKey: 'gomoku_stats',
  },
  
  // UI 配置
  ui: {
    cellSize: 40,
    stoneSize: 32,
    particleCount: 50,
  },
};

// 战绩统计类
class GameStats {
  constructor() {
    this.data = this.load();
  }
  
  load() {
    const stored = localStorage.getItem(GAME_CONFIG.stats.storageKey);
    return stored ? JSON.parse(stored) : {
      wins: 0,
      losses: 0,
      draws: 0,
      totalGames: 0,
      lastPlayed: null,
      winStreak: 0,
      bestWinStreak: 0,
    };
  }
  
  save() {
    localStorage.setItem(GAME_CONFIG.stats.storageKey, JSON.stringify(this.data));
  }
  
  record(result) {
    this.data.totalGames++;
    this.data.lastPlayed = new Date().toISOString();
    
    if (result === 'win') {
      this.data.wins++;
      this.data.winStreak++;
      if (this.data.winStreak > this.data.bestWinStreak) {
        this.data.bestWinStreak = this.data.winStreak;
      }
    } else if (result === 'loss') {
      this.data.losses++;
      this.data.winStreak = 0;
    } else {
      this.data.draws++;
    }
    
    this.save();
  }
  
  getWinRate() {
    if (this.data.totalGames === 0) return 0;
    return ((this.data.wins / this.data.totalGames) * 100).toFixed(1);
  }
  
  reset() {
    this.data = {
      wins: 0,
      losses: 0,
      draws: 0,
      totalGames: 0,
      lastPlayed: null,
      winStreak: 0,
      bestWinStreak: 0,
    };
    this.save();
  }
}

// GitHub API 工具类
class GitHubAPI {
  constructor() {
    this.token = GAME_CONFIG.github.getToken();
    this.repo = GAME_CONFIG.github.getRepo();
    this.branch = GAME_CONFIG.github.getBranch();
  }
  
  async checkConfig() {
    if (!this.token) {
      console.warn('⚠️ 未配置 GitHub Token');
      return false;
    }
    if (!this.repo) {
      console.warn('⚠️ 未配置 GitHub 仓库');
      return false;
    }
    return true;
  }
  
  async request(method, path, data = null) {
    const url = `https://api.github.com/${path}`;
    const headers = {
      'Authorization': `token ${this.token}`,
      'Content-Type': 'application/json',
    };
    
    const options = {
      method,
      headers,
    };
    
    if (data) {
      options.body = JSON.stringify(data);
    }
    
    try {
      const response = await fetch(url, options);
      return await response.json();
    } catch (error) {
      console.error('GitHub API 请求失败:', error);
      throw error;
    }
  }
  
  async getFile(path) {
    return await this.request('GET', `repos/${this.repo}/contents/${path}?ref=${this.branch}`);
  }
  
  async updateFile(path, content, message) {
    try {
      // 获取现有文件的 SHA
      let sha = null;
      try {
        const existing = await this.getFile(path);
        sha = existing.sha;
      } catch (e) {
        // 文件不存在，创建新文件
      }
      
      const data = {
        message,
        content: btoa(unescape(encodeURIComponent(content))),
        branch: this.branch,
      };
      
      if (sha) {
        data.sha = sha;
      }
      
      const result = await this.request('PUT', `repos/${this.repo}/contents/${path}`, data);
      console.log('✅ GitHub 提交成功:', result.commit.html_url);
      return result;
    } catch (error) {
      console.error('❌ GitHub 提交失败:', error);
      throw error;
    }
  }
  
  async submitGameResult(result, moves, duration) {
    const timestamp = new Date().toISOString();
    const stats = JSON.stringify({
      result,
      moves,
      duration,
      timestamp,
      difficulty: GAME_CONFIG.difficulty[document.getElementById('difficulty').value].name,
    }, null, 2);
    
    // 提交到 game-results 目录
    const fileName = `game-results/${timestamp.replace(/[:.]/g, '-')}.json`;
    return await this.updateFile(fileName, stats, `🎮 游戏结果：${result === 'win' ? '胜利' : result === 'loss' ? '失败' : '平局'}`);
  }
  
  async updateStats(stats) {
    const content = JSON.stringify(stats.data, null, 2);
    return await this.updateFile('stats.json', content, '📊 更新战绩统计');
  }
}

// 配置面板（按 C 键打开）
class ConfigPanel {
  constructor() {
    this.visible = false;
    this.setupKeyboard();
  }
  
  setupKeyboard() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'c' || e.key === 'C') {
        this.toggle();
      }
    });
  }
  
  toggle() {
    this.visible = !this.visible;
    if (this.visible) {
      this.show();
    } else {
      this.hide();
    }
  }
  
  show() {
    const panel = document.createElement('div');
    panel.id = 'configPanel';
    panel.innerHTML = `
      <div class="config-content">
        <h3>⚙️ GitHub 配置</h3>
        <div class="form-group">
          <label>Token:</label>
          <input type="password" id="githubToken" value="${GAME_CONFIG.github.getToken() || ''}" placeholder="GitHub Personal Access Token">
        </div>
        <div class="form-group">
          <label>仓库:</label>
          <input type="text" id="githubRepo" value="${GAME_CONFIG.github.getRepo()}" placeholder="username/repo">
        </div>
        <div class="form-group">
          <label>分支:</label>
          <input type="text" id="githubBranch" value="${GAME_CONFIG.github.getBranch()}" placeholder="main">
        </div>
        <div class="button-group">
          <button onclick="configPanel.save()">💾 保存</button>
          <button onclick="configPanel.test()">🧪 测试连接</button>
          <button onclick="configPanel.hide()">✖️ 关闭</button>
        </div>
        <div id="configStatus"></div>
      </div>
    `;
    document.body.appendChild(panel);
  }
  
  hide() {
    const panel = document.getElementById('configPanel');
    if (panel) {
      panel.remove();
    }
    this.visible = false;
  }
  
  save() {
    const token = document.getElementById('githubToken').value;
    const repo = document.getElementById('githubRepo').value;
    const branch = document.getElementById('githubBranch').value;
    
    GAME_CONFIG.github.setToken(token);
    GAME_CONFIG.github.setRepo(repo);
    GAME_CONFIG.github.setBranch(branch);
    
    this.showStatus('✅ 配置已保存', 'success');
  }
  
  async test() {
    const status = document.getElementById('configStatus');
    status.textContent = '🔄 测试连接中...';
    
    const github = new GitHubAPI();
    try {
      await github.getFile('README.md');
      this.showStatus('✅ 连接成功！', 'success');
    } catch (error) {
      this.showStatus('❌ 连接失败：' + error.message, 'error');
    }
  }
  
  showStatus(message, type) {
    const status = document.getElementById('configStatus');
    status.textContent = message;
    status.className = `status ${type}`;
  }
}

// 全局实例
const gameStats = new GameStats();
const configPanel = new ConfigPanel();

// 导出到全局
window.GAME_CONFIG = GAME_CONFIG;
window.GameStats = GameStats;
window.GitHubAPI = GitHubAPI;
window.configPanel = configPanel;
window.gameStats = gameStats;
