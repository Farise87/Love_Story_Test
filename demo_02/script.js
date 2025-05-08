let state = false;
let btn = document.querySelector(".btn");
let record = document.querySelector(".record");
let toneArm = document.querySelector(".tone-arm");
let song = document.querySelector(".my-song");
let slider = document.querySelector(".slider");
let sunflowersContainer = document.querySelector(".sunflowers-container");
let milestoneContainer = document.querySelector(".milestone-sunflowers");

// 设置相识的起始日期 
const startDate = new Date("2025-02-07T17:35"); // 

// 创建向日葵元素函数
function createSunflower(size = 1, position = null) {
    const sunflower = document.createElement("div");
    sunflower.className = "sunflower";
    sunflower.style.transform = `scale(${size})`;
    
    // 创建12个花瓣
    for (let i = 0; i < 12; i++) {
        const petal = document.createElement("div");
        petal.className = "sunflower-petal";
        petal.style.setProperty("--rotate", `${i * 30}deg`);
        sunflower.appendChild(petal);
    }
    
    // 创建花盘中心
    const center = document.createElement("div");
    center.className = "sunflower-center";
    sunflower.appendChild(center);
    
    // 如果提供了位置，则设置位置
    if (position) {
        sunflower.style.left = position.left;
        sunflower.style.top = position.top;
    }
    
    return sunflower;
}

// 初始化向日葵
function initSunflowers() {
    // 在唱片机周围添加3-5朵向日葵
    const positions = [
        { left: "25%", top: "30%" },
        { left: "70%", top: "35%" },
        { left: "40%", top: "70%" },
        { left: "65%", top: "65%" },
    ];
    
    positions.forEach(pos => {
        const sunflower = createSunflower(1, pos);
        sunflowersContainer.appendChild(sunflower);
    });
}

// 更新时间计数器
function updateTimeCounter() {
    const now = new Date();
    const diff = now - startDate;
    
    // 计算天数、小时、分钟和秒数
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    // 更新DOM
    document.getElementById("days").textContent = days;
    document.getElementById("hours").textContent = hours;
    document.getElementById("minutes").textContent = minutes;
    document.getElementById("seconds").textContent = seconds;
    
    // 检查是否需要添加里程碑向日葵（每100天）
    if (days > 0 && days % 100 === 0 && !document.querySelector(`.milestone-day-${days}`)) {
        addMilestoneSunflower(days);
    }
    
    // 调整现有向日葵的大小（随时间增长）
    const growthFactor = Math.min(1 + (days / 365) * 0.5, 1.5); // 最大增长到150%
    document.querySelectorAll(".sunflowers-container .sunflower").forEach(flower => {
        flower.style.transform = `scale(${growthFactor})`;
    });
}

// 添加里程碑向日葵
function addMilestoneSunflower(days) {
    const sunflower = createSunflower(0.8);
    sunflower.classList.add(`milestone-day-${days}`);
    
    // 添加天数标签
    const label = document.createElement("div");
    label.className = "milestone-label";
    label.textContent = `${days}天`;
    label.style.position = "absolute";
    label.style.bottom = "-20px";
    label.style.left = "50%";
    label.style.transform = "translateX(-50%)";
    label.style.fontSize = "12px";
    label.style.fontWeight = "bold";
    label.style.color = "#d52831";
    
    sunflower.appendChild(label);
    milestoneContainer.appendChild(sunflower);
    
    // 简单的出现动画
    sunflower.style.opacity = "0";
    sunflower.style.transform = "scale(0)";
    
    setTimeout(() => {
        sunflower.style.transition = "all 1s ease";
        sunflower.style.opacity = "1";
        sunflower.style.transform = "scale(0.8)";
    }, 100);
}

// 响应式调整
function adjustResponsiveLayout() {
    const width = window.innerWidth;
    
    if (width <= 768) {
        // 移动端垂直排列
        document.querySelectorAll(".sunflowers-container .sunflower").forEach((flower, index) => {
            flower.style.left = "50%";
            flower.style.top = `${75 + index * 15}%`;
            flower.style.transform = "translateX(-50%) scale(0.8)";
        });
    } else {
        // 恢复原始位置
        initSunflowers();
    }
}

// 创建花瓣和星光粒子效果
function createPetalsEffect() {
    const container = document.getElementById('petals-container');
    const maxPetals = 50; // 最大粒子数量
    
    // 创建初始粒子
    for (let i = 0; i < maxPetals; i++) {
        setTimeout(() => {
            createPetal(container);
        }, i * 300); // 错开创建时间，使效果更自然
    }
    
    // 持续创建新粒子
    setInterval(() => {
        if (container.childElementCount < maxPetals) {
            createPetal(container);
        }
    }, 1000);
}

// 创建单个花瓣或星光
function createPetal(container) {
    const petal = document.createElement('div');
    
    // 随机决定是花瓣还是星光
    const isFlower = Math.random() > 0.5;
    petal.className = isFlower ? 'petal flower' : 'petal star';
    
    // 随机位置、大小和动画时间
    const size = isFlower ? 10 + Math.random() * 15 : 3 + Math.random() * 5;
    const left = Math.random() * 100;
    const animationDuration = 10 + Math.random() * 20;
    
    petal.style.left = `${left}%`;
    petal.style.width = `${size}px`;
    petal.style.height = `${size}px`;
    petal.style.animationDuration = `${animationDuration}s`;
    
    // 随机旋转
    petal.style.transform = `rotate(${Math.random() * 360}deg)`;
    
    // 添加到容器
    container.appendChild(petal);
    
    // 动画结束后移除元素
    setTimeout(() => {
        if (petal && petal.parentNode === container) {
            container.removeChild(petal);
        }
    }, animationDuration * 1000);
}

// 初始化
initSunflowers();
updateTimeCounter();
createPetalsEffect();

// 设置定时器，每秒更新一次时间
setInterval(updateTimeCounter, 1000);

// 监听窗口大小变化
window.addEventListener("resize", adjustResponsiveLayout);

// 原有的播放器功能
btn.addEventListener("click", () => {
    if(state == false){
        record.classList.add("on");
        toneArm.classList.add("play");
        setTimeout(() => {
            song.play();
        },1000);

    }
    else{
        record.classList.remove("on");
        toneArm.classList.remove("play");
        song.pause();

    }
    state = !state;
    
});

slider.addEventListener("input",(e) => {
    song.volume = Number(e.target.value);
});

