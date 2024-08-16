import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */

const breakpoints = {
  xs: 456,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
  "3xl": 1920,
};

export default {
  content: ["./components/**/*.{js,vue,ts}", "./layouts/**/*.vue", "./pages/**/*.vue", "./plugins/**/*.{js,ts}", "./app.vue", "./error.vue"],
  theme: {
    screens: {
      xs: `${breakpoints.xs}px`,
      // => @media (min-width: 456px) { ... }

      sm: `${breakpoints.sm}px`,
      // => @media (min-width: 640px) { ... }

      md: `${breakpoints.md}px`,
      // => @media (min-width: 768px) { ... }

      lg: `${breakpoints.lg}px`,
      // => @media (min-width: 1024px) { ... }

      xl: `${breakpoints.xl}px`,
      // => @media (min-width: 1280px) { ... }

      "2xl": `${breakpoints["2xl"]}px`,
      // => @media (min-width: 1440px) { ... }

      "3xl": `${breakpoints["3xl"]}px`,
      // => @media (min-width: 1920px) { ... }

      "xs-max": {
        max: `${breakpoints.xs - 1}px`,
        // => @media (max-width: 455px) { ... }
      },
      "sm-max": {
        max: `${breakpoints.sm - 1}px`,
        // => @media (max-width: 639px) { ... }
      },
      "md-max": {
        max: `${breakpoints.md - 1}px`,
        // => @media (max-width: 767px) { ... }
      },
      "lg-max": {
        max: `${breakpoints.lg - 1}px`,
        // => @media (max-width: 1023px) { ... }
      },
      "xl-max": {
        max: `${breakpoints.xl - 1}px`,
        // => @media (max-width: 1279px) { ... }
      },
      "2xl-max": {
        max: `${breakpoints["2xl"] - 1}px`,
        // => @media (max-width: 1535px) { ... }
      },
      "3xl-max": {
        max: `${breakpoints["3xl"] - 1}px`,
        // => @media (max-width: 1919px) { ... }
      },
    },
    spacing: {
      // Pixel values
      0: "0px",
      1: "1px",
      2: "0.125rem; /* 2px */",
      3: "0.1875rem; /* 3px */",
      4: "0.25rem; /* 4px */",
      5: "0.3125rem; /* 5px */",
      6: "0.375rem; /* 6px */",
      8: "0.5rem; /* 8px */",
      10: "0.625rem; /* 10px */",
      12: "0.75rem; /* 12px */",
      14: "0.875rem; /* 14px */",
      15: "0.9375rem; /* 15px */",
      16: "1rem; /* 16px */",
      18: "1.125rem; /* 18px */",
      20: "1.25rem; /* 20px */",
      24: "1.5rem; /* 24px */",
      28: "1.75rem; /* 28px */",
      30: "1.875rem; /* 30px */",
      32: "2rem; /* 32px */",
      36: "2.25rem; /* 36px */",
      40: "2.5rem; /* 40px */",
      44: "2.75rem; /* 44px */",
      48: "3rem; /* 48px */",
      50: "3.125rem; /* 50px */",
      52: "3.25rem; /* 52px */",
      56: "3.5rem; /* 56px */",
      60: "3.75rem; /* 60px */",
      64: "4rem; /* 64px */",
      68: "4.25rem; /* 68px */",
      70: "4.375rem; /* 70px */",
      72: "4.5rem; /* 72px */",
      76: "4.75rem; /* 76px */",
      80: "5rem; /* 80px */",
      84: "5.25rem; /* 84px */",
      88: "5.5rem; /* 88px */",
      90: "5.625rem; /* 90px */",
      92: "5.75rem; /* 92px */",
      96: "6rem; /* 96px */",
      100: "6.25rem; /* 100px */",
      102: "6.375rem; /* 102px */",
      104: "6.5rem; /* 104px */",
      108: "6.75rem; /* 108px */",
      110: "6.875rem; /* 110px */",
      112: "7rem; /* 112px */",
      116: "7.25rem; /* 116px */",
      120: "7.5rem; /* 120px */",
      124: "7.75rem; /* 124px */",
      128: "8rem; /* 128px */",
      130: "8.125rem; /* 130px */",
      132: "8.25rem; /* 132px */",
      136: "8.5rem; /* 136px */",
      140: "8.75rem; /* 140px */",
      144: "9rem; /* 144px */",
      148: "9.25rem; /* 148px */",
      150: "9.375rem; /* 150px */",
      160: "10rem; /* 160px */",
      170: "10.625rem; /* 170px */",
      180: "11.25rem; /* 180px */",
      190: "11.875rem; /* 190px */",
      200: "12.5rem; /* 200px */",
      // Negative Pixels
      "-1": "-1px",
      "-2": "-0.125rem; /* -2px */",
      "-3": "-0.1875rem; /* -3px */",
      "-4": "-0.25rem; /* -4px */",
      "-5": "-0.3125rem; /* -5px */",
      "-6": "-0.375rem; /* -6px */",
      "-8": "-0.5rem; /* -8px */",
      "-10": "-0.625rem; /* -10px */",
      "-12": "-0.75rem; /* -12px */",
      "-14": "-0.875rem; /* -14px */",
      "-15": "-0.9375rem; /* -15px */",
      "-16": "-1rem; /* -16px */",
      "-18": "-1.125rem; /* -18px */",
      "-20": "-1.25rem; /* -20px */",
      "-24": "-1.5rem; /* -24px */",
      "-28": "-1.75rem; /* -28px */",
      "-30": "-1.875rem; /* -30px */",
      "-32": "-2rem; /* -32px */",
      "-36": "-2.25rem; /* -36px */",
      "-40": "-2.5rem; /* -40px */",
      "-44": "-2.75rem; /* -44px */",
      "-48": "-3rem; /* -48px */",
      "-50": "-3.125rem; /* -50px */",
      "-52": "-3.25rem; /* -52px */",
      "-56": "-3.5rem; /* -56px */",
      "-60": "-3.75rem; /* -60px */",
      "-64": "-4rem; /* -64px */",
      "-68": "-4.25rem; /* -68px */",
      "-70": "-4.375rem; /* -70px */",
      "-72": "-4.5rem; /* -72px */",
      "-76": "-4.75rem; /* -76px */",
      "-80": "-5rem; /* -80px */",
      "-84": "-5.25rem; /* -84px */",
      "-88": "-5.5rem; /* -88px */",
      "-90": "-5.625rem; /* -90px */",
      "-92": "-5.75rem; /* -92px */",
      "-96": "-6rem; /* -96px */",
      "-100": "-6.25rem; /* -100px */",
      "-102": "-6.375rem; /* -102px */",
      "-104": "-6.5rem; /* -104px */",
      "-108": "-6.75rem; /* -108px */",
      "-110": "-6.875rem; /* -110px */",
      "-112": "-7rem; /* -112px */",
      "-116": "-7.25rem; /* -116px */",
      "-120": "-7.5rem; /* -120px */",
      "-124": "-7.75rem; /* -124px */",
      "-128": "-8rem; /* -128px */",
      "-130": "-8.125rem; /* -130px */",
      "-132": "-8.25rem; /* -132px */",
      "-136": "-8.5rem; /* -136px */",
      "-140": "-8.75rem; /* -140px */",
      "-144": "-9rem; /* -144px */",
      "-148": "-9.25rem; /* -148px */",
      "-150": "-9.375rem; /* -150px */",
      "-160": "-10rem; /* -160px */",
      "-170": "-10.625rem; /* -170px */",
      "-180": "-11.25rem; /* -180px */",
      "-190": "-11.875rem; /* -190px */",
      "-200": "-12.5rem; /* -200px */",
      // Percentages
      "1/12": "8.33333333%",
      "2/12": "16.66666667%",
      "3/12": "25%",
      "4/12": "33.33333333%",
      "5/12": "41.66666667%",
      "6/12": "50%",
      "7/12": "58.33333333%",
      "8/12": "66.66666667%",
      "9/12": "75%",
      "10/12": "83.33333333%",
      "11/12": "91.66666667%",
      "1/5": "20%",
      "2/5": "40%",
      "3/5": "60%",
      "4/5": "80%",
      full: "100%",
      "16/9": "56.25%",
      // Negative Percentages
      "-1/12": "-8.33333333%",
      "-2/12": "-16.66666667%",
      "-3/12": "-25%",
      "-4/12": "-33.33333333%",
      "-5/12": "-41.66666667%",
      "-6/12": "-50%",
      "-7/12": "-58.33333333%",
      "-8/12": "-66.66666667%",
      "-9/12": "-75%",
      "-10/12": "-83.33333333%",
      "-11/12": "-91.66666667%",
      "-1/5": "-20%",
      "-2/5": "-40%",
      "-3/5": "-60%",
      "-4/5": "-80%",
      "-16/9": "-56.25%",
      // Misc
      auto: "auto",
      fit: "fit-content",
      min: "min-content",
      max: "max-content",
    },
    extend: {
      fontFamily: {
        mosk: ["Mosk", ...defaultTheme.fontFamily.sans],
        biggerDisplay: ["BiggerDisplay", ...defaultTheme.fontFamily.sans],
        argesta: ["Argesta Hairline", ...defaultTheme.fontFamily.serif],
      },
    },
  },
  plugins: [],
  corePlugins: {
    contianer: false,
  },
};
