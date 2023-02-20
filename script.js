const wrapper = document.querySelector('.wrapper')
const container = document.querySelector('.container')
const searchInput = document.querySelector('.search');
const searchOptions = document.querySelector('.options');
const btnClose = document.querySelector('.btn-close')

function debounce(fn, debounceTime) {
    let timer

    return function (...args) {
        clearTimeout(timer)

        timer = setTimeout(() => fn.call(this, ...args), debounceTime)
    }
}



searchInput.addEventListener('keyup', debounce(async (e) => {
    if (e.target.value.length == 0) {
        let links = document.querySelectorAll('.dropdown-content');
        links.forEach(i => i.remove());
    } else {
        searchOptions.innerHTML = ''
        fetch(`https://api.github.com/search/repositories?q=${e.target.value}&per_page=5`)

            .then(response => {
                if (response.ok) {
                    response.json()
                    .then(data => {
                        let links = document.querySelectorAll('.dropdown-content');
                        links.forEach(i => i.remove());
                        
                        data.items.forEach(items => {
                            let links = document.createElement('li');
                            links.classList.add('dropdown-content');
                            
                            links.addEventListener('click', (e) => {
                                const name = items.name;
                                const owner = items.owner.login;
                                const stars = items.stargazers_count;
                                
                                const chosen = document.createElement('div');
                                chosen.classList.add('chosen');
                                container.appendChild(chosen)

                                const buttonClose = document.createElement('button');
                                buttonClose.classList.add('btn-close')

                                chosen.insertAdjacentElement('afterend', buttonClose)
                                
                                const text = `<b>Name</b>: ${name}<br><b>Owner</b>: ${owner}<br><b>Stars</b>:${stars}`;

                                buttonClose.addEventListener('click', (e) => {
                                    chosen.remove();
                                    buttonClose.remove()
                                })
                                chosen.insertAdjacentHTML('afterbegin', text)
                            }, {once: true})

                            links.textContent = items.name;
                            searchOptions.appendChild(links)
                        })

                        
                    })

                }
            })


    }
}, 500))

searchInput.addEventListener('keydown', function(e) {
    if (e.which === 32) {
      e.preventDefault();
    }
  });

const links = searchOptions.querySelectorAll('.dropdown-content');
