window.QRGameResult = {
  _revealTimeout: null,

  show({ name, team, mode, prizeName, prizeCode, message }) {
    const config = window.QRGameConfig[mode] || window.QRGameConfig.lose;
    const form = document.getElementById("playerForm");
    const panel = document.getElementById("resultPanel");
    const scratchArea = document.getElementById("scratchArea");
    const canvas = document.getElementById("scratchCanvas");
    const card = document.getElementById("scratchResultCard");
    const messageElement = document.getElementById("resultMessage");

    if (this._revealTimeout) {
      clearTimeout(this._revealTimeout);
      this._revealTimeout = null;
    }

    document.getElementById("resultEmoji").textContent = config.emoji;

    const titleElement = document.getElementById("resultTitle");
    const playerName = name.toLocaleUpperCase("vi-VN");
    const titleParts = config.title.split("{name}");

    titleElement.replaceChildren(
      document.createTextNode(titleParts[0]),
      Object.assign(document.createElement("span"), {
        className: "player-name-highlight",
        textContent: playerName
      }),
      document.createTextNode(titleParts[1] || ""),
      ...(mode === "win"
        ? [
            document.createTextNode(" - "),
            Object.assign(document.createElement("span"), {
              className: "player-name-highlight",
              textContent: team
            })
          ]
        : [])
    );

    const messageGroups = window.QRLuckyMessages || {};
    const messages = Array.isArray(messageGroups[mode])
      ? messageGroups[mode]
      : [];

    let displayMessage;

    if (mode === "win") {
      displayMessage = `Mã nhận thưởng của bạn là: ${prizeCode}`;
    } else if (mode === "special") {
      displayMessage =
        message ||
        prizeName ||
        config.message;
    } else {
      displayMessage = messages.length
        ? messages[Math.floor(Math.random() * messages.length)]
        : config.message;
    }

    messageElement.classList.remove("typing-message");
    messageElement.textContent = displayMessage;

    document.getElementById("prizeNote").textContent =
      mode === "win"
        ? "Chúc mừng bạn đã trúng thưởng, nhanh tay chụp lại màn hình và lên sân khấu nhận thưởng nhéeeee!"
        : config.note;

    panel.classList.remove("is-win", "is-lose", "reveal");
    panel.classList.add(mode === "win" ? "is-win" : "is-lose");

    card.classList.remove("scratch-card-win", "scratch-card-lose");
    card.classList.add(mode === "win" ? "scratch-card-win" : "scratch-card-lose");

    scratchArea.classList.remove("scratch-revealed", "scratch-complete");

    panel.hidden = false;
    scratchArea.hidden = false;
    canvas.hidden = false;
    form.hidden = true;

    if (window.QRScratchCard && canvas) {
      window.QRScratchCard.init({
        canvas,
        mode: mode === "win" ? "win" : "lose",

        onReveal: () => {
          scratchArea.classList.add("scratch-revealed");
          messageElement.classList.remove("typing-message");

          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              messageElement.classList.add("typing-message");
            });
          });

          this._revealTimeout = window.setTimeout(() => {
            canvas.hidden = true;
            scratchArea.classList.remove("scratch-revealed");
            scratchArea.classList.add("scratch-complete");
          }, 350);
        }
      });
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        panel.classList.add("reveal");

        if (config.confetti && window.QRGameConfetti) {
          window.QRGameConfetti.launch();
        }

        panel.scrollIntoView({
          behavior: "smooth",
          block: "nearest"
        });
      });
    });
  }
};
