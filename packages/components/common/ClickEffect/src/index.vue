<script setup lang="ts" name="ClickEffect">
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useMediaQuery } from '@mist/composables'
import { useMistConfig } from "@mist/components/theme/ConfigProvider";
import type { ClickEffect } from "@mist/config";

const isMobile = useMediaQuery("(max-width: 768px)");

const canvas = ref<HTMLCanvasElement | null>(null);
let animationFrameId: number | null = null;
let particles: any[] = [];

const { getMistConfigRef } = useMistConfig();
const clickEffectConfig = getMistConfigRef<ClickEffect>("clickEffect", {
  enabled: false,
  textArray: ['富强', '民主', '文明', '和谐', '自由', '平等', '公正', '法治', '爱国', '敬业', '诚信', '友善'],
  fontSize: 16,
  random: false
});

// Configuration for the text effect
const textConfig = computed(() => clickEffectConfig.value);

let currentTextIndex = 0;

// 设置画布大小
function setCanvasSize() {
  const canvasEl = canvas.value;
  if (!canvasEl) return;
  
  canvasEl.width = window.innerWidth * 2;
  canvasEl.height = window.innerHeight * 2;
  canvasEl.style.width = window.innerWidth + "px";
  canvasEl.style.height = window.innerHeight + "px";
  const ctx = canvasEl.getContext("2d");
  if (ctx) {
    ctx.scale(2, 2); // Scale for high DPI displays
  }
}

// 创建文本粒子 (New function based on the script)
function createTextParticle(x: number, y: number) {
  const config = textConfig.value;
  let textToDisplay: string;
  if (config.random) {
    textToDisplay = config.textArray[Math.floor(Math.random() * config.textArray.length)];
  } else {
    textToDisplay = config.textArray[currentTextIndex];
    currentTextIndex = (currentTextIndex + 1) % config.textArray.length;
  }

  const color = getRandomColor(); // Use the color generation from the script
  const initialY = y;
  
  return {
    x,
    y,
    initialY, // Store initial Y position
    text: textToDisplay,
    color,
    fontSize: config.fontSize,
    alpha: 1, // For fading out
    speedY: -0.8,           // 向上移动速度 (更慢)
    fadeStartDistance: 25, // 开始淡出前移动距离
    fadeDuration: 50,       // 淡出持续时间(帧数)
    draw(ctx: CanvasRenderingContext2D) {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.font = `bold ${this.fontSize}px sans-serif`;
      ctx.fillStyle = this.color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.text, this.x, this.y);
      ctx.restore();
    },
    update() {
      this.y += this.speedY;
      const distanceTraveled = this.initialY - this.y;

      if (distanceTraveled < this.fadeStartDistance) {
        // Before fade start, keep alpha at 1
        this.alpha = 1;
      } else {
        // After fade start, calculate alpha based on fade duration
        const fadeProgress = (distanceTraveled - this.fadeStartDistance) / this.fadeDuration;
        this.alpha = Math.max(0, 1 - fadeProgress);
      }
      
      // Particle is considered "dead" when alpha is 0
      return this.alpha > 0;
    }
  };
}

// 动画循环 (Original function, slightly adapted for new particles)
function animate() {
  const canvasEl = canvas.value;
  if (!canvasEl) return;
  
  const ctx = canvasEl.getContext("2d");
  if (!ctx) return;
  
  ctx.clearRect(0, 0, canvasEl.width / 2, canvasEl.height / 2); // Clear scaled canvas
  
  // 更新并绘制文本粒子
  particles = particles.filter(particle => {
    const shouldKeep = particle.update();
    particle.draw(ctx);
    return shouldKeep;
  });
  
  animationFrameId = requestAnimationFrame(animate);
}

// 处理点击事件 (Modified function)
function handleClick(e: MouseEvent | TouchEvent) {
  // 检查是否启用了点击特效
  if (!clickEffectConfig.value.enabled) return;
  
  let x: number, y: number;
  
  if (e instanceof MouseEvent) {
    x = e.clientX;
    y = e.clientY;
  } else if (e instanceof TouchEvent && e.touches.length > 0) {
    x = e.touches[0].clientX;
    y = e.touches[0].clientY;
  } else {
    return;
  }
  
  // 创建一个文本粒子
  particles.push(createTextParticle(x, y));
}

// Helper function for random color (from the script)
function getRandomColor(): string {
  const chars = "0,1,2,3,4,5,6,7,8,9,a,b,c,d,e,f".split(",");
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += chars[Math.floor(16 * Math.random())];
  }
  return color;
}

onMounted(() => {
  if (isMobile.value) return;
  
  setCanvasSize();
  const tapEvent = "ontouchstart" in window ? "touchstart" : "mousedown";
  window.addEventListener(tapEvent, handleClick);
  window.addEventListener("resize", setCanvasSize);
  animate();
});

onUnmounted(() => {
  if (isMobile.value) return;
  
  const tapEvent = "ontouchstart" in window ? "touchstart" : "mousedown";
  window.removeEventListener(tapEvent, handleClick);
  window.removeEventListener("resize", setCanvasSize);
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
});
</script>

<template>
  <canvas
    v-if="clickEffectConfig.enabled"
    ref="canvas"
    style="position: fixed; left: 0; top: 0; pointer-events: none; z-index: 999999"
  ></canvas>
</template>
