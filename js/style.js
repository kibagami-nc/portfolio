// Animation des vagues

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
        amplitude: 40 + i * 20,
        wavelength: 300 + i * 100,
        speed: 0.008 + i * 0.003,
        phase: Math.random() * Math.PI * 2,
        colorStops: i % 0 === 0 ? ['#696969ff', '#fff'] : ['#fff', '#424242ff'],
    }));

    let waveOffset = 0;
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', function() {
        const currentY = window.scrollY;
        const delta = currentY - lastScrollY;
        waveOffset -= delta;
        lastScrollY = currentY;
    });

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Dégradé vertical bleu pour l'océan
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
            // Couleur de fond plus foncée à chaque profondeur
            const baseR = 40 + idx * 10;
            const baseG = 120 + idx * 5;
            const baseB = 200 - idx * 30;
            const fillColor = `rgba(${baseR - 20},${baseG - 20},${baseB - 40},0.5)`;

            ctx.beginPath();
            const baseY = ((idx + 1) / (waveCount + 1)) * canvas.height;
            for (let x = 0; x <= canvas.width; x += 2) {
                const smoothRandom = Math.sin(x * 0.015 + wave.phase * 1.5 + idx) * (8 + idx * 4);
                const y = baseY
                    + Math.sin((x / wave.wavelength) * Math.PI * 2 + wave.phase) * (wave.amplitude + idx * 10)
                    + smoothRandom
                    + waveOffset;
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            // Ferme la forme jusqu'en bas du canvas
            ctx.lineTo(canvas.width, canvas.height);
            ctx.lineTo(0, canvas.height);
            ctx.closePath();
            ctx.fillStyle = fillColor;
            ctx.fill();
            ctx.restore();

            // Dessin du contour de la vague
            ctx.save();
            ctx.globalAlpha = 0.7 - idx * 0.15;
            const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
            const colorTop = `rgba(${baseR},${baseG},${baseB},1)`;
            const colorBottom = `rgba(${baseR - 20},${baseG - 20},${baseB - 40},1)`;
            grad.addColorStop(0, colorTop);
            grad.addColorStop(1, colorBottom);
            ctx.strokeStyle = grad;
            ctx.lineWidth = 2 + idx * 2 ;
            ctx.beginPath();
            for (let x = 0; x <= canvas.width; x += 2) {
                const smoothRandom = Math.sin(x * 0.015 + wave.phase * 1.5 + idx) * (8 + idx * 4);
                const y = baseY
                    + Math.sin((x / wave.wavelength) * Math.PI * 2 + wave.phase) * (wave.amplitude + idx * 10)
                    + smoothRandom
                    + waveOffset;
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
            ctx.restore();
        });
        requestAnimationFrame(draw);
    }
    draw();
});
