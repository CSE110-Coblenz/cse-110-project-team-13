"use strict";
// howto.ts
document.addEventListener('DOMContentLoaded', () => {
    const openBtn = document.getElementById('how-to-play');
    const dlg = document.getElementById('howto-dialog');
    if (!openBtn || !dlg)
        return;
    openBtn.addEventListener('click', () => {
        if (typeof dlg.showModal === 'function') {
            dlg.showModal();
        }
        else {
            dlg.setAttribute('open', '');
        }
    });
    dlg.addEventListener('click', (e) => {
        const rect = dlg.getBoundingClientRect();
        const inBox = e.clientX >= rect.left && e.clientX <= rect.right &&
            e.clientY >= rect.top && e.clientY <= rect.bottom;
        if (!inBox)
            dlg.close();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && dlg.open)
            dlg.close();
    });
});
