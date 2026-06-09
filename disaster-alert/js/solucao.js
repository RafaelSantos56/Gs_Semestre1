// =====================================================
// DisasterAlert — js/solucao.js
// Página: Como resolvemos o problema
// =====================================================

document.addEventListener('DOMContentLoaded', () => {

  // === ANIMAÇÃO DE ENTRADA NOS STEPS ===
  const steps = document.querySelectorAll('.narrative-step');

  const stepObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateX(0)';
        }, i * 120);
        stepObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  steps.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateX(-16px)';
    el.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
    stepObserver.observe(el);
  });

  // === ANIMAÇÃO DE ENTRADA NOS IMPACTO CARDS ===
  const impactoCards = document.querySelectorAll('.impacto-card');

  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, i * 100);
        cardObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  impactoCards.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    cardObserver.observe(el);
  });

  // === ANIMAÇÃO DE ENTRADA NO HERO ===
  const hero = document.querySelector('.solucao-hero');
  if (hero) {
    hero.style.opacity = '0';
    hero.style.transform = 'translateY(-10px)';
    hero.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    requestAnimationFrame(() => {
      setTimeout(() => {
        hero.style.opacity = '1';
        hero.style.transform = 'translateY(0)';
      }, 80);
    });
  }

});