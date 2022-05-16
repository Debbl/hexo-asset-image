'use strict';
var cheerio = require('cheerio');

// http://stackoverflow.com/questions/14480345/how-to-get-the-nth-occurrence-in-a-string
function getPosition(str, m, i) {
    return str.split(m, i).join(m).length;
}

hexo.extend.filter.register('after_post_render', function(data) {
    var config = hexo.config;
    if (config.post_asset_folder) {
        var link = data.permalink;
        var beginPos = getPosition(link, '/', 3) + 1;
        // In hexo 3.1.1, the permalink of "about" page is like ".../about/index.html".
        var endPos = link.lastIndexOf('/') + 1;
        link = link.substring(beginPos, endPos);

        var toprocess = ['excerpt', 'more', 'content'];
        for (var i = 0; i < toprocess.length; i++) {
            var key = toprocess[i];

            var $ = cheerio.load(data[key], {
                ignoreWhitespace: false,
                xmlMode: false,
                lowerCaseTags: false,
                decodeEntities: false
            });

            $('img').each(function() {
                // For windows style path, we replace '\' to '/'.
                var src = $(this).attr('src').replace('\\', '/');
                if (!/http[s]*.*|\/\/.*/.test(src)) {
                    // For "about" page, the first part of "src" can't be removed.
                    // In addition, to support multi-level local directory.
                    var linkArray = link.split('/').filter(function(elem) {
                        return elem != '';
                    });
                    var srcArray = src.split('/').filter(function(elem) {
                        return elem != '';
                    });
                    if (linkArray[linkArray.length - 1] == srcArray[0])
                        srcArray.shift();
                    src = srcArray.join('/');

                    var root = config.root && config.root.endsWith('/') ? config.root : '/'

                    var abbrlink = data.abbrlink;
                    if (abbrlink) {
                        if (src.indexOf(abbrlink) > -1) {
                            // 使用 hexo asset_img：{% asset_img 20190522103754.jpg %}

                            // root = /
                            // link = posts/
                            // abbrlink = d6d2f549
                            // src = d6d2f549/20190522103754.jpg
                            $(this).attr('src', root + link + src);
                        } else {
                            // 使用 markdown 标准语法：![图片](title/20190522103754.jpg)
                            // 或者 typora 其中一个用法：![图片](20190522103754.jpg)

                            // root = /
                            // link = posts/
                            // abbrlink = d6d2f549
                            // src = title/20190522103754.jpg
                            // 或者 src = 20190522103754.jpg
                            // if (src.indexOf('/') > -1) {
                            //     src = src.substring(src.lastIndexOf('/') + 1);
                            // }
                            src = src.split(srcArray[1])[1];
                            $(this).attr('src', root + link + abbrlink + src);
                        }
                    } else {
                        $(this).attr('src', root + link + src);
                    }
                }
            });
            data[key] = $.html();
        }
    }
});
