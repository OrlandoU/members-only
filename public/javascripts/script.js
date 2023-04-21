window.addEventListener('click', ()=>{
    document.querySelector('#expand-menu').checked = false
})
document.querySelector('#expand-menu-label').addEventListener('click', (e)=>{
    e.stopPropagation()
    checkbox.checked = true
})
const checkbox = document.querySelector('.expand-menu')
checkbox.addEventListener('click', (e)=>{
    e.stopPropagation()
})

