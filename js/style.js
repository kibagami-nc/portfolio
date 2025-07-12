// Animation de vagues avec dégradé bleu/blanc partant du haut
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
        colorStops: i % 2 === 0 ? ['#202020ff', '#fff'] : ['#fff', '#ffffffff'],
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
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        waves.forEach((wave, idx) => {
            wave.phase += wave.speed;
            ctx.save();
            ctx.globalAlpha = 0.5 + 0.2 * Math.sin(wave.phase + idx);
            const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
            grad.addColorStop(0, wave.colorStops[0]);
            grad.addColorStop(1, wave.colorStops[1]);
            ctx.strokeStyle = grad;
            ctx.lineWidth = 2 + idx * 2 ;
            ctx.beginPath();
            for (let x = 0; x <= canvas.width; x += 2) {
                const y = 100 + idx * 60 + Math.sin((x / wave.wavelength) * Math.PI * 2 + wave.phase) * wave.amplitude + waveOffset;
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
