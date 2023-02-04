import { lightbox } from './lightbox';

async function scrollPage() {
    const {height: cardHeight} = document.querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

    window.scrollBy({
        top: cardHeight * 0.75,
        behavior: 'smooth',
    });
    lightbox.refresh();
}

export {scrollPage};
