// 获取DOM元素
const timer = document.getElementById('timer');
const yearsEl = document.getElementById('years');
const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const customTextEl = document.getElementById('custom-text');
const backgroundMusic = document.getElementById('background-music');
const vinylSection = document.querySelector('.vinyl-player-section');
const tonearm = document.querySelector('.tonearm');
const record = document.querySelector('.record');

// 默认设置
let settings = {
    eventName: '我们相识',
    startDate: new Date('2023-01-01').getTime() // 默认日期
};

// 从本地存储加载设置
function loadSettings() {
    const savedSettings = localStorage.getItem('timerSettings');
    if (savedSettings) {
        settings = JSON.parse(savedSettings);
        customTextEl.textContent = settings.eventName;
    } else {
        // 使用默认值
        customTextEl.textContent = settings.eventName;
    }
}

// 控制背景音乐播放/暂停
function playMusic() {
    backgroundMusic.play()
        .then(() => {
            tonearm.classList.add('playing');
            record.classList.add('playing');
        })
        .catch(error => {
            console.error('播放音乐失败:', error);
        });
}

function pauseMusic() {
    backgroundMusic.pause();
    tonearm.classList.remove('playing');
    record.classList.remove('playing');
}

// 计算并更新时间差
function updateTimer() {
    const now = new Date().getTime();
    const startTime = settings.startDate;
    const timeDiff = now - startTime;
    
    if (timeDiff < 0) {
        // 如果开始日期在未来
        timer.innerHTML = '<span style="color: #888;">时间还未开始</span>';
        return;
    }
    
    // 计算年、天、时、分、秒
    const millisecondsInSecond = 1000;
    const millisecondsInMinute = millisecondsInSecond * 60;
    const millisecondsInHour = millisecondsInMinute * 60;
    const millisecondsInDay = millisecondsInHour * 24;
    const millisecondsInYear = millisecondsInDay * 365.25; // 考虑闰年
    
    const years = Math.floor(timeDiff / millisecondsInYear);
    const days = Math.floor((timeDiff % millisecondsInYear) / millisecondsInDay);
    const hours = Math.floor((timeDiff % millisecondsInDay) / millisecondsInHour);
    const minutes = Math.floor((timeDiff % millisecondsInHour) / millisecondsInMinute);
    const seconds = Math.floor((timeDiff % millisecondsInMinute) / millisecondsInSecond);
    
    // 更新DOM
    yearsEl.textContent = years;
    daysEl.textContent = days;
    hoursEl.textContent = hours.toString().padStart(2, '0');
    minutesEl.textContent = minutes.toString().padStart(2, '0');
    secondsEl.textContent = seconds.toString().padStart(2, '0');
}

// 增强向日葵动画效果
function enhanceSunflowerAnimation() {
    const sunflower = document.querySelector('.sunflower');
    
    // 随机微调摆动幅度，使动画更自然
    setInterval(() => {
        const randomAngle = Math.random() * 2 - 1; // -1到1之间的随机数
        const currentAngle = parseFloat(getComputedStyle(sunflower).getPropertyValue('--random-angle') || '0');
        const newAngle = currentAngle + randomAngle;
        
        // 限制角度范围在-8到8度之间
        const clampedAngle = Math.max(-8, Math.min(8, newAngle));
        sunflower.style.setProperty('--random-angle', clampedAngle);
        
        // 应用随机角度
        sunflower.style.transform = `rotate(${clampedAngle}deg)`;
    }, 2000); // 每2秒微调一次
}

// 唱片机交互
function initVinylPlayer() {
    // 初始状态只显示唱针特写
    vinylSection.classList.add('initial');
    
    // 点击唱针播放音乐并展示完整唱片机
    tonearm.addEventListener('click', () => {
        if (backgroundMusic.paused) {
            vinylSection.classList.remove('initial');
            vinylSection.classList.add('expanded');
            playMusic();
            
            // 延迟后允许滚动到计时器部分
            setTimeout(() => {
                vinylSection.classList.remove('expanded');
                vinylSection.classList.add('collapsed');
            }, 3000);
        } else {
            pauseMusic();
        }
    });
}

// 页面可见性变化时处理音乐
document.addEventListener('visibilitychange', () => {
    if (document.hidden && !backgroundMusic.paused) {
        // 页面不可见时暂停音乐
        pauseMusic();
    }
});

// 初始化
loadSettings();
setInterval(updateTimer, 1000); // 每秒更新一次
updateTimer(); // 立即更新一次
enhanceSunflowerAnimation();
initVinylPlayer();