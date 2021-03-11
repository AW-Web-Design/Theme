export const rgba2hex = orig => {
  let a;
  const rgb = orig.replace(/\s/g, "").match(/^rgba?\((\d+),(\d+),(\d+),?([^,\s)]+)?/i);
  const alpha = ((rgb && rgb[4]) || "").trim();
  let hex = rgb
    ? (rgb[1] | (1 << 8)).toString(16).slice(1) +
      (rgb[2] | (1 << 8)).toString(16).slice(1) +
      (rgb[3] | (1 << 8)).toString(16).slice(1)
    : orig;

  if (alpha !== "") {
    a = alpha;
  } else {
    a = "01";
  }
  // multiply before convert to HEX
  a = ((a * 255) | (1 << 8)).toString(16).slice(1);
  hex += a;

  return hex;
};

export const getContrast = (hexstring: string) => (props) => {
  let hex;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hexstring)) {
    hex = hexstring.substring(1);
    if (hex.length === 3) {
      hex = hex.split("");
      hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
    }
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    const mode = yiq >= 150 ? "light" : "dark";
    return props.theme.colors.modes[mode].text;
  }
  if (hexstring.includes("rgba")) {
    const hexa = rgba2hex(hexstring);
    hex = `#${hexa.substr(0, 6)}`;

    return `${getContrast(hex)}`;
  }
  return "null";
};

// It can take both a hex and an rgba value. The hex is converted to an rgba, the rgba can have its opacity altered
export const getRGBA = (color, opacity) => {
  let c;
  if (color.includes("rgba")) {
    c = color.split(",");
    if (c.length > 3) {
      c[3] = `${opacity})`;
      return c.join(",");
    }
    return color;
  }
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(color)) {
    c = color.substring(1).split("");
    if (c.length === 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = `0x${c.join("")}`;
    return `rgba(${[(c >> 16) & 255, (c >> 8) & 255, c & 255].join(",")},${opacity})`;
  }
  throw new Error("Bad Hex");
};
