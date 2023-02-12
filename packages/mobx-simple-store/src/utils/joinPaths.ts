export function joinPaths(path1: string, path2: string | number) {
  if (!Number.isNaN(Number(path2))) {
    return path1 + "[" + path2 + "]";
  }
  return path1 + "/" + path2;
}
