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

// Carrega as câmeras mortas do armazenamento local do navegador
let camerasMortas = JSON.parse(localStorage.getItem('agent_cameras_mortas')) || [];

// Variáveis de tempo
let timerAssimilacao;
let timerFalha;

// Parâmetros para facilitar teste
const urlParams = new URLSearchParams(window.location.search);
const modoTeste = urlParams.get('teste') === '1';

// 10 a 40 minutos em ms, ou 10 a 40 segundos se for modo teste
const minTime = modoTeste ? 10 * 1000 : 10 * 60 * 1000;
const maxTime = modoTeste ? 40 * 1000 : 40 * 60 * 1000;

// 3 minutos para falhar, ou 5 segundos se for modo teste
const tempoFalha = modoTeste ? 5 * 1000 : 3 * 60 * 1000;

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

function iniciarCiclo() {
  if (camerasMortas.length >= 4) return; // Fim de jogo

  // Limpa tudo
  clearTimeout(timerAssimilacao);
  clearTimeout(timerFalha);
  
  estadoGlobal = 'normal';
  camAssimilada = null;
  renderizarCamera();

  // Calcula proximo evento
  const proximoEvento = Math.floor(Math.random() * (maxTime - minTime + 1)) + minTime;
  
  if (modoTeste) {
    console.log(`Próximo evento em ${proximoEvento / 1000} segundos.`);
  }

  // Agenda evento
  timerAssimilacao = setTimeout(dispararAssimilacao, proximoEvento);
}

function dispararAssimilacao() {
  estadoGlobal = 'assimilado';
  
  let camerasVivas = [1, 2, 3, 4].filter(c => !camerasMortas.includes(c));
  if (camerasVivas.length === 0) return;

  camAssimilada = camerasVivas[Math.floor(Math.random() * camerasVivas.length)]; // Sorteia uma camera viva
  
  if (modoTeste) {
    console.log(`Câmera assimilada: ${camAssimilada}`);
  }

  renderizarCamera(); // Atualiza a tela atual imediatamente

  // Inicia timer para falha (3 minutos)
  timerFalha = setTimeout(falharAssimilacao, tempoFalha);
}

function falharAssimilacao() {
  clearTimeout(timerAssimilacao);
  
  // Perde a câmera
  if (camAssimilada && !camerasMortas.includes(camAssimilada)) {
    camerasMortas.push(camAssimilada);
    // Salva no armazenamento local
    localStorage.setItem('agent_cameras_mortas', JSON.stringify(camerasMortas));
  }
  
  if (camerasMortas.length >= 4) {
    // Mostra tela de falha global se perder as 4
    btnPurgar.classList.add('hidden');
    failureScreen.classList.remove('hidden');
  } else {
    // O jogo continua sem essa câmera
    estadoGlobal = 'normal';
    camAssimilada = null;
    renderizarCamera();
    
    // Avisa que perdeu o setor antes de iniciar o próximo ciclo
    systemStatus.innerHTML = `
      <i class="fa-solid fa-skull"></i>
      <h2 style="color: var(--alert-red); text-shadow: var(--alert-glow);">SETOR PERDIDO</h2>
      <p style="color: var(--alert-red);">A assimilação consumiu o local.</p>
    `;
    
    // Aguarda um pouco e recomeça o ciclo para as câmeras restantes
    setTimeout(iniciarCiclo, 4000);
  }
}

function purgarSistema() {
  // Jogador apertou o botão a tempo na câmera certa
  clearTimeout(timerFalha);
  
  btnPurgar.classList.add('hidden');
  systemStatus.innerHTML = `
    <i class="fa-solid fa-check"></i>
    <h2>PURGA CONCLUÍDA</h2>
    <p>Reiniciando varredura...</p>
  `;
  document.body.classList.remove('estado-assimilacao');
  estadoGlobal = 'normal';
  
  // Aguarda 2 segundos e reinicia o ciclo
  setTimeout(iniciarCiclo, 2000);
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
  try {
    const pcNosStr = localStorage.getItem('pcNosRestaurados');
    if (pcNosStr) {
      const pcNos = JSON.parse(pcNosStr);
      return !!pcNos[1];
    }
  } catch (e) {
    console.error(e);
  }
  return false;
};

window.addEventListener('storage', (e) => {
  if (e.key === 'pcNosRestaurados') {
    location.reload();
  }
});

// Inicia no carregamento
window.addEventListener('load', () => {
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

  // Verifica se o mestre mandou resetar
  const urlParamsLoad = new URLSearchParams(window.location.search);
  if (urlParamsLoad.has('resetar')) {
    localStorage.removeItem('agent_cameras_mortas');
    camerasMortas = [];
    alert("O SISTEMA FOI RESETADO COM SUCESSO!");
    // Limpa a URL para não ficar resetando toda hora que atualizar
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  renderizarCamera();
  
  if (camerasMortas.length >= 4) {
    // Se já carregar com todas mortas, mostra a tela de falha direto
    btnPurgar.classList.add('hidden');
    failureScreen.classList.remove('hidden');
    return;
  }

  iniciarCiclo();
  
  if (modoTeste) {
    // Alerta de teste para não confundir o mestre
    const toast = document.createElement('div');
    toast.style.position = 'fixed';
    toast.style.bottom = '10px';
    toast.style.left = '10px';
    toast.style.background = '#33ff00';
    toast.style.color = '#000';
    toast.style.padding = '5px 10px';
    toast.style.zIndex = '9999';
    toast.style.fontSize = '12px';
    toast.innerText = 'MODO TESTE ATIVO';
    document.body.appendChild(toast);
  }
});
