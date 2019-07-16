const containers = $('.card-box.mb-2');

containers.each(parseContainer);

function parseContainer(index, c) {
  info = {
    title: ($(c).find('.media-body > h4').html() || '').trim(),
    // location: '',
    // service: '',
    // hostname: '',
    // port: '',
    // password: '',
    // method: '',
    // protocol: '',
    // protocolParam: '',
  };
  const entries = $(c).find('p');
  entries.each((index, entry) => {
    info = {...info, ...parseEntry(index, entry)};
  });
  if (!info.protocol) {
    console.log(stringup(info));
  }
}

function parseEntry(index, entry) {
  const rawKeyContent = $(entry).find('b').html() || ''
  const key = rawKeyContent
    .split(' ')
    .join('')
    .trim()
    .split(':')
    .join('')
    .trim();

  if (!key) {
    return undefined;
  }

  const value = ($(entry).text() || '').substr(rawKeyContent.length).trim();
  return {[key.toLowerCase()]: value};
}

function stringup(info) {
  const {title, location, supportservice, hostname, port, password, method, protocol, protocolparam} = info;
  const moduleUrl = 'https://raw.githubusercontent.com/peterlikesnoodles/shadowsucks/master/sse.module';
  let comment = '# [' + title + '] - ' + location;
  if (supportservice) {
    comment += ' - ' + supportservice;
  }
  // Proxy = custom, server, port, aes-128-gcm, password, http://example.com/SSEncrypt.module
  let proxy = title + ' = ';
  proxy += ['custom', hostname, port, method, password, moduleUrl].join(', ');

  return comment + '\n' + proxy;
}


