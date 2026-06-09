const supabaseUrl = 'https://yedmpjcllgnluyrbietf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllZG1wamNsbGdubHV5cmJpZXRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5ODYxMjksImV4cCI6MjA5MzU2MjEyOX0.EigaV6Q-2RJUS0zbSCu-A88ZW6f3Qg5LR5n5Tgu_2Bg';
const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);

// Setup de Canal para Broadcast
const puzzleChannel = supabaseClient.channel('puzzle_room', {
  config: {
    broadcast: { self: true },
  },
});

let timerInterval;
let timeLeft = 480; // 8 minutos
let isGameOver = false;

// Estado local da sequência de botões
const targetSequence = ['3', '6', '0']; // Triângulo, Hexágono, Círculo
let currentSequence = [];

document.addEventListener("DOMContentLoaded", () => {
    const timerDisplay = document.getElementById("timer");
    const sliders = [
        document.getElementById("slider-1"),
        document.getElementById("slider-2"),
        document.getElementById("slider-3")
    ];
    const shapeBtns = document.querySelectorAll(".shape-btn");
    const statusOverlay = document.getElementById("status-overlay");
    const statusMessage = document.getElementById("status-message");

    // Iniciar Timer
    const startTimer = () => {
        timerInterval = setInterval(() => {
            if (isGameOver) return clearInterval(timerInterval);
            
            timeLeft--;
            const m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
            const s = (timeLeft % 60).toString().padStart(2, '0');
            timerDisplay.textContent = `${m}:${s}`;

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                triggerDeath();
            }
        }, 1000);
    };

    // Fim de Jogo - Morte
    const triggerDeath = () => {
        isGameOver = true;
        statusOverlay.className = 'status-death';
        statusMessage.textContent = "FALHA CRÍTICA. SISTEMA BLOQUEADO.";
        
        // Notificar o Site B
        puzzleChannel.send({
            type: 'broadcast',
            event: 'game_over',
            payload: { status: 'death' }
        });
    };

    // Fim de Jogo - Sucesso
    const triggerSuccess = () => {
        isGameOver = true;
        clearInterval(timerInterval);
        statusOverlay.className = 'status-success';
        statusMessage.textContent = "ACESSO LIBERADO. PURGA INICIADA.";

        // Notificar o Site B
        puzzleChannel.send({
            type: 'broadcast',
            event: 'game_over',
            payload: { status: 'success' }
        });
    };

    // Enviar valores do slider
    const broadcastSliders = () => {
        if (isGameOver) return;
        
        const vals = {
            s1: parseInt(sliders[0].value),
            s2: parseInt(sliders[1].value),
            s3: parseInt(sliders[2].value)
        };

        puzzleChannel.send({
            type: 'broadcast',
            event: 'sliders_update',
            payload: vals
        });
    };

    // Listeners dos Sliders
    sliders.forEach(s => {
        // Envia atualização toda vez que mexe
        s.addEventListener("input", broadcastSliders);
    });

    // Lógica dos Botões de Forma (Código)
    shapeBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            if (isGameOver) return;

            const shapeVal = btn.dataset.shape;
            
            // Feedback visual rápido
            btn.classList.add("active");
            setTimeout(() => btn.classList.remove("active"), 200);

            currentSequence.push(shapeVal);

            // Verifica se a sequência até agora está certa
            for(let i=0; i<currentSequence.length; i++) {
                if(currentSequence[i] !== targetSequence[i]) {
                    // Errou!
                    currentSequence = [];
                    // Punição: perde 15 segundos
                    timeLeft = Math.max(1, timeLeft - 15); 
                    // Feedback visual na tela
                    document.body.style.backgroundColor = "#ffffff";
                    setTimeout(() => document.body.style.backgroundColor = "var(--dark-red)", 100);
                    return;
                }
            }

            // Acertou a sequência inteira
            if(currentSequence.length === targetSequence.length) {
                triggerSuccess();
            }
        });
    });

    // Escutar eventos do Site B (ex: se o Site B mandar resetar ou algo assim)
    puzzleChannel.on('broadcast', { event: 'game_over' }, (payload) => {
        if (payload.payload.status === 'death' && !isGameOver) {
            triggerDeath();
        }
    }).subscribe((status) => {
        if (status === 'SUBSCRIBED') {
            console.log("Conectado ao painel do Grupo!");
            broadcastSliders(); // envia o estado inicial
        }
    });

    // Iniciar
    startTimer();
});
