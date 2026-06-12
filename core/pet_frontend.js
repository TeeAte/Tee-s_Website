export function getPetHTML() {
  return `
    <div id="pixel-pet-container" class="pixel-pet-container">
      <div class="pet-header">🐱 像素猫 (Lv.<span id="pet-level">1</span>)</div>
      <div class="pet-body">
        <pre id="pet-ascii" class="pet-ascii">
  /\\_/\\
 ( o.o )
  > ^ <
        </pre>
      </div>
      <div class="pet-stats">
        <div class="exp-bar">
          <div id="pet-exp-fill" class="exp-fill" style="width: 0%"></div>
        </div>
        <div class="exp-text">EXP: <span id="pet-exp">0</span> / Next: <span id="pet-next-exp">100</span></div>
      </div>
      <div class="pet-actions">
        <button onclick="interactPet('feed')" class="pet-btn">🐟 喂食</button>
        <button onclick="interactPet('play')" class="pet-btn">🧶 逗猫</button>
      </div>
    </div>
  `;
}

export function getPetCSS() {
  return `
    .pixel-pet-container { border: 2px solid var(--text); background: var(--bg2); width: 100%; max-width: 320px; box-shadow: 4px 4px 0 rgba(0,0,0,0.8); display: flex; flex-direction: column; margin: 0 auto 20px auto; }
    .pet-header { background: var(--text); color: var(--bg); padding: 5px 10px; font-weight: bold; text-align: center; border-bottom: 2px solid var(--text); }
    .pet-body { padding: 15px; text-align: center; background: var(--bg3); overflow: hidden; min-height: 80px; display: flex; align-items: center; justify-content: center;}
    .pet-ascii { font-family: 'Courier New', monospace; font-size: 16px; line-height: 1.2; margin: 0; display: inline-block; white-space: pre; font-weight: bold; }
    .pet-stats { padding: 10px; border-top: 1px dashed var(--border); border-bottom: 1px dashed var(--border); }
    .exp-bar { width: 100%; height: 12px; background: #000; border: 1px solid var(--border); position: relative; }
    .exp-fill { height: 100%; background: #0f0; width: 0%; transition: width 0.3s; box-shadow: inset 0 -3px 0 rgba(0,0,0,0.3); }
    .exp-text { font-size: 12px; text-align: right; margin-top: 5px; font-weight: bold; color: var(--text); }
    .pet-actions { display: flex; padding: 10px; gap: 10px; }
    .pet-btn { flex: 1; padding: 8px 5px; border: 2px solid var(--text); background: var(--btn-bg); cursor: pointer; font-family: inherit; font-weight: bold; box-shadow: inset 1px 1px 0 var(--btn-hi), inset -1px -1px 0 var(--btn-lo), 2px 2px 0 var(--text); color: var(--text); transition: transform 0.1s; }
    .pet-btn:active { box-shadow: inset 1px 1px 0 var(--btn-hi), inset -1px -1px 0 var(--btn-lo); transform: translate(2px, 2px); }
    
    @keyframes pet-jump {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
    @keyframes pet-eat {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1) rotate(5deg); }
    }
    @keyframes pet-shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-3px) rotate(-3deg); }
      75% { transform: translateX(3px) rotate(3deg); }
    }
    .anim-jump { animation: pet-jump 0.3s ease 2; }
    .anim-eat { animation: pet-eat 0.3s ease 2; }
    .anim-shake { animation: pet-shake 0.15s ease 3; }
  `;
}

export function getPetJS() {
  return `
    let isInteracting = false;
    const expressions = [
      "  /\\\\_/\\\\ \\n ( -.- )\\n  > ^ < ", // Blink
      "  /\\\\_/\\\\ \\n ( <.< )\\n  > ^ < ", // Look left
      "  /\\\\_/\\\\ \\n ( >.> )\\n  > ^ < ", // Look right
      "  /\\\\_/\\\\ \\n ( ^.^ )\\n  > ^ < ", // Happy
      "  /\\\\_/\\\\ \\n ( O.O )\\n  > ^ < ", // Surprised
      "  /\\\\_/\\\\ \\n ( -ω- )\\n  > ^ < "  // Sleepy
    ];

    function randomExpression() {
      if (isInteracting) return;
      const ascii = document.getElementById('pet-ascii');
      if (!ascii) return;
      
      // If there's a 40% chance, let's do a random expression
      if (Math.random() < 0.4) {
        const rand = expressions[Math.floor(Math.random() * expressions.length)];
        ascii.innerText = rand;
        
        // 30% chance to shake fur
        if (Math.random() < 0.3) {
          ascii.classList.add('anim-shake');
        }
        
        // Return to normal after a short time
        setTimeout(() => {
          if (!isInteracting) {
             ascii.innerText = "  /\\\\_/\\\\ \\n ( o.o )\\n  > ^ < ";
          }
          ascii.classList.remove('anim-shake');
        }, 800 + Math.random() * 1000); 
      }
    }

    async function loadPet() {
      try {
        const res = await fetch('/api/pet');
        if (res.ok) {
          const data = await res.json();
          updatePetUI(data.exp, data.level);
        }
      } catch (e) {}
    }

    function updatePetUI(exp, level) {
      document.getElementById('pet-level').innerText = level;
      document.getElementById('pet-exp').innerText = exp;
      
      const currentLevelBaseExp = (level - 1) * 100;
      const nextLevelExp = level * 100;
      document.getElementById('pet-next-exp').innerText = nextLevelExp;
      
      const progress = exp - currentLevelBaseExp;
      const percent = Math.min(100, Math.max(0, (progress / 100) * 100)) + '%';
      document.getElementById('pet-exp-fill').style.width = percent;
    }

    async function interactPet(action) {
      isInteracting = true;
      const ascii = document.getElementById('pet-ascii');
      ascii.classList.remove('anim-jump', 'anim-eat');
      void ascii.offsetWidth; // trigger reflow
      
      if (action === 'play') {
        ascii.classList.add('anim-jump');
        ascii.innerText = "  /\\\\_/\\\\ \\n ( ^.^ )\\n  > ^ < ";
      } else {
        ascii.classList.add('anim-eat');
        ascii.innerText = "  /\\\\_/\\\\ \\n ( >ω< )\\n  > ^ < ";
      }
      
      setTimeout(() => {
        ascii.innerText = "  /\\\\_/\\\\ \\n ( o.o )\\n  > ^ < ";
        isInteracting = false;
      }, 1000);

      try {
        const res = await fetch('/api/pet/action', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action })
        });
        if (res.ok) {
          const data = await res.json();
          updatePetUI(data.exp, data.level);
        }
      } catch (e) {}
    }

    document.addEventListener('DOMContentLoaded', loadPet);
    // Refresh pet state every 10 seconds
    setInterval(loadPet, 10000);
    // Try to trigger a random expression every 1.5 seconds
    setInterval(randomExpression, 1500);
  `;
}
