window.QRGameConfetti = {
  launch() {
    const colors = ["#c49a42", "#2f6f8f", "#d9b65d", "#8bb5c8", "#f0dca0"];
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < 55; i++) {
      const piece = document.createElement("span");
      piece.className = "confetti-piece";
      piece.style.left = Math.random() * 100 + "vw";
      piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      piece.style.animationDelay = Math.random() * 1.1 + "s";
      piece.style.transform = "rotate(" + Math.floor(Math.random() * 360) + "deg)";
      fragment.appendChild(piece);
      window.setTimeout(() => piece.remove(), 4600);
    }

    document.body.appendChild(fragment);
  }
};
