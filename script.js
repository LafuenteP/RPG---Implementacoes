const supabaseUrl = 'https://yedmpjcllgnluyrbletf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllZG1wamNsbGdubHV5cmJpZXRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5ODYxMjksImV4cCI6MjA5MzU2MjEyOX0.EigaV6Q-2RJUS0zbSCu-A88ZW6f3Qg5LR5n5Tgu_2Bg';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

let pcNosGlobais = { 1: false, 2: false, 3: false };
let agentCamerasMortasGlobal = [];

document.addEventListener("DOMContentLoaded", () => {
  const psAtuaisInput = document.getElementById("ps-atuais");
  const numSobreviventesInput = document.getElementById("num-sobreviventes");
  const custoCalculadoSpan = document.getElementById("custo-calculado");
  const btnAddPs = document.getElementById("btn-add-ps");
  const btnRemPs = document.getElementById("btn-rem-ps");
  const btnAvancarDia = document.getElementById("btn-avancar-dia");
  const displayDia = document.getElementById("display-dia");
  const toastContainer = document.getElementById("toast-container");

  // Audios
  const audioTyping = document.getElementById("audio-typing");
  const audioBeep = document.getElementById("audio-beep");

  // Nodes de Melhoria
  const nodesMelhoria = document.querySelectorAll(".melhoria-item");
  const nivel1 = document.getElementById("nivel-1");
  const nivel2 = document.getElementById("nivel-2");

  let diaAtual = 1;

  // --- SISTEMA DE TOAST ---
  const showToast = (title, message, type = 'info') => {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    toast.innerHTML = `
      <div class="toast-content">
        <span class="toast-title">${title}</span>
        <span class="toast-msg">${message}</span>
      </div>
    `;

    toastContainer.appendChild(toast);

    // Tocar som de digitação
    if (audioTyping) {
      audioTyping.currentTime = 0;
      audioTyping.play().catch(err => console.log("Áudio bloqueado pelo navegador", err));
    }

    // Remove after 3 seconds
    setTimeout(() => {
      toast.style.animation = 'fadeOut 0.2s ease forwards';
      setTimeout(() => {
        if(toastContainer.contains(toast)) {
          toastContainer.removeChild(toast);
        }
      }, 200);
    }, 4000); // 4 segundos para dar tempo de ler os logs do terminal
  };

  // --- EFEITOS VISUAIS E SOM ---
  const playBeep = () => {
    if (audioBeep) {
      audioBeep.currentTime = 0;
      audioBeep.play().catch(err => console.log("Áudio bloqueado pelo navegador", err));
    }
  };

  const animateInput = (input, type) => {
    input.classList.remove('blink-green', 'blink-red');
    void input.offsetWidth; // trigger reflow
    input.classList.add(`blink-${type}`);
  };

  // --- INTEGRAÇÃO COM TERMINAL PC ---
  const checkCamerasUnlocked = () => {
    return !!pcNosGlobais[1];
  };

  // --- PERSISTÊNCIA DE DADOS COM SUPABASE ---
  const saveState = async () => {
    const state = {
      psAtuais: psAtuaisInput.value,
      numSobreviventes: numSobreviventesInput.value,
      dia: diaAtual,
      melhorias: {}
    };

    nodesMelhoria.forEach(node => {
      const id = node.dataset.melhoria;
      state.melhorias[id] = node.classList.contains("unlocked");
    });

    try {
      await supabase.from('game_state').update({ rpg_survival_state: state }).eq('id', 1);
    } catch (e) {
      console.error("Erro ao salvar no Supabase:", e);
    }
  };

  const loadState = async () => {
    try {
      const { data, error } = await supabase.from('game_state').select('*').eq('id', 1).single();
      
      if (data) {
        if (data.rpg_survival_state) {
          const state = data.rpg_survival_state;
          psAtuaisInput.value = state.psAtuais || 0;
          numSobreviventesInput.value = state.numSobreviventes || 2;
          diaAtual = state.dia || 1;
          displayDia.textContent = diaAtual;

          if (state.melhorias) {
            nodesMelhoria.forEach(node => {
              const id = node.dataset.melhoria;
              if (state.melhorias[id]) {
                node.classList.add("unlocked");
              } else {
                node.classList.remove("unlocked");
              }
            });
          }
        }
        
        if (data.pc_nos_restaurados) {
          pcNosGlobais = data.pc_nos_restaurados;
        }

        if (data.agent_cameras_mortas) {
          agentCamerasMortasGlobal = data.agent_cameras_mortas || [];
        }
      }
      
      atualizarNiveis();
      calcularCustoDiario();
      checkCamerasUnlocked();
    } catch(e) {
      console.error(e);
      displayDia.textContent = diaAtual;
      checkCamerasUnlocked();
    }
  };

  // Escutar mudanças do Supabase em tempo real
  supabase
    .channel('game_state_changes_master')
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'game_state', filter: 'id=eq.1' }, payload => {
      const newData = payload.new;
      if (newData.rpg_survival_state) {
        const state = newData.rpg_survival_state;
        psAtuaisInput.value = state.psAtuais || 0;
        numSobreviventesInput.value = state.numSobreviventes || 2;
        diaAtual = state.dia || 1;
        displayDia.textContent = diaAtual;

        if (state.melhorias) {
          nodesMelhoria.forEach(node => {
            const id = node.dataset.melhoria;
            if (state.melhorias[id]) {
              node.classList.add("unlocked");
            } else {
              node.classList.remove("unlocked");
            }
          });
        }
        atualizarNiveis();
        calcularCustoDiario();
      }

      if (newData.pc_nos_restaurados) {
        pcNosGlobais = newData.pc_nos_restaurados;
        checkCamerasUnlocked();
      }

      if (newData.agent_cameras_mortas) {
        agentCamerasMortasGlobal = newData.agent_cameras_mortas || [];
      }
    })
    .subscribe();

  // --- CÁLCULO DE CUSTO DE PS ---
  const calcularCustoDiario = () => {
    const sobreviventes = parseInt(numSobreviventesInput.value) || 0;
    const custo = Math.floor(sobreviventes / 2);
    custoCalculadoSpan.textContent = custo;
    return custo;
  };

  numSobreviventesInput.addEventListener("input", () => {
    calcularCustoDiario();
    saveState();
  });
  
  psAtuaisInput.addEventListener("input", () => {
    saveState();
  });

  // --- GERENCIAMENTO DE PS ---
  btnAddPs.addEventListener("click", () => {
    playBeep();
    const input = prompt("Quantos PS adicionar?", "1");
    if (input !== null) {
      const valor = parseInt(input);
      if (!isNaN(valor) && valor > 0) {
        psAtuaisInput.value = parseInt(psAtuaisInput.value) + valor;
        animateInput(psAtuaisInput, 'green');
        showToast("Suprimentos Adicionados", `+${valor} PS`, "success");
        saveState();
      }
    }
  });

  btnRemPs.addEventListener("click", () => {
    playBeep();
    const input = prompt("Quantos PS remover?", "1");
    if (input !== null) {
      const valor = parseInt(input);
      if (!isNaN(valor) && valor > 0) {
        let atual = parseInt(psAtuaisInput.value);
        psAtuaisInput.value = Math.max(0, atual - valor);
        animateInput(psAtuaisInput, 'red');
        showToast("Suprimentos Removidos", `-${valor} PS`, "error");
        saveState();
      }
    }
  });

  // --- AVANÇO DOS DIAS ---
  btnAvancarDia.addEventListener("click", () => {
    playBeep();
    let custo = calcularCustoDiario();
    let psAtuais = parseInt(psAtuaisInput.value) || 0;
    
    // Verificar Coletor
    const coletorNode = document.querySelector('[data-melhoria="coletor"]');
    if (coletorNode && coletorNode.classList.contains('unlocked')) {
      psAtuais += 2;
      showToast("Coletor de Chuva", "+2 PS gerados na noite", "success");
    }

    // Verificar Bônus das Câmeras Ativas (SE DESBLOQUEADO)
    if (checkCamerasUnlocked()) {
      const camerasAtivas = Math.max(0, 4 - agentCamerasMortasGlobal.length);

      if (camerasAtivas > 0) {
        // Exemplo de bônus: 1 PS por câmera ativa. Você pode ajustar a fórmula.
        const bonusCameras = camerasAtivas * 1; 
        psAtuais += bonusCameras;
        showToast("Monitoramento Ativo", `As ${camerasAtivas} câmeras garantiram +${bonusCameras} PS recuperados/poupados!`, "success");
      } else {
        showToast("Ponto Cego", "Sem monitoramento! Nenhum bônus recebido.", "error");
      }
    }

    if (psAtuais < custo) {
      showToast(
        "Fome!",
        `Faltaram suprimentos. O grupo pagou ${psAtuais} PS. Condição: FATIGADO.`,
        "error"
      );
      psAtuaisInput.value = 0;
    } else {
      psAtuais -= custo;
      showToast(
        "Noite Segura",
        `O grupo consumiu ${custo} PS.`,
        "success"
      );
      psAtuaisInput.value = psAtuais;
    }

    diaAtual++;
    displayDia.textContent = diaAtual;
    animateInput(psAtuaisInput, 'red');
    saveState();
  });

  // --- LÓGICA DAS MELHORIAS ---
  const custosMelhorias = {
    abrigo: { ps: 2, nome: "Abrigo Improvisado" },
    fogueira: { ps: 0, nome: "Fogueira Estável" },
    coletor: { ps: 0, nome: "Coletor de Chuva" },
    triagem: { ps: 1, nome: "Área de Triagem" },
    perimetro: { ps: 1, nome: "Perímetro de Alerta" },
    cartografia: { ps: 0, nome: "Cartografia" },
    destilador: { ps: 2, nome: "Destilador Paranormal" },
  };

  const atualizarNiveis = () => {
    const isAbrigo = document.querySelector('[data-melhoria="abrigo"]').classList.contains('unlocked');
    
    if (isAbrigo) {
      nivel1.classList.remove("locked");
    } else {
      nivel1.classList.add("locked");
    }

    const mNivel1Marcadas = [
      document.querySelector('[data-melhoria="fogueira"]'),
      document.querySelector('[data-melhoria="coletor"]'),
      document.querySelector('[data-melhoria="triagem"]')
    ].filter(n => n && n.classList.contains("unlocked")).length;

    if (isAbrigo && mNivel1Marcadas >= 2) {
      nivel2.classList.remove("locked");
    } else {
      nivel2.classList.add("locked");
    }
  };

  nodesMelhoria.forEach(node => {
    node.addEventListener("click", () => {
      playBeep();
      // Verifica se o nível do node está bloqueado
      const parentNivel = node.closest('.nivel-arvore');
      if (parentNivel && parentNivel.classList.contains('locked')) {
        showToast("Bloqueado", "Desbloqueie os requisitos primeiro.", "error");
        return;
      }

      const id = node.dataset.melhoria;
      const custoInfo = custosMelhorias[id];
      let psAtuais = parseInt(psAtuaisInput.value) || 0;

      if (node.classList.contains("unlocked")) {
        if(confirm(`Deseja desfazer a melhoria "${custoInfo.nome}"? (PS não será reembolsado)`)){
          node.classList.remove("unlocked");
          atualizarNiveis();
          saveState();
        }
      } else {
        // Tentar construir
        if (psAtuais >= custoInfo.ps) {
          psAtuais -= custoInfo.ps;
          psAtuaisInput.value = psAtuais;
          node.classList.add("unlocked");
          
          if(custoInfo.ps > 0) {
            animateInput(psAtuaisInput, 'red');
          }
          
          showToast("Melhoria Construída!", `"${custoInfo.nome}" concluída.`, "success");
          atualizarNiveis();
          saveState();
        } else {
          showToast("Recursos Insuficientes", `Necessário ${custoInfo.ps} PS.`, "error");
        }
      }
    });
  });

  // Inicializa
  loadState();
});
