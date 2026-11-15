// A tiny hash router: #/thread/12 becomes { name: 'thread', params: ['12'] }.
// Hash links work when shared, because the server always sends the same page.
import { useEffect, useState } from 'react';

function parse() {
  const raw = window.location.hash.replace(/^#\/?/, '');
  const [path, query = ''] = raw.split('?');
  const [name = '', ...params] = path.split('/').filter(Boolean);
  return { name, params, query: new URLSearchParams(query) };
}

export function useRoute() {
  const [route, setRoute] = useState(parse);
  useEffect(() => {
    const onChange = () => {
      setRoute(parse());
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
}

export function go(path) {
  window.location.hash = path;
}

export function linkTo(path) {
  return `#${path}`;
}

// The full link to a post, for "Copy link" (FR-23).
export function shareLink(postId) {
  return `${window.location.origin}${window.location.pathname}#/thread/${postId}`;
}
