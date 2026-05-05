const supabaseUrl = 'https://yedmpjcllgnluyrbietf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllZG1wamNsbGdubHV5cmJpZXRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5ODYxMjksImV4cCI6MjA5MzU2MjEyOX0.EigaV6Q-2RJUS0zbSCu-A88ZW6f3Qg5LR5n5Tgu_2Bg';
const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);

// Seletores
const systemStatus = document.getElementById('system-status');
const actionArea = document.getElementById('action-area');
const btnPurgar = document.getElementById('btn-purgar');
const connStatus = document.getElementById('conn-status');
const failureScreen = document.getElementById('failure-screen');
const camIdDisplay = document.getElementById('cam-id');
const asciiArtContainer = document.getElementById('ascii-art');
const camBtns = document.querySelectorAll('.cam-btn');

// Dados das Câmeras
const cameras = {
  1: { nome: 'ACAMPAMENTO', arte: "                     .e$c\"*eee...                   \n                z$$$$$$.  \"*$$$$$$$$$.                    \n            .z$$$$$$$$$$$e. \"$$$$$$$$$$c.                 \n         .e$$P\"\"  $$  \"\"*$$$bc.\"$$$$$$$$$$$e.             \n     .e$*\"\"       $$         \"**be$$$***$   3             \n     $            $F              $    4$r  'F            \n     $           4$F              $    4$F   $            \n    4P   \\       4$F              $     $$   3r           \n    $\"    r      4$F              3     $$r   $           \n    $     '.     $$F              4F    4$$   'b          \n   dF      3     $$    ^           b     $$L   \"L         \n   $        .    $$   %            $     ^$$r   \"c        \n  JF             $$  %             4r     '$$.   3L       \n .$              $$ \"               $      ^$$r\"\"         \n $%              $$P                3r  .e*\"              \n'*=*********************************$$P\"     " },
  2: { nome: 'PRAIA NORTE', arte: "             ___   ____\n        /' --;^/ ,-_\\     \\ | /\n       / / --o\\ o-\\ \\\\   --(_)--\n      /-/-/|o|-|\\-\\\\|\\\\   / | \\\n       '`  ` |-|   `` '\n             |-|\n             |-|O\n             |-(\\,__\n          ...|-|\\--,\\_....\n      ,;;;;;;;;;;;;;;;;;;;;;;;;,.\n~~,;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;,~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n~;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;,  ______   ---------   _____     ------" },
  3: { nome: 'RUÍNAS VILA', arte: "   ~         ~~          __\n       _T      .,,.    ~--~ ^^\n ^^   // \\                    ~\n      ][O]    ^^      ,-~ ~\n   /''-I_I         _II____\n__/_  /   \\ ______/ ''   /'\\_,__\n  | II--'''' \\,--:--..,_/,.-{ },\n; '/__\\,.--';|   |[] .-.| O{ _ }\n:' |  | []  -|   ''--:.;[,.'\\,/\n'  |[]|,.--'' '',   ''-,.    |\n  ..    ..-''    ;       ''. '" },
  4: { nome: 'FLORESTA', arte: " \u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u28e0\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\n\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2813\u2812\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2880\u28c0\u28c0\u2800\u2800\u2800\u2800\u2800\u28a0\u28a4\u28e4\u28e4\u2840\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\n\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2860\u2814\u2812\u2812\u2832\u280e\u2800\u2800\u28b9\u2843\u2880\u28c0\u2800\u2811\u2803\u2800\u2808\u2880\u2814\u2812\u28a2\u2800\u2800\u2800\u2856\u2809\u2809\u2809\u2812\u28a4\u2840\u2800\u2800\u2800\u2800\u2800\n\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2880\u2814\u281a\u2819\u2812\u2812\u2812\u2824\u284e\u2800\u2800\u2800\u2800\u2880\u28e0\u28f4\u28e6\u2800\u2808\u2818\u28e6\u2811\u2822\u2840\u2800\u28b0\u2801\u2800\u2800\u2800\u2811\u2830\u280b\u2801\u2800\u2800\u2800\u2800\u2800\u2808\u28a6\u2800\u2800\u2800\u2800\n\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u28f8\u2801\u2800\u2800\u2800\u2800\u2800\u2800\u28b0\u2803\u2800\u28c0\u28c0\u2860\u28de\u28c9\u2840\u285c\u285f\u28f7\u289f\u281f\u2840\u28c0\u2878\u2800\u284e\u2800\u2800\u2800\u2800\u2800\u2847\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u28fb\u2800\u2800\u2800\u2800\n\u28b0\u2802\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u28d7\u2800\u2800\u2880\u28c0\u28c0\u28c0\u28c0\u28c0\u28d3\u285e\u28bd\u285a\u28d1\u28db\u2847\u28b8\u28f7\u2813\u28bb\u28df\u287f\u283b\u28dd\u28a2\u2800\u2887\u28c0\u2840\u2800\u2800\u2800\u2888\u2817\u2812\u28b6\u28f6\u28f6\u287e\u280b\u2809\u2800\u2800\u2800\u2800\u2800\n\u2808\u2809\u2800\u2800\u2800\u2800\u2800\u2880\u2800\u2808\u2812\u280a\u283b\u28f7\u28ff\u28da\u287d\u2803\u2809\u2800\u2800\u2819\u283f\u28cc\u2833\u28fc\u2847\u2800\u28f8\u28df\u2851\u2884\u2818\u28b8\u2880\u28fe\u283e\u2825\u28c0\u2824\u2816\u2801\u2800\u2800\u2800\u28b8\u2847\u2800\u2800\u2800\u2800\u2800\u2880\u2800\u2800\n\u2800\u2800\u2800\u28b0\u2886\u2800\u2880\u280f\u2847\u2800\u2840\u2800\u2800\u2800\u28ff\u2809\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2808\u28a7\u28f8\u2847\u2890\u285f\u2800\u2819\u288e\u28a3\u28ff\u28fe\u2877\u280a\u2809\u2819\u2822\u2800\u2800\u2800\u2800\u2800\u28b8\u2847\u2880\u2800\u2800\u2800\u2800\u2808\u2823\u2840\n\u2800\u2800\u2800\u2818\u284c\u28a3\u28f8\u2800\u28e7\u28ba\u2883\u2864\u28b6\u2806\u28ff\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2819\u28df\u280b\u2880\u2814\u28d2\u28da\u284b\u2809\u28e1\u2814\u280b\u2809\u28b0\u2864\u28c7\u2800\u2800\u2800\u2800\u28b8\u2847\u2847\u2800\u2800\u2800\u2800\u2800\u2800\u2838\n\u2800\u2800\u2800\u2800\u2811\u2884\u28b9\u2846\u2801\u281b\u28c1\u2814\u2801\u2800\u28ff\u2800\u2800\u2800\u2800\u28b8\u2847\u2800\u2800\u2800\u2800\u2800\u28ff\u28a0\u2877\u280b\u2801\u2800\u2808\u28ff\u2847\u2800\u2800\u2800\u2808\u2847\u2809\u2800\u2800\u2800\u2800\u28b8\u2847\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\n\u2800\u2800\u2800\u2800\u2800\u2800\u2811\u28e6\u2854\u280b\u2801\u2800\u2800\u2800\u28ff\u2800\u2800\u28a0\u2840\u28b0\u28fc\u2847\u2800\u2840\u2800\u2800\u28ff\u2800\u2801\u2800\u2800\u2800\u2800\u28ff\u28f7\u2800\u2800\u2800\u2800\u2847\u2800\u2800\u28b4\u28e4\u2800\u28b8\u2847\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\n\u2800\u2800\u2800\u2800\u2800\u2800\u28b0\u28ff\u2847\u2800\u2800\u2800\u2800\u2800\u28ff\u2840\u2800\u28a8\u28e7\u287f\u280b\u2800\u2818\u281b\u2800\u2800\u28ff\u2800\u2800\u2880\u2800\u2800\u2800\u28ff\u28ff\u2800\u2800\u2800\u2800\u28b2\u2800\u2800\u2800\u2800\u2800\u28b8\u2847\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\n\u2800\u2800\u2800\u2800\u2800\u2800\u28b8\u28ff\u2847\u2800\u2800\u2800\u2800\u2800\u28b8\u2867\u2844\u2800\u2839\u28c7\u2846\u2800\u2800\u2800\u2800\u2800\u28ff\u2800\u28b0\u28cf\u2800\u28ff\u28f8\u28ff\u28ff\u2800\u2800\u2800\u2800\u28fc\u2800\u2800\u2830\u2817\u2800\u28b8\u2847\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\n\u2800\u2800\u2800\u2800\u2800\u2800\u28b8\u28ff\u2847\u2800\u2800\u2800\u2800\u2800\u28b8\u2847\u28f7\u28db\u28e6\u28ff\u2880\u2808\u2811\u2800\u28a0\u2846\u28ff\u2810\u28a0\u28df\u2801\u28b8\u2838\u28ff\u28ff\u28b1\u28e4\u2880\u2800\u28fc\u2800\u2800\u2880\u2800\u2800\u28b8\u2847\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\n\u2800\u2800\u2800\u2800\u2800\u2800\u28b8\u28ff\u2847\u2800\u2880\u2800\u2800\u2800\u28b8\u2847\u2818\u282b\u28df\u2847\u280a\u28e3\u2818\u281b\u28fe\u2846\u28bf\u2800\u2819\u28ff\u2880\u28d8\u2843\u28ff\u28ff\u284f\u2809\u2812\u2802\u287f\u2800\u2830\u28fe\u2844\u2800\u28b8\u285f\u28fd\u28c0\u2800\u2800\u2800\u2800\u2800\u2800\n\u2800\u2800\u2800\u2800\u2800\u2800\u2838\u28ff\u2847\u2800\u2818\u28fe\u2800\u2800\u28b8\u2847\u28b8\u28c7\u2859\u2823\u2800\u28f9\u28c7\u2800\u2808\u2827\u2880\u28c0\u28c0\u284f\u28f8\u28ff\u28c7\u28b9\u28ff\u2847\u28b4\u28f4\u28c4\u28c0\u2840\u28b0\u28ff\u2847\u2800\u28b8\u28c7\u28bf\u287f\u2800\u2800\u2800\u2800\u2800\u2800\n\u2800\u2800\u2800\u2800\u2800\u2800\u2813\u2801\u2808\u283b\u28b7\u283e\u2826\u2824\u282c\u28c5\u28f9\u28ff\u28d6\u28f6\u28f2\u28c8\u2865\u2824\u2836\u2856\u281b\u2812\u281b\u2801\u2809\u281b\u282e\u2810\u289b\u2853\u2812\u289b\u281a\u2812\u2812\u2812\u281b\u28da\u28eb\u287c\u283f\u283f\u28ef\u281b\u2824\u2800\u2800\u2800\u2800\n\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2809\u2809\u2809\u2809\u2809\u2809\u2849\u2809\u2801\u2800\u2800\u2818\u2813\u2800\u2800\u2800\u2800\u2800\u28c0\u28de\u287f\u2849\u2809\u2809\u2809\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\n\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2839\u28f6\u280f\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2808\u2809\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800" }
};

