// 전역 변수
let bgmAudio;
let isPlaying = false;

// DOM이 로드되면 실행
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// 앱 초기화
function initializeApp() {
    // 로딩 화면 처리
    handleLoadingScreen();
    
    // BGM 초기화
    initializeBGM();
    
    // 네비게이션 초기화
    initializeNavigation();
    
    // 씬 탭 초기화
    initializeSceneTabs();
    
    // 갤러리 초기화
    initializeGallery();
    
    // 스크롤 효과 초기화
    initializeScrollEffects();
    
    // 비 효과 생성
    createRainEffect();
}

// 로딩 화면 처리
function handleLoadingScreen() {
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.classList.add('fade-out');
        
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 2000);
}

// BGM 초기화
function initializeBGM() {
    bgmAudio = document.getElementById('bgm-audio');
    const bgmButton = document.getElementById('bgm-toggle');
    
    bgmButton.addEventListener('click', toggleBGM);
    
    // 사용자 상호작용 후 자동 재생 시도
    document.addEventListener('click', function() {
        if (!isPlaying && bgmAudio.paused) {
            // 첫 클릭 시 BGM 자동 재생 시도
            playBGM();
        }
    }, { once: true });
}

// BGM 토글
function toggleBGM() {
    if (isPlaying) {
        pauseBGM();
    } else {
        playBGM();
    }
}

// BGM 재생
function playBGM() {
    bgmAudio.play().then(() => {
        isPlaying = true;
        document.getElementById('bgm-toggle').classList.add('playing');
    }).catch(error => {
        console.log('BGM 재생 실패:', error);
    });
}

// BGM 일시정지
function pauseBGM() {
    bgmAudio.pause();
    isPlaying = false;
    document.getElementById('bgm-toggle').classList.remove('playing');
}

// 네비게이션 초기화
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const navigation = document.querySelector('.navigation');
    
    // 스크롤 시 네비게이션 스타일 변경
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navigation.classList.add('scrolled');
        } else {
            navigation.classList.remove('scrolled');
        }
        
        // 현재 섹션 활성화
        updateActiveSection();
    });
    
    // 네비게이션 클릭 이벤트
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// 현재 활성 섹션 업데이트
function updateActiveSection() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// 씬 탭 초기화
function initializeSceneTabs() {
    const sceneTabs = document.querySelectorAll('.scene-tab');
    const scenes = document.querySelectorAll('.scene');
    
    sceneTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetScene = tab.getAttribute('data-scene');
            
            // 모든 탭과 씬 비활성화
            sceneTabs.forEach(t => t.classList.remove('active'));
            scenes.forEach(s => s.classList.remove('active'));
            
            // 선택된 탭과 씬 활성화
            tab.classList.add('active');
            document.getElementById(`scene-${targetScene}`).classList.add('active');
        });
    });
}

// 갤러리 초기화
function initializeGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = lightbox.querySelector('.lightbox-content');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    
    // 갤러리 아이템 클릭 이벤트
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const imageSrc = item.getAttribute('data-src');
            lightboxImage.src = imageSrc;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
    
    // 라이트박스 닫기
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    lightboxClose.addEventListener('click', closeLightbox);
    
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // ESC 키로 닫기
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
}

// 스크롤 효과 초기화
function initializeScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // 애니메이션 대상 요소들
    const animatedElements = document.querySelectorAll(
        '.info-card, .phase-card, .rel-card, .inner-card, .dialogue-card, .stage-card, .gallery-item'
    );
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// 비 효과 생성
function createRainEffect() {
    const rainContainer = document.querySelector('.rain-container');
    if (!rainContainer) return;
    
    // 비 파티클 생성
    for (let i = 0; i < 100; i++) {
        const drop = document.createElement('div');
        drop.classList.add('rain-drop');
        drop.style.cssText = `
            position: absolute;
            left: ${Math.random() * 100}%;
            top: -10px;
            width: 1px;
            height: ${Math.random() * 20 + 10}px;
            background: rgba(255, 255, 255, ${Math.random() * 0.3 + 0.1});
            animation: fall ${Math.random() * 1 + 0.5}s linear infinite;
            animation-delay: ${Math.random() * 2}s;
        `;
        rainContainer.appendChild(drop);
    }
    
    // 비 떨어지는 애니메이션 추가
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fall {
            to {
                transform: translateY(100vh);
            }
        }
        .fade-in-visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

// 마우스 호버 효과 (강아지 발랄함 표현)
document.addEventListener('mousemove', (e) => {
    const heroCharacter = document.querySelector('.hero-character-img');
    if (!heroCharacter) return;
    
    const rect = heroCharacter.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const angleX = (e.clientY - centerY) / 30;
    const angleY = (e.clientX - centerX) / 30;
    
    heroCharacter.style.transform = `perspective(1000px) rotateX(${-angleX}deg) rotateY(${angleY}deg)`;
});

// 마우스가 떠나면 원래대로
document.addEventListener('mouseleave', () => {
    const heroCharacter = document.querySelector('.hero-character-img');
    if (heroCharacter) {
        heroCharacter.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    }
}); 