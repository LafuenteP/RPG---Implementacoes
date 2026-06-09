const supabaseUrl = 'https://yedmpjcllgnluyrbietf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllZG1wamNsbGdubHV5cmJpZXRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5ODYxMjksImV4cCI6MjA5MzU2MjEyOX0.EigaV6Q-2RJUS0zbSCu-A88ZW6f3Qg5LR5n5Tgu_2Bg';
const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);

const puzzleChannel = supabaseClient.channel('puzzle_room', {
  config: {
    broadcast: { self: true },
  },
});

document.addEventListener("DOMContentLoaded", () => {
    const btnReset = document.getElementById("btn-reset");
    const btnKill = document.getElementById("btn-kill");
    const btnWin = document.getElementById("btn-win");

    btnReset.addEventListener("click", () => {
        if(confirm("Tem certeza que deseja reiniciar o puzzle para 8 minutos?")) {
            puzzleChannel.send({
                type: 'broadcast',
                event: 'reset_puzzle',
                payload: {}
            });
            alert("Sinal de reset enviado!");
        }
    });

    btnKill.addEventListener("click", () => {
        if(confirm("Isso vai matar o Sávio. Tem certeza?")) {
            puzzleChannel.send({
                type: 'broadcast',
                event: 'game_over',
                payload: { status: 'death' }
            });
        }
    });

    btnWin.addEventListener("click", () => {
        if(confirm("Forçar o sucesso do puzzle?")) {
            puzzleChannel.send({
                type: 'broadcast',
                event: 'game_over',
                payload: { status: 'success' }
            });
        }
    });

    puzzleChannel.subscribe((status) => {
        if (status === 'SUBSCRIBED') {
            console.log("Mestre conectado ao canal.");
        }
    });
});
