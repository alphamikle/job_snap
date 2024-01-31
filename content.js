const jobPrefixRegExp = /^\s*\W*/;
const jobPostfixRegExp = /\s*\W*$/;
const salaryRegExp = /(\$[0-9,]+)(\/(yr|hr))(\s*-\s*\$[0-9,]+)?/g;

const holidays = 30;
const workingHours = 8;
const workingHoursInTheYear = 2080;
const mainKey = 'e';
const salaryPerHour = 'hr';
const salaryPerYear = 'yr';

function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function clearJobUrl(rawUrl) {
  const parsedUrl = new URL(rawUrl);
  return `${parsedUrl.origin}${parsedUrl.pathname}`;
}

async function copyTextToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    console.log('Job data copied!');
  } catch (err) {
    console.error(`Error on copy job data to clipboard`, err);
  }
}

function buildRow(jobTitle, jobLink, companyName, companyLink, salaryFrom, salaryTo, date) {
  return `${companyName}\t${companyLink}\t${jobTitle}\t${jobLink}\t${salaryFrom}\t${salaryTo}\t${date}`;
}

function findSalaryDetails() {
  const elements = document.querySelectorAll('.job-details-jobs-unified-top-card__job-insight');
  let result = [];

  const searchInNode = (node) => {
    if (result.length > 0) {
      return;
    }

    if (node.nodeType === Node.TEXT_NODE) {
      let match;
      while ((match = salaryRegExp.exec(node.nodeValue)) !== null) {
        const salaryType = match[3];
        const firstAmount = parseInt(match[1].replace(/\$/g, '').replace(/,/g, ''));
        let secondAmount = null;

        if (match[4]) {
          secondAmount = parseInt(match[4].replace(/\$/g, '').replace(/,/g, '').replace(/-/g, '').trim());
        }

        if (secondAmount) {
          result.push(salaryType, firstAmount, secondAmount);
        } else {
          result.push(salaryType, firstAmount);
        }
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      Array.from(node.childNodes).forEach(searchInNode);
    }
  };

  for (const element of elements) {
    if (result.length > 0) {
      break;
    }
    searchInNode(element);
  }

  return result;
}

function showNotification(content = 'Copied', color = 'rgba(0, 123, 255, 0.9)', shouldShake = false) {
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

async function copyData() {
  const jobParentNode = document.querySelector('.job-details-jobs-unified-top-card__job-title');
  const jobNode = jobParentNode.querySelector('a');
  const jobTitle = jobNode.textContent
    .replace(jobPrefixRegExp, '')
    .replace(jobPostfixRegExp, '');
  const jobLink = clearJobUrl(jobNode.href);
  const companyNode = document.querySelector('.job-details-jobs-unified-top-card__primary-description-container .app-aware-link');
  const companyName = companyNode.textContent;
  const companyLink = companyNode.href;
  let salaryFrom = '';
  let salaryTo = '';
  const salaryInfo = findSalaryDetails();

  if (salaryInfo.length > 0) {
    const salaryType = salaryInfo[0];
    const rangeFrom = salaryInfo[1];
    const rangeTo = salaryInfo[2];

    if (salaryType === salaryPerYear) {
      if (rangeFrom) {
        salaryFrom = `=${rangeFrom}`;
      }
      if (rangeTo) {
        salaryTo = `=${rangeTo}`;
      }
    } else if (salaryType === salaryPerHour) {
      if (rangeFrom) {
        salaryFrom = `=${rangeFrom}*(${workingHoursInTheYear}-${holidays}*${workingHours})`;
      }
      if (rangeTo) {
        salaryTo = `=${rangeTo}*(${workingHoursInTheYear}-${holidays}*${workingHours})`;
      }
    }
  }

  const date = getTodayDate();
  const row = buildRow(jobTitle, jobLink, companyName, companyLink, salaryFrom, salaryTo, date);
  await copyTextToClipboard(row);
}

document.addEventListener('keydown', async function (event) {
  if ((event.ctrlKey || event.metaKey) && event.key === mainKey) {
    try {
      await copyData();
      showNotification();
    } catch (error) {
      console.error('Error on copying the data.\nIf you seeing this message all the time, please contact with me:\nalphamikle@gmail.com\nand attach this error information:', '\n', error);
      showNotification('Error on copying. See the console for more details', 'rgba(231, 76, 60, 0.9)', true);
    }
  }
});

console.log('JobSnap is working!');