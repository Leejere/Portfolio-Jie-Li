const sections = document.querySelectorAll('section');
const navLi = document.querySelectorAll('nav .nav-container ul li')

window.addEventListener('scroll', ()=>{
    let current = '';
    sections.forEach(section =>{
        const sectionTop = section.offsetTop-600;
        const sectionHeight = section.clientHeight;
        if(scrollY >= sectionTop){
            current = section.getAttribute('id');
        }
    })
    
    navLi.forEach(li =>{
        li.classList.remove('active');
        if(li.classList.contains(current)){
            li.classList.add('active')
        }
    })
})