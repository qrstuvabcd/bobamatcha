fetch("https://generativelanguage.googleapis.com/v1beta/models?key=AIzaSyCO3_Nhrz0WyyUbGzo2lMf2e5Qe4PePjDs").then(r => r.json()).then(d => { console.log(d.models.map(m => m.name).join('\n')); });
