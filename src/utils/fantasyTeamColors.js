/**
 * Fantasy team colors and accessibility utilities for the league scoreboard.
 * Includes smart color adjustment for proper contrast and readability.
 */

/**
 * Primary colors for each fantasy team based on their uniform colors.
 * @type {Object.<string, string>}
 */
const fantasyTeamColors = {
  "Murder Hornets": "#e0b82b",
  "California Burritos": "#7da3ff", 
  "D-Town Swirlies": "#5cb5d9",
  "Newfoundland Growlers": "#613814",
  "Brutal Hogs": "#8a1c1c",
  "Southwest Aliens": "#6b9438",
  "Seattle Prestiges": "#087a47",
  "Sugar Skulls": "#b56145",
  "Rochester Jesters": "#fc5c03",
  "Lonestar Legends": "#172e42",
  "Food Mafia": "#d9a680",
  "Somewheres": "#f5c44f"
};

/**
 * Converts hex color to RGB values.
 * @param {string} hex - Hex color code (e.g., "#ff0000")
 * @returns {{r: number, g: number, b: number}} RGB values
 */
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Converts RGB to hex color.
 * @param {number} r - Red value (0-255)
 * @param {number} g - Green value (0-255)
 * @param {number} b - Blue value (0-255)
 * @returns {string} Hex color code
 */
function rgbToHex(r, g, b) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

/**
 * Calculates the relative luminance of a color for contrast calculations.
 * @param {string} hex - Hex color code
 * @returns {number} Relative luminance (0-1)
 */
function getLuminance(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;

  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Calculates contrast ratio between two colors.
 * @param {string} color1 - First hex color
 * @param {string} color2 - Second hex color  
 * @returns {number} Contrast ratio (1-21)
 */
function getContrastRatio(color1, color2) {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

/**
 * Darkens a color by a given percentage.
 * @param {string} hex - Hex color code
 * @param {number} percent - Percentage to darken (0-100)
 * @returns {string} Darkened hex color
 */
function darkenColor(hex, percent) {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const factor = (100 - percent) / 100;
  const r = Math.round(rgb.r * factor);
  const g = Math.round(rgb.g * factor);
  const b = Math.round(rgb.b * factor);

  return rgbToHex(r, g, b);
}

/**
 * Lightens a color by a given percentage.
 * @param {string} hex - Hex color code
 * @param {number} percent - Percentage to lighten (0-100)
 * @returns {string} Lightened hex color
 */
function lightenColor(hex, percent) {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const factor = percent / 100;
  const r = Math.round(rgb.r + (255 - rgb.r) * factor);
  const g = Math.round(rgb.g + (255 - rgb.g) * factor);
  const b = Math.round(rgb.b + (255 - rgb.b) * factor);

  return rgbToHex(r, g, b);
}

/**
 * Gets an accessible color for a team name with proper contrast.
 * Automatically adjusts brightness based on background and contrast requirements.
 * @param {string} teamName - The fantasy team name
 * @param {string} backgroundColor - Background color (default: "#ffffff" for light theme)
 * @param {number} minContrast - Minimum contrast ratio (default: 4.5 for WCAG AA)
 * @returns {string} Hex color with proper contrast
 */
export function getAccessibleTeamColor(teamName, backgroundColor = "#ffffff", minContrast = 4.5) {
  let baseColor = fantasyTeamColors[teamName];
  
  // Fallback to a default color if team not found
  if (!baseColor) {
    console.warn(`Team color not found for: ${teamName}`);
    return "#374151"; // Default gray color with good contrast
  }

  let currentColor = baseColor;
  let contrast = getContrastRatio(currentColor, backgroundColor);

  // If contrast is already good, return the original color
  if (contrast >= minContrast) {
    return currentColor;
  }

  // Determine if we should darken or lighten based on background
  const bgLuminance = getLuminance(backgroundColor);
  
  if (bgLuminance > 0.5) {
    // Light background - darken the color
    for (let i = 10; i <= 70; i += 10) {
      const darkenedColor = darkenColor(baseColor, i);
      const newContrast = getContrastRatio(darkenedColor, backgroundColor);
      if (newContrast >= minContrast) {
        return darkenedColor;
      }
      currentColor = darkenedColor;
    }
  } else {
    // Dark background - lighten the color
    for (let i = 10; i <= 70; i += 10) {
      const lightenedColor = lightenColor(baseColor, i);
      const newContrast = getContrastRatio(lightenedColor, backgroundColor);
      if (newContrast >= minContrast) {
        return lightenedColor;
      }
      currentColor = lightenedColor;
    }
  }

  // If we still don't have enough contrast, use high contrast alternatives
  if (bgLuminance > 0.5) {
    return "#1f2937"; // Dark gray for light backgrounds
  } else {
    return "#f9fafb"; // Light gray for dark backgrounds
  }
}

/**
 * Gets the primary team color without accessibility adjustments.
 * Use this when you want the exact brand color regardless of contrast.
 * @param {string} teamName - The fantasy team name
 * @returns {string} The team's primary hex color
 */
export function getTeamColor(teamName) {
  return fantasyTeamColors[teamName] || "#374151";
}

/**
 * Gets all available team names and their colors.
 * @returns {Object.<string, string>} Object mapping team names to hex colors
 */
export function getAllTeamColors() {
  return { ...fantasyTeamColors };
}

/**
 * Checks if a team name exists in our color mapping.
 * @param {string} teamName - The team name to check
 * @returns {boolean} True if team has a defined color
 */
export function hasTeamColor(teamName) {
  return teamName in fantasyTeamColors;
}

/**
 * Generates a CSS custom property (CSS variable) for a team color.
 * @param {string} teamName - The fantasy team name
 * @param {string} backgroundColor - Background color for contrast calculation
 * @returns {string} CSS custom property string
 */
export function getTeamColorCSS(teamName, backgroundColor = "#ffffff") {
  const color = getAccessibleTeamColor(teamName, backgroundColor);
  return `--team-color-${teamName.toLowerCase().replace(/\s+/g, '-')}: ${color};`;
}

export default fantasyTeamColors;
