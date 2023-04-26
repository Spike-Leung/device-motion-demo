import { useState, useEffect } from "preact/hooks";

export default function Counter() {
  const [info, setInfo] = useState({
    // 加速度
    acceleration: {},
    // 重力加速度
    accelerationIncludingGravity: {},
    // 陀螺仪
    rotationRate: {},
    // 磁力计（物理方向）
    deviceOrientation: {}
  });

  const [logDataFlag, setLogDataFlag] = useState(false)
  const [data, setData] = useState([])

  const throttle = function(fn, delay: number) {
    let lastTime = 0;

    return function(...args) {
      const now = Date.now();

      if (now - lastTime >= delay) {
        fn.apply(this, args);
        lastTime = now;
      }
    }
  }

  const throttleSetInfo = throttle((params) => setInfo((state) => {
    return {
      ...state,
      ...params,
    };
  }), 500);

  const deviceOrientationListener = (event) => {
    if (logDataFlag) {
      const { alpha, gamma, beta } = event;
      setData((state) => [...state, {
        type: 'deviceorientation',
        alpha,
        beta,
        gamma,
        time: Date.now()
      }]);
    }
    throttleSetInfo({ deviceOrientation: event });
  }

  const deviceMotionListener = ({ acceleration, accelerationIncludingGravity, rotationRate, interval }) => {
    if (logDataFlag) {
      setData((state) => [...state, {
        type: 'devicemotion',
        acceleration,
        accelerationIncludingGravity,
        rotationRate,
        interval,
        time: Date.now()
      }]);
    }
    throttleSetInfo({ acceleration, accelerationIncludingGravity, rotationRate, interval });
  }

  const startLogData = () => {
    setLogDataFlag(true);
    setData([])
  }

  const stopLogData = () => {
    setLogDataFlag(false);
    // add download url
    const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'data.json';
    link.click();
    URL.revokeObjectURL(url);
  }

  // https://dev.to/li/how-to-requestpermission-for-devicemotion-and-deviceorientation-events-in-ios-13-46g2
  const requestDeviceMotionPermission = () => {
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
      DeviceMotionEvent.requestPermission()
        .then(permissionState => {
          if (permissionState === 'granted') {
            window.addEventListener("devicemotion", deviceMotionListener, true);
          }
        })
        .catch(console.error);
    }
  }

  const requestDeviceorientationPermission = () => {
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission()
        .then(permissionState => {
          if (permissionState === 'granted') {
            window.addEventListener("deviceorientation", deviceOrientationListener);
          }
        })
        .catch(console.error);
    }
  }

  useEffect(() => {
    window.addEventListener("devicemotion", deviceMotionListener, true);
    window.addEventListener("deviceorientation", deviceOrientationListener);
  }, [])

  return (
    <div class="flex flex-col gap-4 w-full">
      <div class="flex flex-col gap-2">
        <p class="text-gray-400">IOS 需要用户点击按钮获取传感器器权限</p>
        <button onClick={requestDeviceMotionPermission} class="border-1 p-1">requestDeviceMotionPermission</button>
        <button onClick={requestDeviceorientationPermission} class="border-1 p-1">requestDeviceorientationPermission</button>
      </div>
      <p class="text-gray-300">数据基本是一直在更新，页面每 0.5s 更新一次最后获取的数据。相关 API: </p>
      <ul class="text-blue-300 text-underline">
        <li><a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/devicemotion_event">Window: devicemotion event</a></li>
        <li><a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/deviceorientation_event">Window: deviceorientation event</a></li>
        <li></li>
      </ul>
      <fieldset>
        <legend>interval</legend>
        <p class="text-gray-400">一个数字，表示从设备获取数据的时间间隔（以毫秒为单位）。</p>
        <p>{info.interval} ms</p>
      </fieldset>
      <fieldset>
        <legend>acceleration</legend>
        <p class="text-gray-400">提供设备在三个轴上的加速度的对象：x、y 和 z。加速度以 m/s² 表示。</p>
        <p>X: {info.acceleration.x} m/s²</p>
        <p>Y: {info.acceleration.y} m/s²</p>
        <p>Z: {info.acceleration.z} m/s²</p>
      </fieldset>

      <fieldset>
        <legend>accelerationIncludingGravity</legend>
        <p class="text-gray-400">一个对象，在重力作用下，在三个轴上提供设备的加速度：x、y 和 z。加速度以 m/s² 表示。</p>
        <p>X: {info.accelerationIncludingGravity.x} m/s²</p>
        <p>Y: {info.accelerationIncludingGravity.y} m/s²</p>
        <p>Z: {info.accelerationIncludingGravity.z} m/s²</p>
      </fieldset>

      <fieldset>
        <legend>rotationRate</legend>
        <p class="text-gray-400">一个对象，给出设备方向在三个方向轴上的变化率：alpha、beta 和 gamma。旋转速率以每秒度数表示。</p>
        <p>alpha: {info.rotationRate.alpha} degree/s</p>
        <p>beta: {info.rotationRate.beta} degree/s</p>
        <p>gamma: {info.rotationRate.gamma} degree/s</p>
      </fieldset>

      <fieldset>
        <legend>deviceorientation</legend>
        <p class="text-gray-400">磁力计收集的，与地球坐标系相比的方向数据。</p>
        <p>alpha: {info.deviceOrientation.alpha}</p>
        <p>beta: {info.deviceOrientation.beta}</p>
        <p>gamma: {info.deviceOrientation.gamma}</p>
      </fieldset>
      <div class="flex flex-col gap-2">
        {!logDataFlag && (<button onClick={startLogData} class="border-1 p-1">Start Log Data</button>)}
        {logDataFlag && (<button onClick={stopLogData} class="border-1 p-1">Stop Log Data</button>)}
      </div>
    </div >
  );
}