let cameraAtual = 1;
let camAssimilada = null; // null = tudo normal. 1 a 4 = câmera afetada
let estadoGlobal = 'normal'; // 'normal' ou 'assimilado'

// Câmeras mortas do estado global e status dos nós
let camerasMortas = [];
let pcNosGlobais = { 1: false };

// Variáveis de tempo do Timer Global (id 2)
let timerState = {
  isPaused: true,
  nextEventTime: 0,
  timeRemainingForNextEvent: 120000,
  activeEvent: null 
};

let lastRenderState = "";

function renderizarCamera() {
  camIdDisplay.innerText = `CAM_0${cameraAtual} - ${cameras[cameraAtual].nome}`;
  
  // Atualiza visuais dependendo do estado
  if (camerasMortas.includes(cameraAtual)) {
    // Câmera perdida
    asciiArtContainer.innerText = "\n\n\n\n\n[ SINAL PERDIDO ]\nASSIMILAÇÃO DETECTADA\nCONEXÃO CORTADA";
    document.body.classList.remove('estado-assimilacao');
    btnPurgar.classList.add('hidden');
    connStatus.innerText = 'OFFLINE';
    systemStatus.innerHTML = `
      <i class="fa-solid fa-skull"></i>
      <h2 style="color: var(--alert-red); text-shadow: var(--alert-glow);">SETOR PERDIDO</h2>
      <p style="color: var(--alert-red);">Sinal da câmera indisponível.</p>
    `;
  } else if (estadoGlobal === 'assimilado' && cameraAtual === camAssimilada) {
    // Vendo a câmera assimilada!
    asciiArtContainer.innerText = cameras[cameraAtual].arte;
    document.body.classList.add('estado-assimilacao');
    btnPurgar.classList.remove('hidden');
    connStatus.innerText = 'INTERFERÊNCIA';
    systemStatus.innerHTML = `
      <i class="fa-solid fa-triangle-exclamation"></i>
      <h2>ASSIMILAÇÃO EMINENTE</h2>
      <p>Intervenção necessária imediatamente!</p>
    `;
  } else if (estadoGlobal === 'assimilado' && cameraAtual !== camAssimilada) {
    // Evento rolando mas na câmera errada
    asciiArtContainer.innerText = cameras[cameraAtual].arte;
    document.body.classList.remove('estado-assimilacao');
    btnPurgar.classList.add('hidden');
    connStatus.innerText = 'SINAL DEGRADADO'; // Dica sutil que tem algo errado
    systemStatus.innerHTML = `
      <i class="fa-solid fa-shield-halved"></i>
      <h2>SISTEMA ESTÁVEL</h2>
      <p>Nenhuma anomalia detectada NESTA zona.</p>
    `;
  } else {
    // Tudo normal
    asciiArtContainer.innerText = cameras[cameraAtual].arte;
    document.body.classList.remove('estado-assimilacao');
    btnPurgar.classList.add('hidden');
    connStatus.innerText = 'ONLINE';
    systemStatus.innerHTML = `
      <i class="fa-solid fa-shield-halved"></i>
      <h2>SISTEMA ESTÁVEL</h2>
      <p>Nenhuma anomalia detectada.</p>
    `;
  }

  // Atualiza botoes
  camBtns.forEach(btn => {
    let idBtn = parseInt(btn.dataset.cam);
    btn.classList.remove('active');
    
    if (camerasMortas.includes(idBtn)) {
      btn.style.color = 'var(--alert-red)';
      btn.style.borderColor = 'var(--alert-red)';
      btn.innerText = `[X] CAM 0${idBtn}`;
    } else {
      btn.innerText = `CAM 0${idBtn}`;
    }

    if (idBtn === cameraAtual) {
      btn.classList.add('active');
    }
  });
}

