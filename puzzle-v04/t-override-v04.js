const supabaseUrl = 'https://yedmpjcllgnluyrbietf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllZG1wamNsbGdubHV5cmJpZXRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5ODYxMjksImV4cCI6MjA5MzU2MjEyOX0.EigaV6Q-2RJUS0zbSCu-A88ZW6f3Qg5LR5n5Tgu_2Bg';
const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);

const puzzleChannel = supabaseClient.channel('puzzle_room', {
  config: {
    broadcast: { self: true },
  },
});

let isStable = false;
let isDead = false;

document.addEventListener("DOMContentLoaded", () => {
    const o2Val = document.getElementById("o2-val");
    const nVal = document.getElementById("n-val");
    const co2Val = document.getElementById("co2-val");
    
    const o2Ascii = document.getElementById("o2-ascii");
    const nAscii = document.getElementById("n-ascii");
    const co2Ascii = document.getElementById("co2-ascii");

    const statusText = document.getElementById("status-text");
    const successMessage = document.getElementById("success-message");
    const deathScreen = document.getElementById("death-screen");

    // Função para atualizar ASCII
    const renderAsciiBar = (percent) => {
        const blocks = Math.min(20, Math.max(0, Math.round((percent / 100) * 20)));
        return `[ ${'█'.repeat(blocks)}${'░'.repeat(20 - blocks)} ]`;
    };

    // Função que recebe os valores dos sliders e calcula os gases
    const updateGases = (s1, s2, s3) => {
        if (isStable || isDead) return;

        // Fórmulas da Malícia
        let o2 = 20 + s1 - s2;
        let n = 46 + s2 - (s3 * 0.5);
        let co2 = 48 + (s1 * 0.4) - (s3 * 0.8);

        // Clamping (0 a 100)
        o2 = Math.max(0, Math.min(100, Math.round(o2)));
        n = Math.max(0, Math.min(100, Math.round(n)));
        co2 = Math.max(0, Math.min(100, Math.round(co2)));

        // Atualiza a UI
        o2Val.textContent = `${o2}%`;
        nVal.textContent = `${n}%`;
        co2Val.textContent = `${co2}%`;

        o2Ascii.textContent = renderAsciiBar(o2);
        nAscii.textContent = renderAsciiBar(n);
        co2Ascii.textContent = renderAsciiBar(co2);

        // Checar condições de vitória
        const o2Ok = o2 >= 70 && o2 <= 80; // Meta: 75%
        const nOk = n >= 15 && n <= 25;    // Meta: 20%
        const co2Ok = co2 >= 0 && co2 <= 10; // Meta: 5%

        if (o2Ok && nOk && co2Ok) {
            triggerSuccess();
        }
    };

    const triggerSuccess = () => {
        isStable = true;
        statusText.textContent = "MISTURA ESTÁVEL";
        statusText.className = "text-success blink-fast";
        successMessage.classList.remove("hidden");
    };

    const triggerDeath = () => {
        isDead = true;
        deathScreen.classList.remove("hidden");
    };

    // Escutar eventos do Site A
    puzzleChannel.on('broadcast', { event: 'sliders_update' }, (payload) => {
        const { s1, s2, s3 } = payload.payload;
        updateGases(s1, s2, s3);
    });

    puzzleChannel.on('broadcast', { event: 'game_over' }, (payload) => {
        const { status } = payload.payload;
        if (status === 'death') {
            triggerDeath();
        } else if (status === 'success') {
            // O Site A já confirmou a purga (botões digitados)
            statusText.textContent = "PURGA CONCLUÍDA. SOBREVIVENTE LIBERADO.";
            statusText.className = "text-success";
            successMessage.innerHTML = "<h1>OPERAÇÃO BEM SUCEDIDA.</h1>";
        }
    });

    puzzleChannel.on('broadcast', { event: 'reset_puzzle' }, () => {
        isStable = false;
        isDead = false;
        statusText.textContent = "MISTURA INSTÁVEL";
        statusText.className = "text-warning";
        successMessage.classList.add("hidden");
        deathScreen.classList.add("hidden");
        successMessage.innerHTML = `<h2 class="blink-fast">> MISTURA ESTÁVEL.</h2><h1>CÓDIGO DE PURGA: <span class="highlight">3 - 6 - 0</span></h1><p>// INSTRUÇÕES: INSERIR FORMAS GEOMÉTRICAS CORRESPONDENTES AO NÚMERO DE LADOS.</p>`;
    });

    puzzleChannel.subscribe((status) => {
        if (status === 'SUBSCRIBED') {
            console.log("Conectado ao painel do Sávio!");
            // Inicializa com sliders no meio
            updateGases(50, 50, 50);
        }
    });
});
