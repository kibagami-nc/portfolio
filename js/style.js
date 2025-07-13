window.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('bg-anim');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const waveCount = 4;
    const waves = Array.from({length: waveCount}, (_, i) => ({
        amplitude: 5 + i * 10,
        wavelength: 1000 + i * 100,
        speed: 0.008 + i * 0.003,
        phase: Math.random() * Math.PI * 2,
    }));

    // Gestion des vagues (optionnelle)
    let waveOffset = 0;
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', function() {
        const currentY = window.scrollY;
        const delta = currentY - lastScrollY;
        waveOffset -= delta;
        lastScrollY = currentY;
    });

    // Gestion des bulles
    const bubbles = [];
    const maxBubbles = 50;

    const presentation = document.getElementById('presentation');
    const competences = document.getElementById('competences');
    const presentationOffsetTop = presentation.offsetTop;
    const competencesOffsetTop = competences.offsetTop;

    function createBubble(y = null) {
        return {
            x: Math.random() * canvas.width,
            y: y !== null ? y : window.scrollY + canvas.height + 10 + Math.random() * 50,
            radius: 2 + Math.random() * 4,
            speed: 0.5 + Math.random() * 1.5,
            opacity: 0.2 + Math.random() * 0.4,
            drift: (Math.random() - 0.5) * 0.5,
        };
    }

    function updateBubbles(isCompetencesActive) {
        if (bubbles.length < maxBubbles) {
            bubbles.push(createBubble());
        }

        bubbles.forEach((b, i) => {
            if (!isCompetencesActive) {
                // Bulles montent vers le haut avec oscillation horizontale
                b.y -= b.speed;
                b.x += Math.sin(b.y * 0.05 + b.x) * 0.5;
                b.opacity -= 0.002;

                if (b.y + b.radius < presentationOffsetTop || b.opacity <= 0) {
                    bubbles[i] = createBubble();
                }
            } else {
                // Bulles dispersées avec mouvements doux
                b.x += b.drift * 0.5;
                b.y += (Math.sin(b.x * 0.05) * 0.5);
                b.opacity -= 0.001;

                if (
                    b.opacity <= 0 ||
                    b.x < -50 || b.x > canvas.width + 50 ||
                    b.y < -50 || b.y > canvas.height + 50
                ) {
                    bubbles[i] = createBubble(Math.random() * canvas.height);
                }
            }
        });
    }

    function drawBubbles(isCompetencesActive) {
        bubbles.forEach(b => {
            let drawX = b.x;
            let drawY = b.y;

            if (!isCompetencesActive) {
                drawY = b.y - window.scrollY;
            }

            if (drawY + b.radius < 0 || drawY - b.radius > canvas.height) return;
            if (drawX + b.radius < 0 || drawX - b.radius > canvas.width) return;

            ctx.beginPath();
            const gradient = ctx.createRadialGradient(drawX, drawY, 0, drawX, drawY, b.radius);
            gradient.addColorStop(0, `rgba(255,255,255,${b.opacity})`);
            gradient.addColorStop(1, `rgba(255,255,255,0)`);
            ctx.fillStyle = gradient;
            ctx.arc(drawX, drawY, b.radius, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Fond océan
        const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        bgGrad.addColorStop(0, "#4fc3f7");
        bgGrad.addColorStop(0.5, "#1565c0");
        bgGrad.addColorStop(1, "#001f3f");
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        waves.forEach((wave, idx) => {
            wave.phase += wave.speed;

            ctx.save();
            ctx.globalAlpha = 0.5 - idx * 0.08;

            const maxIdx = waveCount - 1;
            const t = idx / maxIdx;
            const rStart = 10;
            const gStart = 30;
            const bStart = 80;
            const r = Math.round(rStart * (1 - t));
            const g = Math.round(gStart * (1 - t));
            const b = Math.round(bStart * (1 - t));
            const fillColor = `rgba(${r},${g},${b},${0.6 * (1 - t * 0.8)})`;

            ctx.beginPath();
            const baseY = ((idx + 1) / (waveCount + 1)) * canvas.height;
            for (let x = 0; x <= canvas.width; x += 2) {
                const smoothRandom = Math.sin(x * 0.015 + wave.phase * 1.5 + idx) * (40 + idx * 8);
                const y = baseY
                    + Math.sin((x / wave.wavelength) * Math.PI * 2 + wave.phase) * (wave.amplitude + idx * 5)
                    + smoothRandom
                    + waveOffset;
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.lineTo(canvas.width, canvas.height);
            ctx.lineTo(0, canvas.height);
            ctx.closePath();
            ctx.fillStyle = fillColor;
            ctx.fill();
            ctx.restore();
        });

        const isCompetencesActive = window.scrollY + window.innerHeight > competencesOffsetTop;

        updateBubbles(isCompetencesActive);
        drawBubbles(isCompetencesActive);

        requestAnimationFrame(draw);
    }
    draw();
});