function tickGlobal() {
  if (!checkCamerasUnlocked()) return;
  if (timerState.isPaused) return;

  const now = Date.now();

  if (!timerState.activeEvent) {
    // Estamos esperando um ataque
    estadoGlobal = 'normal';
    camAssimilada = null;

    if (now >= timerState.nextEventTime && timerState.nextEventTime > 0) {
      // HORA DO ATAQUE!
      let camerasVivas = [1, 2, 3, 4].filter(c => !camerasMortas.includes(c));
      if (camerasVivas.length > 0) {
        const camSorteada = camerasVivas[Math.floor(Math.random() * camerasVivas.length)];
        
        timerState.activeEvent = {
          camId: camSorteada,
          deadline: now + (3 * 60 * 1000) // 3 minutos
        };
        
        // Salva no banco para todos os celulares pegarem
        supabaseClient.from('game_state').upsert({ id: 2, rpg_survival_state: timerState }).then();
      }
    }
  } else {
    // Temos um evento ativo
    estadoGlobal = 'assimilado';
    camAssimilada = timerState.activeEvent.camId;
    
    if (now >= timerState.activeEvent.deadline) {
      // CÂMERA MORREU
      if (!camerasMortas.includes(camAssimilada)) {
        camerasMortas.push(camAssimilada);
        supabaseClient.from('game_state').update({ agent_cameras_mortas: camerasMortas }).eq('id', 1).then();
      }
      
      // Prepara próximo ataque
      timerState.activeEvent = null;
      const minTime = 10 * 60 * 1000;
      const maxTime = 40 * 60 * 1000;
      const delay = Math.floor(Math.random() * (maxTime - minTime + 1)) + minTime;
      timerState.nextEventTime = now + delay;
      supabaseClient.from('game_state').upsert({ id: 2, rpg_survival_state: timerState }).then();

      systemStatus.innerHTML = `
        <i class="fa-solid fa-skull"></i>
        <h2 style="color: var(--alert-red); text-shadow: var(--alert-glow);">SETOR PERDIDO</h2>
        <p style="color: var(--alert-red);">A assimilação consumiu o local.</p>
      `;
    }
  }

  // Verifica se a tela precisa ser re-renderizada (evita piscar o texto)
  const currentRenderState = `${estadoGlobal}-${camAssimilada}-${cameraAtual}-${camerasMortas.join()}`;
  if (currentRenderState !== lastRenderState) {
    renderizarCamera();
    lastRenderState = currentRenderState;
  }
}

