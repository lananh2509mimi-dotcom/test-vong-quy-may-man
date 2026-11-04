/* Dán URL Web App /exec hiện tại vào đây trước khi đăng website. */
window.QRGameAPI = {
  endpoint: "https://script.google.com/macros/s/AKfycbw_lICgRhABzulSswJDbEbH5fqSCR7QWuHiyd1Z8TC_9PsLEB1qb2glkN7H72t4l9MgxQ/exec",
  play(name, year, team) {
    return new Promise((resolve, reject) => {
      if (!/^https:\/\/script\.google\.com\/macros\/s\/.+\/exec$/.test(this.endpoint)) {
        reject(new Error("Chưa cấu hình URL Google Apps Script."));
        return;
      }
      const callback = "qrLuckyCallback_" + Date.now() + "_" + Math.random().toString(36).slice(2);
      const script = document.createElement("script");
      const timeout = setTimeout(() => finish(new Error("Kết nối quá thời gian. Vui lòng thử lại.")), 25000);
      let finished = false;
      function finish(error, result) {
        if (finished) return;
        finished = true;
        clearTimeout(timeout);
        delete window[callback];
        script.remove();
        if (error) reject(error);
        else resolve(result);
      }
      window[callback] = result => finish(null, result);
      script.onerror = () => finish(new Error("Không kết nối được Google Sheets."));
      const url = new URL(this.endpoint);
      url.searchParams.set("action", "play");
      url.searchParams.set("name", name);
      url.searchParams.set("year", year);
      url.searchParams.set("team", team);
      url.searchParams.set("callback", callback);
      url.searchParams.set("_", String(Date.now()));
      script.src = url.toString();
      document.head.appendChild(script);
    });
  }
};
