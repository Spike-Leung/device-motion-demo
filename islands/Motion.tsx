import { useState } from "preact/hooks";

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
  window.addEventListener("devicemotion", ({ acceleration, accelerationIncludingGravity, rotationRate }) => {
    setInfo({ ...info, acceleration, accelerationIncludingGravity, rotationRate });
  }, true);

  window.addEventListener("deviceorientation", (event) => {
    setInfo({ ...info, deviceorientation: event });
  });

  return (
    <div class="flex-column gap-2 w-full">
      <fieldset>
        <legend>acceleration</legend>
        <p>X: {info.acceleration.x}</p>
        <p>Y: {info.acceleration.y}</p>
        <p>Z: {info.acceleration.z}</p>
      </fieldset>

      <fieldset>
        <legend>accelerationIncludingGravity</legend>
        <p>X: {info.accelerationIncludingGravity.x}</p>
        <p>Y: {info.accelerationIncludingGravity.y}</p>
        <p>Z: {info.accelerationIncludingGravity.z}</p>
      </fieldset>

      <fieldset>
        <legend>rotationRate</legend>
        <p>X: {info.rotationRate.x}</p>
        <p>Y: {info.rotationRate.y}</p>
        <p>Z: {info.rotationRate.z}</p>
      </fieldset>

      <fieldset>
        <legend>deviceorientation</legend>
        <p>alpha: {info.deviceOrientation.alpha}</p>
        <p>beta: {info.deviceOrientation.beta}</p>
        <p>gamma: {info.deviceOrientation.gamma}</p>
      </fieldset>
    </div >
  );
}
