const modal = document.getElementById('introModal');
const continueBtn = document.getElementById('continueBtn');

if (modal) {
  modal.classList.add('show');
}

if (continueBtn) {
  continueBtn.addEventListener('click', () => {
    if (modal) {
      modal.classList.remove('show');
    }
  });
}
