window.QRGameForm = {
  normalizeName(value) {
    return String(value || "")
      .normalize("NFC")
      .trim()
      .replace(/\s+/g, " ");
  },

  validate(name, year, team) {
    const cleanName = this.normalizeName(name);
    const cleanYear = String(year || "").trim();
    const cleanTeam = String(team || "").trim();

    if (!cleanName || cleanName.length < 2) {
      return {
        valid: false,
        message: "Vui lòng nhập đầy đủ họ và tên."
      };
    }

    if (!/^\d{4}$/.test(cleanYear) ||
        Number(cleanYear) < 1900 ||
        Number(cleanYear) > 2026) {
      return {
        valid: false,
        message: "Năm sinh phải gồm 4 chữ số, từ 1900 đến 2026."
      };
    }

    if (!cleanTeam) {
      return {
        valid: false,
        message: "Vui lòng chọn tổ của bạn."
      };
    }

    return {
      valid: true,
      name: cleanName,
      year: cleanYear,
      team: cleanTeam,
      message: ""
    };
  }
};
