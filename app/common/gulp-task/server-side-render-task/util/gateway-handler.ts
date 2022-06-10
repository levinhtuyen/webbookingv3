// NOTE - Define black list regex
const BLACK_LIST_REGEX : RegExp = /.js|.ico|\/(image|js|css|language)\//;

export function isWhitePath(path) {
  return !BLACK_LIST_REGEX.test(path);
} // isWhitePath()
