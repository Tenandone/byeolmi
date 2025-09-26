async function loadView(view){
  const res = await fetch(`/partials/${view}.html`);
  if(res.ok){
    document.getElementById('app').innerHTML = await res.text();
    if(view === 'home') initHome();
    if(view === 'list') initList();
  }
}

function navigate(path){
  history.pushState(null,'',path);
  render();
}

function render(){
  const path = location.pathname;
  if(path === '/' || path === '/index.html') loadView('home');
  else if(path === '/gangnam') loadView('list');
  else document.getElementById('app').innerHTML = `<p>페이지 없음</p>`;
}

window.addEventListener('popstate', render);
document.addEventListener('DOMContentLoaded', ()=>{
  document.body.addEventListener('click',e=>{
    const a = e.target.closest('a[data-link]');
    if(a && a.origin === location.origin){
      e.preventDefault();
      navigate(a.getAttribute('href'));
    }
  });
  render();
});
