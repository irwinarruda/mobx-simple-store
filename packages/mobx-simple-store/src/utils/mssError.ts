export type MssErrorParams = {
  message: string;
  currentPath?: string;
  type?: keyof Console;
};

export function mssError({
  message,
  currentPath,
  type = 'error',
}: MssErrorParams) {
  let errorMessage = `[mobx-simple-store] Error`;
  if (currentPath) {
    errorMessage += ` at ${currentPath}`;
  }
  errorMessage += `: ${message}`;
  if (type === 'error') {
    throw errorMessage;
  }
  (console[type] as any)(errorMessage);
}