async function purgarSistema() {
  if (!timerState.activeEvent) return; // Segurança
  
  btnPurgar.classList.add('hidden');
  systemStatus.innerHTML = `
    <i class="fa-solid fa-check"></i>
    <h2>PURGA CONCLUÍDA</h2>
    <p>Reiniciando varredura global...</p>
  `;
  document.body.classList.remove('estado-assimilacao');
  estadoGlobal = 'normal';
  
  // Limpa evento e define novo tempo
  const minTime = 10 * 60 * 1000;
  const maxTime = 40 * 60 * 1000;
  const delay = Math.floor(Math.random() * (maxTime - minTime + 1)) + minTime;
  
  timerState.activeEvent = null;
  timerState.nextEventTime = Date.now() + delay;
  
  try {
    await supabaseClient.from('game_state').upsert({ id: 2, rpg_survival_state: timerState });
  } catch(e) { console.error(e); }
}

// Event Listeners
btnPurgar.addEventListener('click', purgarSistema);

camBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    cameraAtual = parseInt(btn.dataset.cam);
    renderizarCamera();
  });
});

const checkCamerasUnlocked = () => {
  return !!pcNosGlobais[1];
};

// Inicia no carregamento
window.addEventListener('load', async () => {
  try {
    const { data: data1 } = await supabaseClient.from('game_state').select('*').eq('id', 1).single();
    if (data1) {
      if (data1.agent_cameras_mortas) {
        camerasMortas = data1.agent_cameras_mortas || [];
      }
      if (data1.pc_nos_restaurados) {
        pcNosGlobais = data1.pc_nos_restaurados || { 1: false };
      }
    }

    const { data: data2 } = await supabaseClient.from('game_state').select('*').eq('id', 2).single();
    if (data2 && data2.rpg_survival_state) {
      timerState = data2.rpg_survival_state;
    }
  } catch(e) {
    console.error(e);
  }

  // Verifica se o mestre mandou resetar
  const urlParamsLoad = new URLSearchParams(window.location.search);
  if (urlParamsLoad.has('resetar')) {
    camerasMortas = [];
    try {
      await supabaseClient.from('game_state').update({ agent_cameras_mortas: [] }).eq('id', 1);
    } catch(e) {
      console.error(e);
    }
    alert("O SISTEMA FOI RESETADO COM SUCESSO!");
    // Limpa a URL para não ficar resetando toda hora que atualizar
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  // Inscreve para ouvir mudanças
  supabaseClient
    .channel('game_state_changes_mobile')
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'game_state', filter: 'id=eq.1' }, payload => {
      const newData = payload.new;
      if (newData.agent_cameras_mortas) {
        camerasMortas = newData.agent_cameras_mortas || [];
        if (camerasMortas.length >= 4) {
          btnPurgar.classList.add('hidden');
          failureScreen.classList.remove('hidden');
        } else if (!failureScreen.classList.contains('hidden')) {
           // Resetou e tava na tela de falha
           failureScreen.classList.add('hidden');
        }
      }
      if (newData.pc_nos_restaurados) {
        const checkAntes = checkCamerasUnlocked();
        pcNosGlobais = newData.pc_nos_restaurados;
        if (!checkAntes && checkCamerasUnlocked()) {
          location.reload(); // Recarrega se acabou de desbloquear
        } else if (checkAntes && !checkCamerasUnlocked()) {
          location.reload(); // Recarrega se foi bloqueado
        }
      }
    })
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'game_state', filter: 'id=eq.2' }, payload => {
      if (payload.new && payload.new.rpg_survival_state) {
        timerState = payload.new.rpg_survival_state;
      }
    })
    .subscribe();

  if (!checkCamerasUnlocked()) {
    connStatus.innerText = 'OFFLINE';
    systemStatus.innerHTML = `
      <i class="fa-solid fa-lock"></i>
      <h2 style="color: var(--alert-red); text-shadow: var(--alert-glow);">SINAL INACESSÍVEL</h2>
      <p style="color: var(--alert-red);">Nó de conexão offline. Restaure via Terminal.</p>
    `;
    asciiArtContainer.innerText = "\n\n\n\n\n[ ACESSO NEGADO ]\nCONEXÃO COM A TORRE PERDIDA\n";
    camBtns.forEach(btn => {
      btn.style.opacity = '0.5';
      btn.style.pointerEvents = 'none';
    });
    return;
  }

  renderizarCamera();
  
  if (camerasMortas.length >= 4) {
    // Se já carregar com todas mortas, mostra a tela de falha direto
    btnPurgar.classList.add('hidden');
    failureScreen.classList.remove('hidden');
    return;
  }

  // Inicia o Tick Global a cada 1 segundo
  setInterval(tickGlobal, 1000);
});
