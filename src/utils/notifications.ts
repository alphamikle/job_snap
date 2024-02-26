export const successColor = 'rgba(0, 123, 255, 0.9)';
export const errorColor = 'rgba(231, 76, 60, 0.9)';

export function showNotification(content = 'Copied', color = successColor, shouldShake = false) {
  const notification = document.createElement('div');

  notification.textContent = content;
  notification.style.position = 'fixed';
  notification.style.top = '20px';
  notification.style.right = '-200px';
  notification.style.backgroundColor = color;
  notification.style.color = 'white';
  notification.style.padding = '10px 20px';
  notification.style.borderRadius = '5px';
  notification.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
  notification.style.zIndex = '1000';
  notification.style.fontFamily = 'Arial, sans-serif';
  notification.style.fontSize = '1em';
  notification.style.textAlign = 'center';
  notification.style.opacity = '0';
  notification.style.transition = 'right 0.45s ease, opacity 0.45s ease';

  const shakeKeyframes = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            50% { transform: translateX(10px); }
            75% { transform: translateX(-10px); }
        }
    `;

  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = shakeKeyframes;

  document.head.appendChild(styleSheet);
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.right = '20px';
    notification.style.opacity = '1';
  }, 100);

  if (shouldShake) {
    setTimeout(() => {
      notification.style.animation = 'shake 0.4s ease-in-out 0s 1';
    }, 650);
  }

  setTimeout(() => {
    notification.style.right = '-200px';
    notification.style.opacity = '0';
    setTimeout(() => notification.remove(), 500);
    setTimeout(() => styleSheet.remove(), 500);
  }, 4000);
}