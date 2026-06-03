document.addEventListener('DOMContentLoaded', () => {
    const card = document.getElementById('birthdayCard');
    const canvas = document.getElementById('confetti-canvas');
    const audio = document.getElementById('birthdaySong');
    const video = document.getElementById('birthdayVideo');
    const closeBtn = document.getElementById('closeBtn'); // Selektujemo novo dugme
    const ctx = canvas.getContext('2d');

    let animationFrameId;
    const confettiPieces = [];
    const colors = ['#e63946', '#f1faee', '#a8dadc', '#457b9d', '#1d3557', '#d4a373'];

    // Postavljanje veličine canvasa
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Konstruktor za čestice konfeta
    class Confetti {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * -canvas.height - 20;
            this.size = Math.random() * 8 + 6;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.speedX = Math.random() * 3 - 1.5;
            this.speedY = Math.random() * 3 + 2;
            this.rotation = Math.random() * 360;
            this.rotationSpeed = Math.random() * 4 - 2;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.rotation += this.rotationSpeed;

            if (this.y > canvas.height) {
                this.y = -20;
                this.x = Math.random() * canvas.width;
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate((this.rotation * Math.PI) / 180);
            ctx.fillStyle = this.color;
            ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
            ctx.restore();
        }
    }

    function initConfetti() {
        for (let i = 0; i < 150; i++) {
            confettiPieces.push(new Confetti());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        confettiPieces.forEach(piece => {
            piece.update();
            piece.draw();
        });
        animationFrameId = requestAnimationFrame(animate);
    }

    // Klik na čestitku SLUŽI SAMO ZA OTVARANJE
    card.addEventListener('click', () => {
        // Ako čestitka NIJE otvorena, otvori je i pokreni efekte
        if (!card.classList.contains('is-open')) {
            card.classList.add('is-open');

            audio.play().catch(error => {
                console.log("Audio je blokiran od strane pretraživača:", error);
            });

            if (confettiPieces.length === 0) {
                initConfetti();
            }
            animate();
        }
    });

    // SAMO OVO DUGME MOŽE DA ZATVORI ČESTITKU
    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Sprečava prenos klika na karticu

        // Zatvaramo karticu
        card.classList.remove('is-open');

        // Zaustavljanje i resetovanje muzike
        audio.pause();
        audio.currentTime = 0;

        // Zaustavljanje i resetovanje videa
        video.pause();
        video.currentTime = 0;

        // Zaustavljanje konfeta i čišćenje ekrana nakon zatvaranja
        cancelAnimationFrame(animationFrameId);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    // Sprečavanje bilo kakvih neočekivanih ponašanja na klik unutar samog videa
    video.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Pametno gašenje muzike u pozadini kada se pusti video
    video.addEventListener('play', () => {
        audio.pause();
    });
});