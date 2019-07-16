/**
 * 如果你和我一样在使用 monocloud, 这里有一个便捷的脚本来获取 mono 家配置并生成相应的 surge 配置项
 * 
 * **如何使用**  
 * 1. 首先打开 mono 的服务器页，就是你用 SS 扫描二维码的地方
 * 2. 把下面的脚本复制后粘贴到浏览器 console 里
 * 3. console 会输出生成的配置，把配置 copy 出来放进 surge 配置文件的 [Proxy] 下就好
 * 
 * **问题**  
 * 1. 目前没有找到支持 protocol 的 surge 配置，所以脚本输出里忽略了有 protocol 的配置项
 * 2. 脚本写得很随意，在正确的页可以执行，如果页面进错或是有更新/改动，或是浏览器版本略低，都可能执行失败
 *
 * **备注**  
 * 1. 如果执行失败，你可以自己改一下，就几行代码而已
 * 2. 配置格式 `Proxy = custom, server, port, aes-128-gcm, password, http://example.com/SSEncrypt.module`
 * 3. 配置完成后，如果你碰巧也在配置 surge 的 proxy group, 这个属性的 key 是 Proxy Group, 记在这里防止我自己忘掉
 */


var containers = $('.card-box.mb-2');

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
  var entries = $(c).find('p');
  entries.each((index, entry) => {
    info = {...info, ...parseEntry(index, entry)};
  });
  if (!info.protocol) {
    console.log(stringup(info));
  }
}

function parseEntry(index, entry) {
  var rawKeyContent = $(entry).find('b').html() || '';
  var key = rawKeyContent
    .split(' ')
    .join('')
    .trim()
    .split(':')
    .join('')
    .trim();

  if (!key) {
    return undefined;
  }

  var value = ($(entry).text() || '').substr(rawKeyContent.length).trim();
  return {[key.toLowerCase()]: value};
}

function stringup(info) {
  var {title, location, supportservice, hostname, port, password, method, protocol, protocolparam} = info;
  var moduleUrl = 'https://raw.githubusercontent.com/peterlikesnoodles/shadowsucks/master/sse.module';
  let comment = '# [' + title + '] - ' + location;
  if (supportservice) {
    comment += ' - ' + supportservice;
  }
  // Proxy = custom, server, port, aes-128-gcm, password, http://example.com/SSEncrypt.module
  let proxy = title + ' = ';
  proxy += ['custom', hostname, port, method, password, moduleUrl].join(', ');

  return comment + '\n' + proxy;
}
