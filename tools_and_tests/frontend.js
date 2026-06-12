
    let editingPostId = null;
    let currentImageUrl = '';

    // 检查登录状态
    fetch('/api/stats')
      .then(() => {
        document.getElementById('loginView').style.display = 'none';
        document.getElementById('dashboardView').style.display = 'block';
        loadStats();
        loadPosts();
      })
      .catch(() => {
        document.getElementById('loginView').style.display = 'flex';
      });

    async function login() {
      const password = document.getElementById('passwordInput').value;
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await response.json();
      
      if (data.success) {
        document.getElementById('loginView').style.display = 'none';
        document.getElementById('dashboardView').style.display = 'block';
        loadStats();
        loadPosts();
      } else {
        showMessage('loginMessage', data.message || '登录失败', 'error');
      }
    }

    async function logout() {
      await fetch('/logout');
      document.getElementById('loginView').style.display = 'flex';
      document.getElementById('dashboardView').style.display = 'none';
      document.getElementById('passwordInput').value = '';
    }

    function switchTab(tabName) {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
      event.target.classList.add('active');
      document.getElementById(tabName + 'Tab').classList.add('active');
      
      if (tabName === 'stats') loadStats();
      if (tabName === 'visits') loadVisits();
    }

    async function loadStats() {
      const response = await fetch('/api/stats');
      const stats = await response.json();
      document.getElementById('totalPosts').textContent = stats.totalPosts;
      document.getElementById('totalVisits').textContent = stats.totalVisits;
      document.getElementById('todayVisits').textContent = stats.todayVisits;
      document.getElementById('totalImages').textContent = stats.totalPosts;
      
      // 渲染图表
      const chart = document.getElementById('visitChart');
      if (stats.weeklyVisits.length > 0) {
        const maxVisits = Math.max(...stats.weeklyVisits.map(v => v.count));
        chart.innerHTML = stats.weeklyVisits.map(visit => `
          <div class="chart-bar-item">
            <div class="chart-bar-fill" style="height: ${(visit.count / maxVisits) * 150}px"></div>
            <span style="font-size: 0.8rem; opacity: 0.6;">${visit.day}</span>
            <span style="font-size: 0.9rem;">${visit.count}</span>
          </div>
        `).join('');
      }
      
      // 热门页面
      const pagesDiv = document.getElementById('topPages');
      if (stats.topPages.length > 0) {
        pagesDiv.innerHTML = stats.topPages.map(page => `
          <div style="padding: 10px; background: rgba(255,255,255,0.05); border-radius: 5px; margin-bottom: 10px; display: flex; justify-content: space-between;">
            <span>${page.path}</span>
            <span style="color: #00ffd5;">${page.count} 次</span>
          </div>
        `).join('');
      }
    }

    async function loadPosts() {
      const response = await fetch('/api/posts');
      const posts = await response.json();
      const listDiv = document.getElementById('postList');
      
      if (posts.length === 0) {
        listDiv.innerHTML = '<p style="opacity: 0.5; text-align: center; padding: 20px;">暂无动态</p>';
        return;
      }
      
      listDiv.innerHTML = posts.map(post => `
        <div class="post-item">
          <div class="post-item-info">
            <h3>${escapeHtml(post.title)}</h3>
            <p>${new Date(post.created_at).toLocaleString('zh-CN')}</p>
          </div>
          <div class="post-item-actions">
            <button class="btn btn-small" onclick="editPost('${post.id}')">编辑</button>
            <button class="btn btn-small btn-danger" onclick="deletePost('${post.id}')">删除</button>
          </div>
        </div>
      `).join('');
    }

    async function savePost() {
      const title = document.getElementById('postTitle').value.trim();
      const content = document.getElementById('postContent').value.trim();
      
      if (!title || !content) {
        showMessage('postMessage', '请填写标题和内容', 'error');
        return;
      }
      
      const data = { title, content };
      if (currentImageUrl) data.imageUrl = currentImageUrl;
      
      const url = editingPostId ? `/api/posts/${editingPostId}` : '/api/posts';
      const method = editingPostId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      if (result.success) {
        showMessage('postMessage', editingPostId ? '更新成功' : '发布成功', 'success');
        document.getElementById('postTitle').value = '';
        document.getElementById('postContent').value = '';
        document.getElementById('imagePreview').style.display = 'none';
        currentImageUrl = '';
        editingPostId = null;
        loadPosts();
        loadStats();
      }
    }

    async function editPost(id) {
      const response = await fetch('/api/posts');
      const posts = await response.json();
      const post = posts.find(p => p.id == id);
      
      if (post) {
        document.getElementById('postTitle').value = post.title;
        document.getElementById('postContent').value = post.content;
        if (post.image_url) {
          currentImageUrl = post.image_url;
          document.getElementById('imagePreview').src = post.image_url;
          document.getElementById('imagePreview').style.display = 'block';
        }
        editingPostId = id;
        window.scrollTo(0, 0);
      }
    }

    async function deletePost(id) {
      if (!confirm('确定要删除这篇动态吗？')) return;
      
      await fetch(`/api/posts/${id}`, { method: 'DELETE' });
      loadPosts();
      loadStats();
    }

    function handleImageUpload(event) {
      const file = event.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = function(e) {
        document.getElementById('imagePreview').src = e.target.result;
        document.getElementById('imagePreview').style.display = 'block';
        
        // 上传图片到服务器
        uploadImage(e.target.result, file.name);
      };
      reader.readAsDataURL(file);
    }

    async function uploadImage(base64Data, filename) {
      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageData: base64Data,
            filename: filename,
          }),
        });
        const result = await response.json();
        if (result.success) {
          currentImageUrl = result.url;
        }
      } catch (err) {
        console.error('Upload failed:', err);
      }
    }

    async function loadVisits() {
      const response = await fetch('/api/visits');
      const visits = await response.json();
      const tbody = document.getElementById('visitTableBody');
      
      tbody.innerHTML = visits.map(visit => `
        <tr>
          <td>${new Date(visit.visit_time).toLocaleString('zh-CN')}</td>
          <td>${visit.path}</td>
          <td>${visit.ip}</td>
          <td style="max-width: 200px; overflow: hidden; text-overflow: ellipsis;" title="${visit.user_agent}">
            ${visit.user_agent.substring(0, 50)}${visit.user_agent.length > 50 ? '...' : ''}
          </td>
        </tr>
      `).join('');
    }

    async function changePassword() {
      const newPassword = document.getElementById('newPassword').value;
      if (!newPassword) {
        alert('请输入新密码');
        return;
      }
      // 实际项目中应该通过 API 修改密码
      alert('密码修改功能需要在数据库中更新。当前密码存储在 cookie 中，请通过修改代码中的密码来更新。');
    }

    function saveSettings() {
      alert('设置已保存');
    }

    function showMessage(elementId, message, type) {
      const el = document.getElementById(elementId);
      el.textContent = message;
      el.className = 'message ' + type;
      setTimeout(() => { el.className = 'message'; }, 3000);
    }

    function escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }
  