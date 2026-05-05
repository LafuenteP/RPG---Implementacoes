const supabaseUrl = 'https://yedmpjcllgnluyrbietf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllZG1wamNsbGdubHV5cmJpZXRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5ODYxMjksImV4cCI6MjA5MzU2MjEyOX0.EigaV6Q-2RJUS0zbSCu-A88ZW6f3Qg5LR5n5Tgu_2Bg';
const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);

let stateGlobais = {
  pcNos: { 1: false, 2: false, 3: false },
  camerasMortas: []
};

// --- ESTADO DO TIMER GLOBAL ---
let timerState = {
  isPaused: true,
  nextEventTime: 0,
  timeRemainingForNextEvent: 120000, // 2 minutos até o primeiro evento
  activeEvent: null 
};

document.addEventListener("DOMContentLoaded", async () => {
  const btnNodes = document.querySelectorAll('[data-node]');
  const btnCams = document.querySelectorAll('[data-cam]');
  const btnReset = document.getElementById('btn-reset-all');
  const toastContainer = document.getElementById('toast-container');

  // Função simples de toast
  const showToast = (title, message) => {
    const toast = document.createElement('div');
    toast.className = `toast toast-success`;
    toast.innerHTML = `
      <div class="toast-content">
        <span class="toast-title">${title}</span>
        <span class="toast-msg">${message}</span>
      </div>
    `;
    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  };

  const renderUI = () => {
    // Nós
    btnNodes.forEach(btn => {
      const id = parseInt(btn.dataset.node);
      const isOnline = stateGlobais.pcNos[id];
      const badge = document.getElementById(`badge-node-${id}`);
      
      if (isOnline) {
        btn.classList.add('active');
        btn.classList.remove('inactive');
        badge.innerText = 'ONLINE';
      } else {
        btn.classList.add('inactive');
        btn.classList.remove('active');
        badge.innerText = 'OFFLINE';
      }
    });

    // Câmeras
    btnCams.forEach(btn => {
      const id = parseInt(btn.dataset.cam);
      const isDead = stateGlobais.camerasMortas.includes(id);
      const badge = document.getElementById(`badge-cam-${id}`);
      
      if (isDead) {
        btn.classList.add('inactive');
        btn.classList.remove('active');
        badge.innerText = 'SINAL PERDIDO';
      } else {
        btn.classList.add('active');
        btn.classList.remove('inactive');
        badge.innerText = 'ONLINE';
      }
    });
  };

  const loadData = async () => {
    // Carrega dados da UI Principal (Nós e Câmeras)
    const { data: data1 } = await supabaseClient.from('game_state').select('*').eq('id', 1).single();
    if (data1) {
      if (data1.pc_nos_restaurados) stateGlobais.pcNos = data1.pc_nos_restaurados;
      if (data1.agent_cameras_mortas) stateGlobais.camerasMortas = data1.agent_cameras_mortas;
      renderUI();
    }

    // Carrega dados do Timer Global (id 2)
    const { data: data2 } = await supabaseClient.from('game_state').select('*').eq('id', 2).single();
    if (data2 && data2.rpg_survival_state) {
      timerState = data2.rpg_survival_state;
    } else {
      // Se não existir, tenta criar a linha com upsert
      await supabaseClient.from('game_state').upsert({ id: 2, rpg_survival_state: timerState });
    }
    updateTimerUI();
  };

  const updateNos = async () => {
    await supabaseClient.from('game_state').update({ pc_nos_restaurados: stateGlobais.pcNos }).eq('id', 1);
    showToast('SUCESSO', 'Nós do PC atualizados.');
  };

  const updateCameras = async () => {
    await supabaseClient.from('game_state').update({ agent_cameras_mortas: stateGlobais.camerasMortas }).eq('id', 1);
    showToast('SUCESSO', 'Status das câmeras atualizado.');
  };

  // Event Listeners
  btnNodes.forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = parseInt(btn.dataset.node);
      stateGlobais.pcNos[id] = !stateGlobais.pcNos[id]; // Toggle
      renderUI();
      await updateNos();
    });
  });

  btnCams.forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = parseInt(btn.dataset.cam);
      if (stateGlobais.camerasMortas.includes(id)) {
        // Remove from dead cameras
        stateGlobais.camerasMortas = stateGlobais.camerasMortas.filter(camId => camId !== id);
      } else {
        // Add to dead cameras
        stateGlobais.camerasMortas.push(id);
      }
      renderUI();
      await updateCameras();
    });
  });

  btnReset.addEventListener('click', async () => {
    if (confirm("ATENÇÃO: Isso vai resetar todas as câmeras para ONLINE e bloquear todos os Nós do PC. O timer também será reiniciado. Continuar?")) {
      stateGlobais.pcNos = { 1: false, 2: false, 3: false };
      stateGlobais.camerasMortas = [];
      renderUI();
      await supabaseClient.from('game_state').update({
        pc_nos_restaurados: stateGlobais.pcNos,
        agent_cameras_mortas: stateGlobais.camerasMortas
      }).eq('id', 1);

      // Reseta Timer
      timerState = {
        isPaused: true,
        nextEventTime: 0,
        timeRemainingForNextEvent: 120000,
        activeEvent: null 
      };
      await supabaseClient.from('game_state').upsert({ id: 2, rpg_survival_state: timerState });
      updateTimerUI();

      showToast('RESET COMPLETO', 'Campanha reiniciada com sucesso.');
    }
  });

  // Realtime Sync para id=1
  supabaseClient
    .channel('game_state_changes_mestre')
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'game_state', filter: 'id=eq.1' }, payload => {
      const newData = payload.new;
      let changed = false;
      if (newData.pc_nos_restaurados) {
        stateGlobais.pcNos = newData.pc_nos_restaurados;
        changed = true;
      }
      if (newData.agent_cameras_mortas) {
        stateGlobais.camerasMortas = newData.agent_cameras_mortas;
        changed = true;
      }
      if (changed) renderUI();
    })
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'game_state', filter: 'id=eq.2' }, payload => {
      if (payload.new && payload.new.rpg_survival_state) {
        timerState = payload.new.rpg_survival_state;
        updateTimerUI();
      }
    })
    .subscribe();

  // --- LÓGICA DO TIMER GLOBAL ---
  const btnToggleTimer = document.getElementById('btn-toggle-timer');
  const timerStatus = document.getElementById('timer-status');
  const timerCountdown = document.getElementById('timer-countdown');

  const saveTimerState = async () => {
    await supabaseClient.from('game_state').upsert({ id: 2, rpg_survival_state: timerState });
  };

  const updateTimerUI = () => {
    if (timerState.isPaused) {
      timerStatus.innerText = "PAUSADO";
      timerStatus.style.color = "#ffeb3b";
      btnToggleTimer.innerHTML = "▶ INICIAR TEMPO";
      btnToggleTimer.className = "btn btn-primary";
      timerCountdown.style.display = "none";
    } else {
      timerStatus.innerText = "RODANDO";
      timerStatus.style.color = "#33ff00";
      btnToggleTimer.innerHTML = "⏸ PAUSAR TEMPO";
      btnToggleTimer.className = "btn btn-danger";
      timerCountdown.style.display = "block";
    }
  };

  btnToggleTimer.addEventListener('click', async () => {
    if (timerState.isPaused) {
      // INICIAR
      timerState.isPaused = false;
      if (timerState.activeEvent) {
        timerState.activeEvent.deadline = Date.now() + timerState.activeEvent.timeRemainingForAssimilation;
      } else {
        timerState.nextEventTime = Date.now() + timerState.timeRemainingForNextEvent;
      }
    } else {
      // PAUSAR
      timerState.isPaused = true;
      if (timerState.activeEvent) {
        timerState.activeEvent.timeRemainingForAssimilation = Math.max(0, timerState.activeEvent.deadline - Date.now());
      } else {
        timerState.timeRemainingForNextEvent = Math.max(0, timerState.nextEventTime - Date.now());
      }
    }
    updateTimerUI();
    await saveTimerState();
  });

  const btnForceEvent = document.getElementById('btn-force-event');
  btnForceEvent.addEventListener('click', async () => {
    if (timerState.isPaused) {
      alert("Inicie o tempo primeiro!");
      return;
    }
    if (timerState.activeEvent) {
      alert("Já existe uma assimilação em andamento!");
      return;
    }
    // Força o nextEventTime para AGORA
    timerState.nextEventTime = Date.now();
    await saveTimerState();
    showToast('EVENTO FORÇADO', 'A assimilação vai começar no próximo segundo.');
  });

  // Loop visual a cada 1 segundo (só para atualizar a contagem no painel do mestre)
  setInterval(() => {
    if (timerState.isPaused) return;

    if (timerState.activeEvent) {
      const remaining = Math.max(0, timerState.activeEvent.deadline - Date.now());
      timerCountdown.innerText = `ASSIMILANDO... ${Math.ceil(remaining/1000)}s`;
      timerCountdown.style.color = "#ff3333";
    } else {
      const remaining = Math.max(0, timerState.nextEventTime - Date.now());
      const min = Math.floor(remaining / 60000);
      const sec = Math.floor((remaining % 60000) / 1000);
      timerCountdown.innerText = `PRÓX. ATAQUE EM: ${min}:${sec < 10 ? '0' : ''}${sec}`;
      timerCountdown.style.color = "#33ff00";
    }
  }, 1000);

  // --- EVENTOS E GERADORES ---

  const eventResult = document.getElementById('event-result');
  const eventTitle = document.getElementById('event-title');
  const eventDesc = document.getElementById('event-desc');

  // Tabelas
  const eventosAcampamento = [
    { num: 1, title: "Falha na Realidade (Energia)", desc: "O ar estala e a fogueira apaga. Tudo que é elétrico dá choque.", efeito: "Todos sofrem 1d4 de dano de Energia. Se não tiverem Abrigo Improvisado, perdem 1 PS pela comida que estraga." },
    { num: 2, title: "A Selva Tem Fome", desc: "Animais pequenos e bizarros invadem os suprimentos.", efeito: "O grupo perde 1d4 PS." },
    { num: 3, title: "Pesadelo Geométrico (Conhecimento)", desc: "Durante o sono, a mente de todos é invadida por fractais.", efeito: "Teste de Vontade (DT 15). Falha = perdem 1d4 de Sanidade e acordam Fatigados." },
    { num: 4, title: "Surto de uma Âncora", desc: "O peso da situação esmaga um dos NPCs.", efeito: "Gastar Ação e passar em Diplomacia/Intimidação. Falha = NPC some por 1 dia." },
    { num: 5, title: "Sussurros Pessoais", desc: "Do meio das árvores escuras, ouvem vozes queridas.", efeito: "Teste de Vontade (DT 15). Falha = 1d6 de dano e acorda com cortes." },
    { num: 6, title: "Chuva Ácida Leve", desc: "Uma nuvem tóxica passa por cima.", efeito: "Se não houver abrigo, todos sofrem 1d4 de dano Químico/Ácido." },
    { num: 7, title: "A Maré Traz o Passado", desc: "Uma mala do avião é encontrada na areia.", efeito: "Encontram 1 item útil e roupas limpas (+1 em testes sociais)." },
    { num: 8, title: "Frio Antinatural", desc: "A temperatura cai absurdamente em um raio de 10 metros.", efeito: "Requer queimar +1 PS para manter o grupo aquecido." },
    { num: 9, title: "O Drone Vigia", desc: "Uma luz vermelha cruza o céu silenciosamente.", efeito: "Aumenta a tensão, mas sabem que alguém monitora a ilha." },
    { num: 10, title: "Ferida Infeccionada", desc: "Um corte começa a cheirar a ozônio.", efeito: "O alvo fica Fraco até alguém passar em Medicina (DT 15)." },
    { num: 11, title: "Vultos na Arrebentação", desc: "Figuras familiares em pé na água do mar.", efeito: "Perda de 1 de Sanidade, mas ganham pista enigmática." },
    { num: 12, title: "O Rádio Chia", desc: "Um rádio capta um sinal fraco de socorro.", efeito: "Recuperam 1d4 de Sanidade por saberem que não estão sozinhos." },
    { num: 13, title: "Cardume Morto", desc: "Dezenas de peixes mortos com escamas douradas.", efeito: "Teste de Fortitude. Sucesso = +3 PS. Falha = Envenenado." },
    { num: 14, title: "Momento de Desabafo", desc: "A tensão cede por uma hora. Um NPC conta uma história.", efeito: "Todos recuperam 1d4 de Sanidade e 2 PV." },
    { num: 15, title: "Brisa Curativa", desc: "A membrana tenta impor ordem sobre a carne.", efeito: "Todos recuperam 1d8 PV misteriosamente." },
    { num: 16, title: "Rastro Fresco", desc: "Pegadas humanas frescas em direção à selva.", efeito: "Ganham +5 no próximo teste de Trilha." },
    { num: 17, title: "Frutas Exóticas", desc: "Frutas pulsando luz fraca.", efeito: "Rende +1d4+1 PS e não têm efeitos colaterais." },
    { num: 18, title: "A Caixa Selada", desc: "Uma caixa médica da Panaceia boia até a praia.", efeito: "Contém 1 Cicatrizante e bandagens (+5 em Medicina)." },
    { num: 19, title: "Clima Perfeito", desc: "A Membrana estabiliza temporariamente.", efeito: "Dormir restaura PV e Sanidade totalmente." },
    { num: 20, title: "Sinalizador Perdido", desc: "Esqueleto segurando maleta de metal.", efeito: "Ganham 1 Sinalizador e 2 PS." }
  ];

  const eventosTrilha = [
    { min: -99, max: 0, title: "Anomalia Extrema (Loop)", desc: "Vocês entram em um paradoxo espacial.", efeito: "Perdem metade do dia, sofrem 1d6 Sanidade e gastam 1 PS extra." },
    { min: 1, max: 4, title: "Armadilha da Panaceia", desc: "Fio de tropeço aciona dardo ou explosivo.", efeito: "Reflexos (DT 20). Falha = 2d6 dano e fica Lento." },
    { min: 5, max: 8, title: "Predador Modificado", desc: "Animal com pele cristalizada ataca.", efeito: "Inicia Combate Rápido. Criatura foge se perder metade da vida." },
    { min: 9, max: 11, title: "Terreno Impossível", desc: "Gravidade inverte em um fosso.", efeito: "Acrobacia/Atletismo (DT 15). Falha = 1d6 de Impacto." },
    { min: 12, max: 14, title: "Acampamento Despedaçado", desc: "Tenda militar rasgada.", efeito: "Dicas de lore + 1 PS, mas ficam Abalados para próximo combate." },
    { min: 15, max: 17, title: "Clareira Segura", desc: "A influência paranormal não chegou aqui.", efeito: "Descanso Curto seguro, curam 1d4 Sanidade." },
    { min: 18, max: 20, title: "Atalho Revelado", desc: "Marcas de pneus antigas cobertas por hera.", efeito: "Viagem dura metade do tempo, vantagem no próximo Percepção." },
    { min: 21, max: 99, title: "Cache da Panaceia (Loot Master)", desc: "Drop intacto na raiz de uma árvore.", efeito: "+3 PS, 1 Kit Socorros, 1 Arma Leve ou Ritual." }
  ];

  // Rolar Acampamento
  document.getElementById('btn-roll-camp').addEventListener('click', () => {
    const roll = Math.floor(Math.random() * 20) + 1;
    const evento = eventosAcampamento[roll - 1];
    eventTitle.innerText = `[${roll}] ${evento.title}`;
    eventDesc.innerHTML = `<strong>Narrativa:</strong> ${evento.desc}<br><br><strong>Mecânica:</strong> ${evento.efeito}`;
    eventResult.style.display = 'block';
  });

  // Rolar Trilha
  document.getElementById('btn-roll-trail').addEventListener('click', () => {
    const mod = parseInt(document.getElementById('mod-trilha').value);
    const d20 = Math.floor(Math.random() * 20) + 1;
    const total = d20 + mod;
    
    const evento = eventosTrilha.find(e => total >= e.min && total <= e.max);
    
    eventTitle.innerText = `[1d20(${d20}) + ${mod} = ${total}] ${evento.title}`;
    eventDesc.innerHTML = `<strong>Narrativa:</strong> ${evento.desc}<br><br><strong>Mecânica:</strong> ${evento.efeito}`;
    eventResult.style.display = 'block';
  });

  // --- GERADOR DE NPC ---
  const nomesNPC = ["João", "Maria", "Pedro", "Ana", "Lucas", "Julia", "Marcos", "Fernanda", "Rafael", "Beatriz", "Carlos", "Camila", "Bruno", "Letícia", "Gabriel"];
  const sobrenomesNPC = ["Silva", "Santos", "Oliveira", "Souza", "Rodrigues", "Ferreira", "Alves", "Pereira", "Lima", "Gomes", "Costa", "Ribeiro", "Martins"];
  const profissoesNPC = ["Cientista da Panaceia", "Mercenário Contratado", "Sobrevivente do Avião", "Pescador Local Isolado", "Pesquisador Ocultista", "Engenheiro de Segurança", "Médico de Campo"];
  const tracosNPC = [
    "Sempre com um cigarro apagado na boca.",
    "Fala muito rápido quando está nervoso.",
    "Carrega uma foto amassada da família.",
    "Tem um tique de estalar os dedos constantemente.",
    "Usa palavras difíceis para parecer mais inteligente.",
    "Desconfia de tudo e de todos.",
    "Otimista irritante, mesmo nas piores situações.",
    "Tem uma cicatriz em forma geométrica perfeita.",
    "Cantarola músicas antigas distraídamente.",
    "Possui um olhar vazio que parece ver através das pessoas."
  ];

  const npcResult = document.getElementById('npc-result');
  document.getElementById('btn-gen-npc').addEventListener('click', () => {
    const nome = nomesNPC[Math.floor(Math.random() * nomesNPC.length)];
    const sobrenome = sobrenomesNPC[Math.floor(Math.random() * sobrenomesNPC.length)];
    const profissao = profissoesNPC[Math.floor(Math.random() * profissoesNPC.length)];
    const traco = tracosNPC[Math.floor(Math.random() * tracosNPC.length)];
    const idade = Math.floor(Math.random() * 40) + 20;

    document.getElementById('npc-name').innerText = `${nome} ${sobrenome}, ${idade} anos`;
    document.getElementById('npc-job').innerText = `Função: ${profissao}`;
    document.getElementById('npc-trait').innerText = `Traço: ${traco}`;
    npcResult.style.display = 'block';
  });

  // --- RELÓGIOS DE PROGRESSO ---
  let clocks = JSON.parse(localStorage.getItem('mestreClocks')) || [];
  const clocksContainer = document.getElementById('clocks-container');

  const saveClocks = () => {
    localStorage.setItem('mestreClocks', JSON.stringify(clocks));
  };

  const renderClocks = () => {
    clocksContainer.innerHTML = '';
    clocks.forEach((clock, index) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'clock-wrapper';

      // Calcular o preenchimento (gradient angle)
      const filledAngle = (clock.filled / clock.segments) * 360;
      
      const clockDiv = document.createElement('div');
      clockDiv.className = 'clock';
      clockDiv.style.background = `conic-gradient(rgba(255,51,51,0.8) ${filledAngle}deg, transparent ${filledAngle}deg)`;
      
      // Desenhar as fatias
      const linesDiv = document.createElement('div');
      linesDiv.className = 'clock-lines';
      for (let i = 0; i < clock.segments; i++) {
        const line = document.createElement('div');
        line.style.transform = `rotate(${(i * 360) / clock.segments}deg)`;
        linesDiv.appendChild(line);
      }
      clockDiv.appendChild(linesDiv);

      clockDiv.addEventListener('click', () => {
        if (clock.filled < clock.segments) {
          clock.filled++;
        } else {
          clock.filled = 0; // Reseta se clicar quando estiver cheio
        }
        saveClocks();
        renderClocks();
      });

      const nameDiv = document.createElement('div');
      nameDiv.className = 'clock-name';
      nameDiv.innerText = `${clock.name} (${clock.filled}/${clock.segments})`;

      const btnDel = document.createElement('button');
      btnDel.className = 'btn-del-clock';
      btnDel.innerHTML = '<i class="ph ph-x"></i>';
      btnDel.addEventListener('click', () => {
        clocks.splice(index, 1);
        saveClocks();
        renderClocks();
      });

      wrapper.appendChild(btnDel);
      wrapper.appendChild(clockDiv);
      wrapper.appendChild(nameDiv);
      clocksContainer.appendChild(wrapper);
    });
  };

  document.getElementById('btn-add-clock').addEventListener('click', () => {
    const nameInput = document.getElementById('clock-name');
    const name = nameInput.value || 'Relógio';
    const segments = parseInt(document.getElementById('clock-segments').value);
    
    clocks.push({ name, segments, filled: 0 });
    nameInput.value = '';
    saveClocks();
    renderClocks();
  });

  renderClocks(); // Inicia renderizando os que já estão no localStorage

  // Iniciar
  await loadData();
});
