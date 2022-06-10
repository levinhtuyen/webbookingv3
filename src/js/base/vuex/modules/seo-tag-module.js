const MODULE_NAME = 'seoTagModule';

const MUTATIONS_KEY = {};

const COMMIT_KEY = {};

const ACTIONS_KEY = {};

// NOTE - define total seo tags comment need to collect
const _totalSEOTagComment = 5;

// NOTE - define method to find seo comment
const _findComments = function(el) {
  const objSEOComments = {};
  let seoCommentCounter = 0;

  for(let i = 0; i < el.childNodes.length; i++) {
    const node = el.childNodes[i];
    if(
      node.nodeType === 8 &&
      /^[\s?]*(title|keywords|og\:description|description|twitter:title)[\s?]*$/g.test(node.textContent)
    ) {
      objSEOComments[node.textContent.trim()] = node;
      seoCommentCounter++;

      // NOTE - after push item into arr, if seoCommentCounter === total seo tag comment then break loop to save times
      if(
        _totalSEOTagComment !== 0 &&
        seoCommentCounter === _totalSEOTagComment
      ) {
        break;
      }
    }
  }
  return objSEOComments;
};

const _seoTagCommentList = _findComments(document.head);

// NOTE - define initial object for meta tag
const _elMetaTagInitial = document.createElement('meta');
const _objMetaTagInfoInitial = {
  title: {
    tag: document.createElement('title'),
    comment: _seoTagCommentList.title || null,
  },
  keywords: {
    tag: _elMetaTagInitial.setAttribute('name', 'keywords'),
    comment: _seoTagCommentList.keywords || null,
  },
  description: {
    tag: _elMetaTagInitial.setAttribute('name', 'description'),
    comment: _seoTagCommentList.description || null,
  },
  'og:description': {
    tag: _elMetaTagInitial.setAttribute('property', 'og:description'),
    comment: _seoTagCommentList['og:description'],
  },
  'twitter:title': {
    tag: _elMetaTagInitial.setAttribute('name', 'twitter:title'),
    comment: _seoTagCommentList['twitter:title'],
  },
};

const seoTagModule = {
  namespaced: true,

  state: {
    metaTagInfo: _objMetaTagInfoInitial,
  },
};

export {
  MODULE_NAME,
  seoTagModule,
}
