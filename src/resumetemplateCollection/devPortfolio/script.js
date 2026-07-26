
        // Simple scroll spy and active nav state
        window.addEventListener('scroll', () => {
            const sections = document.querySelectorAll('section');
            const navLinks = document.querySelectorAll('nav div a');
            
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (window.pageYOffset >= (sectionTop - 150)) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('text-primary', 'font-bold', 'border-b-2', 'border-primary', 'pb-1');
                link.classList.add('text-on-surface-variant');
                if (link.getAttribute('href').includes(current) && current !== '') {
                    link.classList.add('text-primary', 'font-bold', 'border-b-2', 'border-primary', 'pb-1');
                    link.classList.remove('text-on-surface-variant');
                }
            });
        });
    
