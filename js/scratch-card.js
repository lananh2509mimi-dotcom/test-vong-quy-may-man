
window.QRScratchCard = {
  init({ canvas, onReveal }) {
    const ctx = canvas.getContext("2d");
    const area = canvas.parentElement;

    let dragging = false;
    let revealed = false;
    let peelX = 0;
    let peelY = 0;
    let startX = 0;
    let startY = 0;

    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;

      if (!w || !h) return;

      canvas.width = Math.round(w * ratio);
      canvas.height = Math.round(h * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      draw();
    }

    function draw() {
      if (!w || !h || revealed) return;

      ctx.clearRect(0, 0, w, h);

      // Lớp tem còn lại
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(w, 0);
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();

      if (peelX > 0 || peelY > 0) {
        // Vùng tem được bóc dần từ góc trên bên phải
        const px = Math.max(0, Math.min(w, peelX));
        const py = Math.max(0, Math.min(h, peelY));

        ctx.moveTo(w, 0);
        ctx.lineTo(w - px, 0);
        ctx.quadraticCurveTo(
          w - px * 0.65, py * 0.15,
          w, py
        );
      }

      ctx.fillStyle = "#F5F7F9";
      ctx.fill();

      // Vẽ lại bề mặt tem với đường biên cong
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(w, 0);
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();

      ctx.fillStyle = "#F7F9FB";
      ctx.fill();
      ctx.restore();

      // Vẽ lớp phủ trắng và họa tiết bạc
      ctx.save();
      ctx.beginPath();

      const fold = Math.max(peelX, peelY);
      const cut = Math.min(0.85, fold / Math.max(w, h));

      ctx.moveTo(0, 0);
      ctx.lineTo(w * (1 - cut), 0);
      ctx.quadraticCurveTo(
        w * (1 - cut * 0.5), h * cut * 0.15,
        w, h * cut
      );
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      ctx.clip();

      const gradient = ctx.createLinearGradient(0, 0, w, h);
      gradient.addColorStop(0, "#FFFFFF");
      gradient.addColorStop(0.5, "#E9EEF2");
      gradient.addColorStop(1, "#FFFFFF");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = "rgba(255,255,255,0.65)";
      ctx.lineWidth = 1.5;
      for (let x = -h; x < w; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x + h, h);
        ctx.stroke();
      }

      ctx.fillStyle = "#1261A0";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "700 17px Arial, sans-serif";
      ctx.fillText("BÓC TEM GÓC BÊN PHẢI ĐỂ MỞ QUÀ", w / 2, h / 2 - 10);
      ctx.font = "13px Arial, sans-serif";
      ctx.fillText("Giữ và kéo từ góc bên phải xuống để bóc tem", w / 2, h / 2 + 17);
      ctx.restore();

      // Góc tem cuộn và bóng đổ
      if (fold > 0) {
        const fx = Math.max(0, w - peelX);
        const fy = Math.max(0, peelY);

        ctx.save();
        ctx.shadowColor = "rgba(20, 40, 60, 0.28)";
        ctx.shadowBlur = 12;
        ctx.shadowOffsetX = -4;
        ctx.shadowOffsetY = 4;

        const flap = ctx.createLinearGradient(fx, fy, w, fy + 55);
        flap.addColorStop(0, "#D5DEE5");
        flap.addColorStop(0.45, "#FFFFFF");
        flap.addColorStop(1, "#C8D3DC");

        ctx.fillStyle = flap;
        ctx.beginPath();
        ctx.moveTo(fx, 0);
        ctx.quadraticCurveTo(w - 10, fy * 0.2, w, fy);
        ctx.lineTo(w, 0);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
    }

    function point(event) {
      const rect = canvas.getBoundingClientRect();
      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      };
    }

    canvas.addEventListener("pointerdown", event => {
      if (revealed) return;

      const p = point(event);
      // Bắt đầu kéo từ góc phía trên bên phải
      if (p.x < w - 90 || p.y > 90) return;

      dragging = true;
      startX = p.x;
      startY = p.y;

      if (canvas.setPointerCapture) {
        canvas.setPointerCapture(event.pointerId);
      }
    });

    canvas.addEventListener("pointermove", event => {
      if (!dragging || revealed) return;

      const p = point(event);
      peelX = Math.max(0, Math.min(w, startX - p.x));
      peelY = Math.max(0, Math.min(h, p.y - startY));

      draw();

      if (peelX > w * 0.55 || peelY > h * 0.7) {
        revealed = true;
        dragging = false;

        canvas.style.transition =
          "opacity 380ms ease, transform 380ms ease";
        canvas.style.opacity = "0";
        canvas.style.transform = "translate(30px, -20px) rotate(5deg)";

        onReveal();

        window.setTimeout(() => {
          canvas.hidden = true;
        }, 380);
      }
    });

    function stop() {
      dragging = false;
    }

    canvas.addEventListener("pointerup", stop);
    canvas.addEventListener("pointercancel", stop);

    canvas.style.opacity = "1";
    canvas.style.transform = "none";
    canvas.style.transition = "none";
    canvas.hidden = false;

    resize();
  }
};
