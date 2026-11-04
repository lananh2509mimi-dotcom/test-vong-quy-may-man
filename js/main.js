
(function initQRGame() {
  const form = document.getElementById("playerForm");
  const nameInput = document.getElementById("playerName");
  const yearInput = document.getElementById("birthYear");
  const teamInput = document.getElementById("teamName");
  const errorBox = document.getElementById("formError");
  const button = document.getElementById("openButton");

  if (!form || !nameInput || !yearInput || !teamInput || !errorBox || !button) return;

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const validation = window.QRGameForm.validate(
      nameInput.value,
      yearInput.value,
      teamInput.value
    );

    if (!validation.valid) {
      errorBox.textContent = validation.message;
      return;
    }

    errorBox.textContent = "";
    button.disabled = true;
    button.textContent = "🎁 Đang mở quà...";

    let loadingMessage = document.getElementById("loadingMessage");

    if (!loadingMessage) {
      loadingMessage = document.createElement("p");
      loadingMessage.id = "loadingMessage";
      loadingMessage.setAttribute("aria-live", "polite");
      loadingMessage.style.marginTop = "14px";
      loadingMessage.style.color = "#1261A0";
      loadingMessage.style.fontWeight = "600";
      button.insertAdjacentElement("afterend", loadingMessage);
    }

    loadingMessage.textContent = "🍀 Một chút hồi hộp... May mắn đang đến!";

    try {
      const [data] = await Promise.all([
        window.QRGameAPI.play(
          validation.name,
          validation.year,
          validation.team
        ),
        new Promise(resolve => setTimeout(resolve, 1800))
      ]);

      if (!data || !data.success || data.result !== "win" || !data.prizeCode) {
        throw new Error(data?.message || "Chưa nhận được kết quả hợp lệ.");
      }

      loadingMessage.remove();

      window.QRGameResult.show({
        name: data.name || validation.name,
        team: data.team || validation.team,
        mode: "win",
        prizeName: data.prizeName,
        prizeCode: data.prizeCode
      });

    } catch (error) {
      loadingMessage.remove();
      errorBox.textContent = error.message || "Có lỗi kết nối, vui lòng thử lại.";
      button.disabled = false;
      button.textContent = "🎁 MỞ QUÀ MAY MẮN";
    }
  });
})();
