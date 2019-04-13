let names = [];

const fetch = (name) => {
  return new Promise((resolve, reject) =>
    wtf.fetch(name, 'en', (err, doc) => {
      const infobox = doc.infobox(0);
      if(infobox) {
        const influences = infobox.get('influences');
        const influenced = infobox.get('influenced');
        const img = infobox.images(0) ? infobox.images(0).url() : '';
        return resolve({ influences, influenced, img })
      }
      return reject('No infobox');
    })
  );
}


const print = (name, data, action) => {
  const { influences, influenced, img } = data;
  $('#result')[action]('<br />')
  $('#result')[action]($('<img>',{src: img, width: '150px'}));
  $('#result')[action]('<br />')
  $('#result')[action](document.createTextNode(`${name}`))
  $('#result')[action]('<br />')
  $('#result')[action](document.createTextNode(`influences::, ${influences ? influences.text() : ''}`))
  $('#result')[action]('<br />')
  $('#result')[action](document.createTextNode(`influenced::, ${influenced ? influenced.text() : ''}`))
  $('#result')[action]('<br />')
}

const getInfluences = (inf) => {
  if (inf) {
    inf.links().forEach((link) => {
      fetch(link.page)
        .then((data) => {
          if(!names.includes(link.page)) {
            names.push(link.page);
            print(link.page, data, 'append')
            getInfluences(data.influences);
          }
        })
    })
  }
}

$(() => {
  $('#search').click(() => {
    const name = $('#name').val()
    fetch(name)
    .then((data) => {
      names.push(name);
      print(name, data, 'append')
      getInfluences(data.influences)
    })
  });
})