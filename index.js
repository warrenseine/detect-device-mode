const details = {};

const methods = {
  TouchPoints: async () => {
    const { maxTouchPoints } = navigator;
    details.maxTouchPoints = maxTouchPoints;
    return maxTouchPoints > 1;
  }, // https://stackoverflow.com/a/64487087

  TouchEvents: async () => {
    return "TouchEvent" in window && "ontouchstart" in window;
  }, // https://stackoverflow.com/a/31420123

  UserAgent: async () => {
    let check = false;
    (function (a) {
      if (
        /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
          a
        ) ||
        /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
          a.substr(0, 4)
        )
      )
        check = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    details.userAgent = navigator.userAgent;
    return check;
  }, // https://stackoverflow.com/a/11381730

  Orientation: async () => {
    details.orientation = screen.orientation;
    return typeof screen.orientation !== "undefined";
  }, // https://stackoverflow.com/a/14301832

  UserAgentData: async () => {
    const { userAgentData } = navigator;
    details.userAgentData = userAgentData;
    return userAgentData?.mobile;
  }, // https://caniuse.com/mdn-api_navigator_useragentdata

  Navigator: async () => {
    const { userAgent, platform, maxTouchPoints } = window.navigator;

    const isIOS = /(iphone|ipod|ipad)/i.test(userAgent);

    // Workaround for ipadOS, force detection as tablet
    // SEE: https://github.com/lancedikson/bowser/issues/329
    // SEE: https://stackoverflow.com/questions/58019463/how-to-detect-device-name-in-safari-on-ios-13-while-it-doesnt-show-the-correct
    const isIPad =
      platform === "iPad" ||
      // @ts-expect-error window.MSStream is non standard
      (platform === "MacIntel" && maxTouchPoints > 0 && !window.MSStream);

    const isAndroid = /android/i.test(userAgent);

    details.isAndroid = isAndroid;
    details.isIOS = isIOS;
    details.isIPad = isIPad;

    return isAndroid || isIOS || isIPad;
  }, // https://github.com/pmndrs/detect-gpu/blob/master/src/internal/deviceInfo.ts

  GPU: async () => {
    let canvas = document.createElement("canvas");
    let gl;
    let debugInfo;
    let renderer = "";

    try {
      gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    } catch (e) {}

    if (gl) {
      debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
      renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
      details.renderer = renderer;
    }

    const mobileRenderers = [
      /adreno/i,
      /apple gpu/i, // Safari 14+ obfuscates its GPU type, so could also be desktop 🤷🏻
      /mali-t/i,
      /mali/i,
      /powervr/i,
      /samsung/i,
    ];

    const desktopRenderers = [
      /angle/i,
      /intel/i,
      /amd/i,
      /radeon/i,
      /nvidia/i,
      /geforce/i,
    ];

    return (
      mobileRenderers.some((r) => r.test(renderer)) &&
      !desktopRenderers.some((r) => r.test(renderer))
    );
  }, // https://github.com/pmndrs/detect-gpu/blob/master/src/index.ts#L136

  DeviceMotion: async () => {
    let lastAcceleration = null;
    let tries = 0;
    let timeout = null;

    return new Promise((resolve) => {
      function stop(success) {
        window.removeEventListener("devicemotion", handleDeviceMotion);
        clearTimeout(timeout);
        resolve(success);
      }

      function handleDeviceMotion(event) {
        const { acceleration } = event;

        if (!lastAcceleration) {
          lastAcceleration = acceleration;
          return;
        }

        const hasChanged =
          acceleration.x != lastAcceleration.x ||
          acceleration.y != lastAcceleration.y ||
          acceleration.z != lastAcceleration.z;

        if (hasChanged) {
          stop(true);
        } else if (tries > 10) {
          return stop(false);
        } else {
          lastAcceleration = acceleration;
        }
      }

      // Check if Device Motion API is supported
      deviceMotionSupported =
        "DeviceMotionEvent" in window &&
        // iOS 13+ requires permissions, so considering unsupported
        !DeviceMotionEvent.requestPermission;

      details.deviceMotionSupported = deviceMotionSupported;

      if (deviceMotionSupported) {
        window.addEventListener("devicemotion", handleDeviceMotion);
        timeout = setTimeout(() => stop(false), 1000);
      } else {
        stop(false);
      }
    });
  },

  DeviceOrientation: async () => {
    let lastOrientation = null;
    let tries = 0;
    let timeout = null;

    return new Promise((resolve) => {
      function stop(success) {
        window.removeEventListener(
          "deviceorientation",
          handleDeviceOrientation
        );
        clearTimeout(timeout);
        resolve(success);
      }

      function handleDeviceOrientation(event) {
        const { alpha, beta, gamma } = event;

        if (!lastOrientation) {
          lastOrientation = { alpha, beta, gamma };
          return;
        }

        const hasChanged =
          alpha != lastOrientation.alpha ||
          beta != lastOrientation.beta ||
          gamma != lastOrientation.gamma;

        if (hasChanged) {
          stop(true);
        } else if (tries > 10) {
          return stop(false);
        } else {
          lastOrientation = { alpha, beta, gamma };
        }
      }

      // Check if Device Orientation API is supported
      deviceOrientationSupported =
        "DeviceOrientationEvent" in window &&
        // iOS 13+ requires permissions, so considering unsupported
        !DeviceOrientationEvent.requestPermission;

      details.deviceOrientationSupported = deviceOrientationSupported;

      if (deviceOrientationSupported) {
        window.addEventListener("deviceorientation", handleDeviceOrientation);
        timeout = setTimeout(() => stop(false), 1000);
      } else {
        stop(false);
      }
    });
  },

  Battery: async () => {
    const batterySupported = !!navigator.getBattery;

    details.batterySupported = batterySupported;

    if (!batterySupported) {
      return false;
    }

    const battery = await navigator.getBattery();
    const hasBattery =
      battery && battery.level !== null && battery.chargingTime !== Infinity;

    return hasBattery;
  },
};

const resolveMethods = async (methods) => {
  return Object.fromEntries(
    await Promise.all(
      Object.entries(methods).map(async ([m, f]) => [m, await f()])
    )
  );
};

const run = async () => {
  document.getElementById("root").innerText = JSON.stringify(
    { ...(await resolveMethods(methods)), details },
    null,
    2
  );
};

run();
