/**
 * 全屏翻页效果实现
 */

class FullPage {
    constructor(options) {
        this.container = document.querySelector(options.container || '.fullpage-container');
        this.sections = Array.from(document.querySelectorAll(options.section || '.section'));
        this.currentIndex = 0;
        this.isAnimating = false;
        this.animationDuration = options.animationDuration || 1000; // 动画持续时间
        this.showPagination = options.pagination !== false;
        this.showScrollHint = options.scrollHint !== false;
        
        this.init();
    }
    
    init() {
        // 初始化页面状态
        this.sections.forEach((section, index) => {
            if (index === this.currentIndex) {
                section.classList.add('active');
            } else if (index < this.currentIndex) {
                section.classList.add('prev');
            } else {
                section.classList.add('next');
            }
        });
        
        // 创建分页指示器
        if (this.showPagination) {
            this.createPagination();
        }
        
        // 创建滚动提示
        if (this.showScrollHint) {
            this.createScrollHint();
        }
        
        // 添加事件监听
        this.addEventListeners();
    }
    
    createPagination() {
        const pagination = document.createElement('div');
        pagination.className = 'pagination';
        
        this.sections.forEach((_, index) => {
            const bullet = document.createElement('div');
            bullet.className = 'pagination-bullet';
            if (index === this.currentIndex) {
                bullet.classList.add('active');
            }
            
            bullet.addEventListener('click', () => {
                this.goToSection(index);
            });
            
            pagination.appendChild(bullet);
        });
        
        document.body.appendChild(pagination);
        this.pagination = pagination;
    }
    
    createScrollHint() {
        const hint = document.createElement('div');
        hint.className = 'scroll-hint';
        hint.textContent = '向下滚动';
        
        this.sections[0].appendChild(hint);
        this.scrollHint = hint;
    }
    
    addEventListeners() {
        // 鼠标滚轮事件
        window.addEventListener('wheel', this.handleWheel.bind(this));
        
        // 触摸事件（移动设备）
        let touchStartY = 0;
        let touchEndY = 0;
        
        window.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
        }, { passive: true });
        
        window.addEventListener('touchmove', (e) => {
            if (this.isAnimating) return;
            touchEndY = e.touches[0].clientY;
        }, { passive: true });
        
        window.addEventListener('touchend', () => {
            if (this.isAnimating) return;
            
            const diff = touchStartY - touchEndY;
            const threshold = 50; // 滑动阈值
            
            if (diff > threshold) {
                // 向上滑动，前往下一页
                this.goToNextSection();
            } else if (diff < -threshold) {
                // 向下滑动，前往上一页
                this.goToPrevSection();
            }
        });
        
        // 键盘事件
        window.addEventListener('keydown', (e) => {
            if (this.isAnimating) return;
            
            switch (e.key) {
                case 'ArrowDown':
                case 'PageDown':
                    this.goToNextSection();
                    break;
                case 'ArrowUp':
                case 'PageUp':
                    this.goToPrevSection();
                    break;
            }
        });
    }
    
    handleWheel(e) {
        if (this.isAnimating) return;
        
        // 防止连续滚动
        e.preventDefault();
        
        if (e.deltaY > 0) {
            // 向下滚动
            this.goToNextSection();
        } else {
            // 向上滚动
            this.goToPrevSection();
        }
    }
    
    goToNextSection() {
        if (this.currentIndex < this.sections.length - 1) {
            this.goToSection(this.currentIndex + 1);
        }
    }
    
    goToPrevSection() {
        if (this.currentIndex > 0) {
            this.goToSection(this.currentIndex - 1);
        }
    }
    
    goToSection(index) {
        if (this.isAnimating || index === this.currentIndex) return;
        
        this.isAnimating = true;
        const direction = index > this.currentIndex ? 'next' : 'prev';
        const currentSection = this.sections[this.currentIndex];
        const targetSection = this.sections[index];
        
        // 更新分页指示器
        if (this.showPagination) {
            const bullets = this.pagination.querySelectorAll('.pagination-bullet');
            bullets[this.currentIndex].classList.remove('active');
            bullets[index].classList.add('active');
        }
        
        // 更新滚动提示
        if (this.showScrollHint && this.scrollHint) {
            if (index === this.sections.length - 1) {
                this.scrollHint.style.opacity = '0';
            } else {
                this.scrollHint.style.opacity = '0.7';
                this.scrollHint.textContent = index === 0 ? '向下滚动' : '继续滚动';
            }
        }
        
        // 移除当前页的active类
        currentSection.classList.remove('active');
        
        // 根据方向添加适当的类
        if (direction === 'next') {
            currentSection.classList.add('prev');
            targetSection.classList.remove('next');
        } else {
            currentSection.classList.add('next');
            targetSection.classList.remove('prev');
        }
        
        // 添加active类到目标页
        targetSection.classList.add('active');
        
        // 更新当前索引
        this.currentIndex = index;
        
        // 动画结束后重置状态
        setTimeout(() => {
            this.isAnimating = false;
            
            // 重新排列其他页面的位置
            this.sections.forEach((section, i) => {
                if (i !== this.currentIndex) {
                    section.classList.remove('prev', 'next');
                    if (i < this.currentIndex) {
                        section.classList.add('prev');
                    } else {
                        section.classList.add('next');
                    }
                }
            });
        }, this.animationDuration);
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    // 初始化唱片机和计时器部分的交互
    const vinylSection = document.querySelector('.vinyl-player-section');
    const tonearm = document.querySelector('.tonearm');
    const record = document.querySelector('.record');
    const backgroundMusic = document.getElementById('background-music');
    
    // 唱片机交互
    tonearm.addEventListener('click', () => {
        if (backgroundMusic.paused) {
            backgroundMusic.play()
                .then(() => {
                    tonearm.classList.add('playing');
                    record.classList.add('playing');
                })
                .catch(error => {
                    console.error('播放音乐失败:', error);
                });
        } else {
            backgroundMusic.pause();
            tonearm.classList.remove('playing');
            record.classList.remove('playing');
        }
    });
    
    // 初始化全屏翻页
    const fullpage = new FullPage({
        container: '.fullpage-container',
        section: '.section',
        animationDuration: 1000,
        pagination: true,
        scrollHint: true
    });
});
